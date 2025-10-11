
import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useHealthProfile } from '../hooks/useHealthProfile'
import {User, Heart, Utensils, Target, CheckCircle} from 'lucide-react'
import toast from 'react-hot-toast'

const HealthProfile: React.FC = () => {
  const { user, isAuthenticated, signIn } = useAuth()
  const { profile, loading, createProfile, updateProfile } = useHealthProfile(user?.userId || null)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    age: '',
    height: '',
    weight: '',
    gender: '',
    blood_group: '',
    diseases: [] as Array<{name: string, severity: string}>,
    allergies: [] as string[],
    dietary_habit: '',
    preferred_cuisine: [] as string[],
    religious_restrictions: [] as string[],
    activity_level: '',
    work_type: '',
    ayurvedic_constitution: '',
    health_goals: [] as string[],
    current_medications: [] as string[]
  })

  const steps = [
    { number: 1, title: 'Basic Info', icon: User },
    { number: 2, title: 'Health Info', icon: Heart },
    { number: 3, title: 'Dietary Preferences', icon: Utensils },
    { number: 4, title: 'Goals & Lifestyle', icon: Target }
  ]

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        age: profile.age?.toString() || '',
        height: profile.height?.toString() || '',
        weight: profile.weight?.toString() || '',
        gender: profile.gender || '',
        blood_group: profile.blood_group || '',
        diseases: profile.diseases || [],
        allergies: profile.allergies || [],
        dietary_habit: profile.dietary_habit || '',
        preferred_cuisine: profile.preferred_cuisine || [],
        religious_restrictions: profile.religious_restrictions || [],
        activity_level: profile.activity_level || '',
        work_type: profile.work_type || '',
        ayurvedic_constitution: profile.ayurvedic_constitution || '',
        health_goals: profile.health_goals || [],
        current_medications: profile.current_medications || []
      })
    }
  }, [profile])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleArrayToggle = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }))
  }

  const handleDiseaseToggle = (disease: string, severity: string) => {
    setFormData(prev => {
      const existing = prev.diseases.find(d => d.name === disease)
      if (existing) {
        return {
          ...prev,
          diseases: prev.diseases.filter(d => d.name !== disease)
        }
      } else {
        return {
          ...prev,
          diseases: [...prev.diseases, { name: disease, severity }]
        }
      }
    })
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    if (!user?.userId) return

    try {
      const profileData = {
        user_id: user.userId,
        age: parseInt(formData.age),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        gender: formData.gender,
        blood_group: formData.blood_group,
        diseases: formData.diseases,
        allergies: formData.allergies,
        dietary_habit: formData.dietary_habit,
        preferred_cuisine: formData.preferred_cuisine,
        religious_restrictions: formData.religious_restrictions,
        activity_level: formData.activity_level,
        work_type: formData.work_type,
        ayurvedic_constitution: formData.ayurvedic_constitution,
        health_goals: formData.health_goals,
        current_medications: formData.current_medications
      }

      if (profile) {
        await updateProfile(profileData)
      } else {
        await createProfile(profileData)
      }
    } catch (error) {
      console.error('Failed to save profile:', error)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please login to create or update your health profile
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 font-playfair">
            Health Profile
          </h1>
          <p className="text-gray-600">
            Complete your profile to get personalized food recommendations
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number
              
              return (
                <div key={step.number} className="flex flex-col items-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                    isCompleted ? 'bg-green-600 text-white' :
                    isActive ? 'bg-orange-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <span className={`text-sm font-medium ${
                    isActive ? 'text-orange-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age *
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter your age"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height (cm) *
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter height in cm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg) *
                  </label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Enter weight in kg"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group *
                  </label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => handleInputChange('blood_group', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Health Info */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Health Information</h2>
              
              {/* Diseases */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Health Conditions (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'diabetes', 'hypertension', 'thyroid', 'heart_disease',
                    'pcod', 'arthritis', 'obesity', 'anemia'
                  ].map((disease) => (
                    <div key={disease} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">
                          {disease.replace('_', ' ')}
                        </span>
                        <input
                          type="checkbox"
                          checked={formData.diseases.some(d => d.name === disease)}
                          onChange={() => handleDiseaseToggle(disease, 'mild')}
                          className="text-orange-600 focus:ring-orange-500"
                        />
                      </div>
                      {formData.diseases.some(d => d.name === disease) && (
                        <select
                          value={formData.diseases.find(d => d.name === disease)?.severity || 'mild'}
                          onChange={(e) => {
                            const newDiseases = formData.diseases.map(d => 
                              d.name === disease ? { ...d, severity: e.target.value } : d
                            )
                            handleInputChange('diseases', newDiseases)
                          }}
                          className="w-full mt-2 px-2 py-1 border border-gray-300 rounded text-sm"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Food Allergies (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['gluten', 'dairy', 'nuts', 'soy', 'eggs', 'shellfish'].map((allergy) => (
                    <label key={allergy} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.allergies.includes(allergy)}
                        onChange={() => handleArrayToggle('allergies', allergy)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="capitalize">{allergy}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Current Medications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications (Optional)
                </label>
                <textarea
                  value={formData.current_medications.join(', ')}
                  onChange={(e) => handleInputChange('current_medications', e.target.value.split(', ').filter(m => m.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  placeholder="List your current medications, separated by commas"
                  rows={3}
                />
              </div>
            </div>
          )}

          {/* Step 3: Dietary Preferences */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Dietary Preferences</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dietary Habit *
                  </label>
                  <select
                    value={formData.dietary_habit}
                    onChange={(e) => handleInputChange('dietary_habit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Dietary Habit</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="eggetarian">Eggetarian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ayurvedic Constitution
                  </label>
                  <select
                    value={formData.ayurvedic_constitution}
                    onChange={(e) => handleInputChange('ayurvedic_constitution', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select Constitution</option>
                    <option value="vata">Vata</option>
                    <option value="pitta">Pitta</option>
                    <option value="kapha">Kapha</option>
                    <option value="vata_pitta">Vata-Pitta</option>
                    <option value="pitta_kapha">Pitta-Kapha</option>
                    <option value="vata_kapha">Vata-Kapha</option>
                  </select>
                </div>
              </div>

              {/* Preferred Cuisine */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Indian Cuisine (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'north_indian', 'south_indian', 'gujarati', 
                    'bengali', 'punjabi', 'maharashtrian'
                  ].map((cuisine) => (
                    <label key={cuisine} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferred_cuisine.includes(cuisine)}
                        onChange={() => handleArrayToggle('preferred_cuisine', cuisine)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="capitalize">{cuisine.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Religious Restrictions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Religious/Cultural Restrictions (Select all that apply)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['jain', 'halal', 'sattvic'].map((restriction) => (
                    <label key={restriction} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.religious_restrictions.includes(restriction)}
                        onChange={() => handleArrayToggle('religious_restrictions', restriction)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="capitalize">{restriction}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals & Lifestyle */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Goals & Lifestyle</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level *
                  </label>
                  <select
                    value={formData.activity_level}
                    onChange={(e) => handleInputChange('activity_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary (Little to no exercise)</option>
                    <option value="moderate">Moderate (Exercise 3-4 times/week)</option>
                    <option value="active">Active (Exercise 5+ times/week)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Type *
                  </label>
                  <select
                    value={formData.work_type}
                    onChange={(e) => handleInputChange('work_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500"
                    required
                  >
                    <option value="">Select Work Type</option>
                    <option value="desk_job">Desk Job</option>
                    <option value="field_work">Field Work</option>
                    <option value="student">Student</option>
                  </select>
                </div>
              </div>

              {/* Health Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Health Goals (Select all that apply)
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    'weight_loss', 'weight_gain', 'weight_maintenance',
                    'diabetes_control', 'heart_health', 'digestive_health'
                  ].map((goal) => (
                    <label key={goal} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.health_goals.includes(goal)}
                        onChange={() => handleArrayToggle('health_goals', goal)}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <span className="capitalize">{goal.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Saving...' : profile ? 'Update Profile' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthProfile
