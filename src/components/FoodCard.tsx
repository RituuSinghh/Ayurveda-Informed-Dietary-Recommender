
import React from 'react'
import {Star, Clock, Users, Heart} from 'lucide-react'

interface Food {
  _id: string
  name_english: string
  name_hindi: string
  cuisine_type: string
  health_benefits: string[]
  rating: number
  image_url: string
  preparation_time: number
  nutritional_values?: {
    calories: number
    protein: number
  }
}

interface FoodCardProps {
  food: Food
  reason?: string
  onViewRecipe?: (foodId: string) => void
  onRate?: (rating: number) => void
  userRating?: number
  showRating?: boolean
}

const FoodCard: React.FC<FoodCardProps> = ({
  food,
  reason,
  onViewRecipe,
  onRate,
  userRating,
  showRating = false
}) => {
  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onStarClick ? () => onStarClick(star) : undefined}
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating.toFixed(1)}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Food Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={food.image_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
          alt={food.name_english}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            {food.cuisine_type.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Food Names */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-gray-900 font-playfair">
            {food.name_english}
          </h3>
          <p className="text-orange-600 font-medium text-lg">
            {food.name_hindi}
          </p>
        </div>

        {/* Rating and Time */}
        <div className="flex items-center justify-between mb-4">
          {renderStars(food.rating)}
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="h-4 w-4 mr-1" />
            <span>{food.preparation_time}min</span>
          </div>
        </div>

        {/* Health Benefits */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Helps with:</p>
          <div className="flex flex-wrap gap-1">
            {food.health_benefits.slice(0, 3).map((benefit) => (
              <span
                key={benefit}
                className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
              >
                {benefit.replace('_', ' ')}
              </span>
            ))}
            {food.health_benefits.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{food.health_benefits.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Nutrition Info */}
        {food.nutritional_values && (
          <div className="mb-4 bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Calories: {food.nutritional_values.calories}</span>
              <span className="text-gray-600">Protein: {food.nutritional_values.protein}g</span>
            </div>
          </div>
        )}

        {/* Recommendation Reason */}
        {reason && (
          <div className="mb-4 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <p className="text-sm text-blue-800">
              <strong>Why recommended:</strong> {reason}
            </p>
          </div>
        )}

        {/* User Rating */}
        {showRating && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Rate this recommendation:</p>
            {renderStars(userRating || 0, true, onRate)}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => onViewRecipe?.(food._id)}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors"
          >
            View Recipe
          </button>
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors">
            <Heart className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FoodCard
