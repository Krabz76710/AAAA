import React, { useState } from 'react'
import { X, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'register' | 'reset'
  onModeChange: (mode: 'login' | 'register' | 'reset') => void
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const { signIn, signUp, resetPassword } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      if (mode === 'register') {
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
          return
        }

        if (password.length < 6) {
          setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
          return
        }

        const { data, error } = await signUp(email, password, {
          userType: 'individual',
          firstName,
          lastName,
          formData: {},
          documents: [],
          profileCompletion: 0
        })

        if (error) {
          setMessage({ type: 'error', text: error.message })
          
          // Check if it's a rate limit error and implement cooldown
          if (error.message.includes('after 2 seconds')) {
            // Keep loading state for additional 3 seconds to prevent rapid retries
            setTimeout(() => {
              setLoading(false)
            }, 3000)
            return
          }
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Inscription réussie ! Vérifiez votre email pour confirmer votre compte.' 
          })
        }
      } else if (mode === 'login') {
        const { data, error } = await signIn(email, password)

        if (error) {
          setMessage({ type: 'error', text: 'Email ou mot de passe incorrect' })
        } else {
          setMessage({ type: 'success', text: 'Connexion réussie !' })
          setTimeout(() => {
            onClose()
            // Force page reload to trigger useRegistration hook
            window.location.reload()
          }, 1000)
        }
      } else if (mode === 'reset') {
        const { data, error } = await resetPassword(email)

        if (error) {
          setMessage({ type: 'error', text: error.message })
        } else {
          setMessage({ 
            type: 'success', 
            text: 'Email de réinitialisation envoyé ! Vérifiez votre boîte mail.' 
          })
        }
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Une erreur est survenue' })
    } finally {
      // Only set loading to false if we didn't hit the rate limit cooldown
      if (!message || !message.text.includes('after 2 seconds')) {
        setLoading(false)
      }
    }
  }

  const getTitle = () => {
    switch (mode) {
      case 'register': return 'Créer un compte'
      case 'login': return 'Se connecter'
      case 'reset': return 'Réinitialiser le mot de passe'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span className="text-sm">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value.toUpperCase())}
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Votre nom"
                      style={{ textTransform: 'uppercase' }}
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="votre@email.com"
                required
              />
            </div>
          </div>

          {mode !== 'reset' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
              loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
            }`}
          >
            {loading ? 'Chargement...' : getTitle()}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {mode === 'login' && (
            <>
              <button
                onClick={() => onModeChange('reset')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Mot de passe oublié ?
              </button>
              <div className="mt-2">
                Pas encore de compte ?{' '}
                <button
                  onClick={() => onModeChange('register')}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  S'inscrire
                </button>
              </div>
            </>
          )}

          {mode === 'register' && (
            <div>
              Déjà un compte ?{' '}
              <button
                onClick={() => onModeChange('login')}
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Se connecter
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => onModeChange('login')}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Retour à la connexion
            </button>
          )}
        </div>
      </div>
    </div>
  )
}