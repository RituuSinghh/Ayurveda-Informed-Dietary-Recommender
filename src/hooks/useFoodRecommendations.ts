
import { useState, useEffect, useCallback } from 'react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface Food {
  _id: string
  name_english: string
  name_hindi: string
  cuisine_type: string
  health_benefits: string[]
  rating: number
  image_url: string
  nutritional_values: any
  ayurvedic_properties: any
}

interface Recommendation {
  _id?: string
  user_id: string
  food_id: string
  reason: string
  score: number
  health_match: string[]
  generated_at: string
  user_rating?: number
  food?: Food
}

export function useFoodRecommendations(userId: string | null, userProfile: any) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)

  const generateRecommendations = useCallback(async () => {
    if (!userId || !userProfile) return

    setLoading(true)
    try {
      // Get all foods
      const { list: foods } = await lumi.entities.ancient_foods.list()
      
      if (!foods || foods.length === 0) {
        setLoading(false)
        return
      }

      // Simple recommendation algorithm
      const scoredFoods = foods.map((food: Food) => {
        let score = 50 // Base score
        
        // Health benefits matching
        const userDiseases = userProfile.diseases?.map((d: any) => d.name) || []
        const matchingBenefits = food.health_benefits.filter(benefit => 
          userDiseases.includes(benefit)
        )
        score += matchingBenefits.length * 20

        // Dietary compatibility
        if (food.dietary_compatibility?.includes(userProfile.dietary_habit)) {
          score += 15
        }

        // Ayurvedic constitution matching
        if (food.ayurvedic_properties?.dosha_balance?.includes(userProfile.ayurvedic_constitution) ||
            food.ayurvedic_properties?.dosha_balance?.includes('tridosha')) {
          score += 10
        }

        // Activity level matching
        if (userProfile.activity_level === 'active' && food.nutritional_values?.protein > 6) {
          score += 5
        }

        // Season matching (simplified - assume current season is winter)
        if (food.season?.includes('winter') || food.season?.includes('all')) {
          score += 5
        }

        // Avoid allergens
        const hasAllergens = userProfile.allergies?.some((allergy: string) =>
          food.ingredients?.some((ingredient: any) => 
            ingredient.name.toLowerCase().includes(allergy.toLowerCase())
          )
        )
        if (hasAllergens) {
          score -= 30
        }

        return {
          food,
          score: Math.min(100, Math.max(0, score)),
          health_match: matchingBenefits,
          reason: generateReason(food, userProfile, matchingBenefits)
        }
      })

      // Sort by score and take top 8
      const topRecommendations = scoredFoods
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)

      // Save recommendations to database
      const savedRecommendations = []
      for (const rec of topRecommendations) {
        try {
          const saved = await lumi.entities.food_recommendations.create({
            user_id: userId,
            food_id: rec.food._id,
            reason: rec.reason,
            score: rec.score,
            health_match: rec.health_match,
            generated_at: new Date().toISOString()
          })
          savedRecommendations.push({
            ...saved,
            food: rec.food
          })
        } catch (error) {
          console.error('Failed to save recommendation:', error)
        }
      }

      setRecommendations(savedRecommendations)
      toast.success('New recommendations generated!')
    } catch (error) {
      console.error('Failed to generate recommendations:', error)
      toast.error('Failed to generate recommendations')
    } finally {
      setLoading(false)
    }
  }, [userId, userProfile])

  const fetchExistingRecommendations = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    try {
      const { list } = await lumi.entities.food_recommendations.list({
        filter: { user_id: userId },
        sort: { generated_at: -1 },
        limit: 8
      })

      if (list && list.length > 0) {
        // Fetch food details for each recommendation
        const enrichedRecommendations = await Promise.all(
          list.map(async (rec: any) => {
            try {
              const food = await lumi.entities.ancient_foods.get(rec.food_id)
              return { ...rec, food }
            } catch (error) {
              console.error('Failed to fetch food details:', error)
              return rec
            }
          })
        )
        setRecommendations(enrichedRecommendations)
      } else {
        // No existing recommendations, generate new ones
        generateRecommendations()
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }, [userId, generateRecommendations])

  const rateRecommendation = async (recommendationId: string, rating: number) => {
    try {
      await lumi.entities.food_recommendations.update(recommendationId, {
        user_rating: rating
      })
      
      setRecommendations(prev => 
        prev.map(rec => 
          rec._id === recommendationId 
            ? { ...rec, user_rating: rating }
            : rec
        )
      )
      
      toast.success('Thank you for your feedback!')
    } catch (error) {
      console.error('Failed to rate recommendation:', error)
      toast.error('Failed to save rating')
    }
  }

  useEffect(() => {
    fetchExistingRecommendations()
  }, [fetchExistingRecommendations])

  return {
    recommendations,
    loading,
    generateRecommendations,
    rateRecommendation
  }
}

function generateReason(food: any, userProfile: any, healthMatches: string[]): string {
  const reasons = []
  
  if (healthMatches.length > 0) {
    reasons.push(`helps with ${healthMatches.join(', ')}`)
  }
  
  if (food.ayurvedic_properties?.dosha_balance?.includes(userProfile.ayurvedic_constitution)) {
    reasons.push(`balances your ${userProfile.ayurvedic_constitution} constitution`)
  }
  
  if (food.dietary_compatibility?.includes(userProfile.dietary_habit)) {
    reasons.push(`matches your ${userProfile.dietary_habit} diet`)
  }
  
  if (food.nutritional_values?.fiber > 3) {
    reasons.push('rich in fiber')
  }
  
  if (food.nutritional_values?.protein > 5) {
    reasons.push('good protein source')
  }

  return `Recommended because: ${reasons.join(', ')}`
}
