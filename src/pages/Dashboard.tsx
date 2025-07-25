import { useState, useEffect, useCallback } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  ArrowLeft, 
  Plus, 
  Play, 
  Download, 
  Calendar,
  Clock,
  Languages,
  User,
  BarChart3,
  Mic,
  FileAudio,
  TrendingUp
} from 'lucide-react'
import { blink } from '../blink/client'

interface DashboardProps {
  user: any
  onNavigate: (page: string) => void
}

const Dashboard = ({ user, onNavigate }: DashboardProps) => {
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalGenerations: 0,
    totalCharacters: 0,
    favoriteLanguage: 'Hindi',
    thisMonth: 0
  })

  const loadGenerations = useCallback(async () => {
    try {
      const data = await blink.db.voiceGenerations.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        limit: 20
      })
      
      setGenerations(data)
      
      // Calculate stats
      const totalChars = data.reduce((sum, gen) => sum + (gen.script?.length || 0), 0)
      const thisMonth = data.filter(gen => {
        const genDate = new Date(gen.createdAt)
        const now = new Date()
        return genDate.getMonth() === now.getMonth() && genDate.getFullYear() === now.getFullYear()
      }).length

      setStats({
        totalGenerations: data.length,
        totalCharacters: totalChars,
        favoriteLanguage: 'Hindi', // Could calculate from data
        thisMonth
      })
    } catch (error) {
      console.error('Failed to load generations:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      loadGenerations()
    }
  }, [user, loadGenerations])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getLanguageName = (code: string) => {
    const languages = {
      'hi': 'Hindi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'gu': 'Gujarati',
      'bn': 'Bengali',
      'mr': 'Marathi',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'pa': 'Punjabi',
      'or': 'Odia',
      'as': 'Assamese',
      'ur': 'Urdu'
    }
    return languages[code] || code
  }

  const getVoiceName = (voiceId: string) => {
    const voices = {
      'male-1': 'Arjun',
      'female-1': 'Priya',
      'male-2': 'Vikram',
      'female-2': 'Ananya'
    }
    return voices[voiceId] || voiceId
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your dashboard
            </p>
            <Button onClick={() => blink.auth.login()} className="w-full gradient-primary">
              Sign In to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onNavigate('landing')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text">PariVaani</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.email}</span>
              <Button onClick={() => onNavigate('generator')} className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                New Voiceover
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your voiceovers and track your usage</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Voiceovers</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalGenerations}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileAudio className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.thisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Characters Used</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalCharacters.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Favorite Language</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.favoriteLanguage}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Languages className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Generations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Voiceovers</span>
              <Button onClick={() => onNavigate('generator')} size="sm" className="gradient-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <span className="ml-3 text-gray-600">Loading your voiceovers...</span>
              </div>
            ) : generations.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No voiceovers yet</h3>
                <p className="text-gray-600 mb-6">Create your first voiceover to get started</p>
                <Button onClick={() => onNavigate('generator')} className="gradient-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Voiceover
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {generations.map((generation, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">
                            {getLanguageName(generation.language)}
                          </Badge>
                          <Badge variant="outline">
                            <User className="w-3 h-3 mr-1" />
                            {getVoiceName(generation.voice)}
                          </Badge>
                          <Badge variant="outline">
                            {generation.speed}x speed
                          </Badge>
                        </div>
                        
                        <p className="text-gray-900 mb-2 line-clamp-2">
                          {generation.script}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(generation.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {generation.script?.length || 0} characters
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="outline" size="sm">
                          <Play className="w-4 h-4 mr-1" />
                          Play
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default Dashboard