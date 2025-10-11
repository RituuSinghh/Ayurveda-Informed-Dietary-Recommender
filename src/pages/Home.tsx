
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import {Leaf, Heart, Brain, Shield, ArrowRight, Star} from 'lucide-react'

const Home: React.FC = () => {
  const { isAuthenticated, signIn } = useAuth()

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-orange-600" />,
      title: "AI-Powered Recommendations",
      description: "Get personalized food suggestions based on your health profile and Ayurvedic constitution"
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Health-Focused",
      description: "Foods specifically chosen to help manage your health conditions and support your wellness goals"
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: "Ancient Wisdom",
      description: "Traditional Indian foods and recipes backed by thousands of years of Ayurvedic knowledge"
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: "Allergy Safe",
      description: "Automatically filters out foods containing your allergens for safe eating"
    }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      condition: "Diabetes Management",
      quote: "The personalized recommendations helped me control my blood sugar naturally with traditional foods.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      condition: "Weight Management",
      quote: "Lost 10kg following the ancient food wisdom recommendations. Amazing results!",
      rating: 5
    },
    {
      name: "Dr. Meera Patel",
      condition: "Nutritionist",
      quote: "As a professional, I'm impressed by how this system combines modern science with traditional knowledge.",
      rating: 5
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg')] opacity-5 bg-cover bg-center"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 font-playfair">
              Ancient Indian Food
              <span className="text-orange-600 block">Wisdom</span>
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover personalized nutrition recommendations based on 5000+ years of Ayurvedic wisdom. 
              Get foods tailored to your health conditions, constitution, and dietary preferences.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Complete Your Health Profile
                </Link>
              ) : (
                <button
                  onClick={signIn}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Start Your Journey
                </button>
              )}
              
              <Link
                to="/foods"
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
              >
                Explore Foods
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">20+</div>
                <div className="text-gray-700">Ancient Recipes</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">8</div>
                <div className="text-gray-700">Health Conditions</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">3</div>
                <div className="text-gray-700">Doshas Balanced</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
              Why Choose Ancient Wisdom?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines the best of traditional Ayurvedic knowledge with modern AI technology 
              to provide you with personalized nutrition guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get personalized recommendations in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Complete Health Profile
              </h3>
              <p className="text-gray-600">
                Tell us about your health conditions, dietary preferences, and Ayurvedic constitution
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Get AI Recommendations
              </h3>
              <p className="text-gray-600">
                Our AI analyzes your profile and suggests the best ancient foods for your health
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Follow Personalized Plan
              </h3>
              <p className="text-gray-600">
                Get detailed recipes, diet plans, and track your health progress over time
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 font-playfair">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              See how ancient wisdom has transformed lives
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-orange-600">
                    {testimonial.condition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6 font-playfair">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands who have discovered the power of ancient Indian food wisdom 
            for modern health challenges.
          </p>
          
          {isAuthenticated ? (
            <Link
              to="/recommendations"
              className="inline-flex items-center bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              View My Recommendations
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          ) : (
            <button
              onClick={signIn}
              className="inline-flex items-center bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
