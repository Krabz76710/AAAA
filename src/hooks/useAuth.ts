import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Récupérer la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Écouter les changements d'authentification
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Inscription avec email et mot de passe
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            user_type: userData.userType,
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      })

      if (error) throw error

      // Le profil sera créé automatiquement par le trigger handle_new_user
      // Pas besoin d'insertion manuelle ici

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Connexion
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Déconnexion
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Réinitialisation du mot de passe
  const resetPassword = async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Mise à jour du profil
  const updateProfile = async (profileData: any) => {
    if (!user) return { error: 'Utilisateur non connecté' }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          profile_data: profileData.formData,
          documents: profileData.documents || [],
          profile_completion: profileData.profileCompletion || 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  // Récupérer le profil
  const getProfile = async () => {
    if (!user) return { data: null, error: 'Utilisateur non connecté' }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
    getProfile
  }
}