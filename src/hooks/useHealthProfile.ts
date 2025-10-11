
import { useState, useEffect, useCallback } from 'react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'

interface HealthProfile {
  _id?: string
  user_id: string
  age: number
  height: number
  weight: number
  gender: string
  blood_group: string
  diseases: Array<{name: string, severity: string}>
  allergies: string[]
  dietary_habit: string
  preferred_cuisine: string[]
  religious_restrictions: string[]
  activity_level: string
  work_type: string
  ayurvedic_constitution: string
  health_goals: string[]
  current_medications: string[]
}

export function useHealthProfile(userId: string | null) {
  const [profile, setProfile] = useState<HealthProfile | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchProfile = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    try {
      const { list } = await lumi.entities.user_health_profiles.list({
        filter: { user_id: userId }
      })
      
      if (list && list.length > 0) {
        setProfile(list[0])
      }
    } catch (error) {
      console.error('Failed to fetch health profile:', error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  const createProfile = async (profileData: Omit<HealthProfile, '_id'>) => {
    try {
      const newProfile = await lumi.entities.user_health_profiles.create({
        ...profileData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      setProfile(newProfile)
      toast.success('Health profile created successfully!')
      return newProfile
    } catch (error) {
      console.error('Failed to create profile:', error)
      toast.error('Failed to create health profile')
      throw error
    }
  }

  const updateProfile = async (updates: Partial<HealthProfile>) => {
    if (!profile?._id) return

    try {
      const updatedProfile = await lumi.entities.user_health_profiles.update(profile._id, {
        ...updates,
        updatedAt: new Date().toISOString()
      })
      setProfile(updatedProfile)
      toast.success('Health profile updated successfully!')
      return updatedProfile
    } catch (error) {
      console.error('Failed to update profile:', error)
      toast.error('Failed to update health profile')
      throw error
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return {
    profile,
    loading,
    createProfile,
    updateProfile,
    fetchProfile
  }
}
