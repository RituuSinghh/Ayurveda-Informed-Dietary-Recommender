
import React from 'react'
import { useAuth } from '../hooks/useAuth'
import { useHealthProfile } from '../hooks/useHealthProfile'
import { useFoodRecommendations } from '../hooks/useFoodRecommendations'
import { useNavigate } from 'react-router-dom'
import FoodCard from '../components/FoodCard'
import {RefreshCw, User, AlertCircle} from 'lucide-react'

const Recommendations: React.FC = () => {
  const { user, isAuthenticated, signIn } = useAuth()
  const { profile, loading: profileLoading } = useHealthProfile(user?.userId || null)
  const { recommendations, loading, generateRecommendations, rateRecommendation } = useFoodRecommendations(user?.userId || null, profile)
  const navigate = useNavigate()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to view your personalized food recommendations
          </p>
          <button
            onClick={signIn}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Login Now
          </button>
        </div>
      </div>
    )
  }

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your health profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-orange-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h2>
          <p className="text-gray-600 mb-6">
            We need your health information to provide personalized food recommendations
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Complete Profile
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 font-playfair">
                Your Personalized Recommendations
              </h1>
              <p className="text-gray-600">
                Based on your health profile and Ayurvedic constitution
              </p>
            </div>
            <button
              onClick={generateRecommendations}
              disabled={loading}
              className="mt-4 md:mt-0 inline-flex items-center bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <RefreshCw className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Generate New Recommendations
            </button>
          </div>

          {/* Profile Summary */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-sm text-gray-600">Constitution</div>
              <div className="font-semibold text-orange-600 capitalize">
                {profile.ayurvedic_constitution?.replace('_', '-')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Dietary Habit</div>
              <div className="font-semibold text-green-600 capitalize">
                {profile.dietary_habit?.replace('_', ' ')}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Health Goals</div>
              <div className="font-semibold text-blue-600">
                {profile.health_goals?.length || 0} Active
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">Conditions</div>
              <div className="font-semibold text-purple-600">
                {profile.diseases?.length || 0} Tracked
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating your personalized recommendations...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-600 mb-6">
              Click "Generate New Recommendations" to get personalized food suggestions
            </p>
            <button
              onClick={generateRecommendations}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Get My Recommendations
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Top Recommendations for You
              </h2>
              <p className="text-gray-600">
                {recommendations.length} foods selected based on your health profile
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation) => (
                <FoodCard
                  key={recommendation._id}
                  food={recommendation.food!}
                  reason={recommendation.reason}
                  onViewRecipe={(foodId) => navigate(`/foods/${foodId}`)}
                  onRate={(rating) => rateRecommendation(recommendation._id!, rating)}
                  userRating={recommendation.user_rating}
                  showRating={true}
                />
              ))}
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-blue-50 border-l-4 border-blue-400 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💡 How We Choose Your Foods
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• Foods that help manage your specific health conditions</li>
                <li>• Compatible with your dietary preferences and restrictions</li>
                <li>• Balanced according to your Ayurvedic constitution</li>
                <li>• Suitable for current season and your activity level</li>
                <li>• Free from your known allergens</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Recommendations
