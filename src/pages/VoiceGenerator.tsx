import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Slider } from '../components/ui/slider'
import { 
  Mic, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Download, 
  Volume2,
  User,
  Settings,
  CheckCircle,
  Loader2
} from 'lucide-react'

export default function VoiceGenerator() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [script, setScript] = useState('')
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [voiceSpeed, setVoiceSpeed] = useState([1])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedAudio, setGeneratedAudio] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const languages = [
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'or', name: 'Odia', flag: '🇮🇳' },
    { code: 'as', name: 'Assamese', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇮🇳' }
  ]

  const voices = [
    { id: 'male-1', name: 'Arjun', gender: 'Male', tone: 'Professional', avatar: '👨‍💼' },
    { id: 'female-1', name: 'Priya', gender: 'Female', tone: 'Warm', avatar: '👩‍💼' },
    { id: 'male-2', name: 'Vikram', gender: 'Male', tone: 'Energetic', avatar: '👨‍🎤' },
    { id: 'female-2', name: 'Anita', gender: 'Female', tone: 'Calm', avatar: '👩‍🏫' },
    { id: 'male-3', name: 'Rohit', gender: 'Male', tone: 'Friendly', avatar: '👨‍🎨' },
    { id: 'female-3', name: 'Kavya', gender: 'Female', tone: 'Authoritative', avatar: '👩‍⚖️' }
  ]

  const steps = [
    { number: 1, title: 'Script', description: 'Enter your text' },
    { number: 2, title: 'Language', description: 'Choose language' },
    { number: 3, title: 'Voice', description: 'Select voice' },
    { number: 4, title: 'Settings', description: 'Adjust parameters' },
    { number: 5, title: 'Generate', description: 'Create voiceover' }
  ]

  const handleGenerate = async () => {
    if (!script || !selectedLanguage || !selectedVoice) return
    
    setIsGenerating(true)
    try {
      let translatedText = script
      
      // Step 1: Translate text if needed (English to selected Indian language)
      if (selectedLanguage !== 'en') {
        const selectedLang = languages.find(l => l.code === selectedLanguage)
        console.log(`Translating to ${selectedLang?.name}...`)
        
        const { text: translated } = await blink.ai.generateText({
          prompt: `Translate the following text to ${selectedLang?.name}. Only return the translated text, nothing else:\n\n${script}`,
          model: 'gpt-4o-mini'
        })
        
        translatedText = translated.trim()
        console.log('Translated text:', translatedText)
      }
      
      // Step 2: Map voice selection to appropriate OpenAI voice
      const selectedVoiceData = voices.find(v => v.id === selectedVoice)
      let openaiVoice = 'nova' // default female
      
      if (selectedVoiceData?.gender === 'Male') {
        // Use male voices for male selection
        if (selectedVoiceData.tone === 'Professional') openaiVoice = 'onyx'
        else if (selectedVoiceData.tone === 'Energetic') openaiVoice = 'echo'
        else openaiVoice = 'fable'
      } else {
        // Use female voices for female selection
        if (selectedVoiceData?.tone === 'Warm') openaiVoice = 'nova'
        else if (selectedVoiceData?.tone === 'Calm') openaiVoice = 'shimmer'
        else openaiVoice = 'alloy'
      }
      
      console.log(`Using voice: ${openaiVoice} for ${selectedVoiceData?.gender} ${selectedVoiceData?.tone}`)
      
      // Step 3: Generate speech with correct voice
      const { url: audioUrl } = await blink.ai.generateSpeech({
        text: translatedText,
        voice: openaiVoice,
        model: 'tts-1',
        speed: voiceSpeed[0]
      })
      
      console.log('Generated audio URL:', audioUrl)
      
      // Step 4: Save to database
      const generation = await blink.db.voiceGenerations.create({
        userId: user.id,
        script: script,
        translatedText: translatedText,
        language: selectedLanguage,
        voice: selectedVoice,
        speed: voiceSpeed[0],
        audioUrl: audioUrl,
        createdAt: new Date().toISOString()
      })
      
      setGeneratedAudio({
        url: audioUrl,
        duration: Math.ceil(translatedText.length / 10) + 's',
        id: generation.id,
        translatedText: translatedText
      })
      
    } catch (error) {
      console.error('Generation failed:', error)
      alert(`Failed to generate voiceover: ${error.message}. Please try again.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePlayAudio = () => {
    if (!generatedAudio?.url) return

    if (isPlaying && audioElement) {
      audioElement.pause()
      setIsPlaying(false)
    } else {
      const audio = new Audio(generatedAudio.url)
      audio.play()
      setIsPlaying(true)
      setAudioElement(audio)
      
      audio.onended = () => {
        setIsPlaying(false)
        setAudioElement(null)
      }
      
      audio.onerror = () => {
        setIsPlaying(false)
        setAudioElement(null)
        alert('Error playing audio. Please try downloading instead.')
      }
    }
  }

  const handleDownloadAudio = async () => {
    if (!generatedAudio?.url) {
      alert('No audio available to download. Please generate a voiceover first.')
      return
    }

    try {
      console.log('Starting download from:', generatedAudio.url)
      
      // Create filename with language and voice info
      const selectedLang = languages.find(l => l.code === selectedLanguage)
      const selectedVoiceData = voices.find(v => v.id === selectedVoice)
      const filename = `parivaani-${selectedLang?.name || 'audio'}-${selectedVoiceData?.name || 'voice'}-${Date.now()}.mp3`
      
      // Try direct download first
      const response = await fetch(generatedAudio.url, {
        method: 'GET',
        headers: {
          'Accept': 'audio/mpeg, audio/*'
        }
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      const blob = await response.blob()
      console.log('Downloaded blob size:', blob.size, 'bytes')
      
      if (blob.size === 0) {
        throw new Error('Downloaded file is empty')
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      
      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }, 100)
      
      console.log('Download completed successfully')
      
    } catch (error) {
      console.error('Download failed:', error)
      
      // Fallback 1: Try opening in new tab
      try {
        const newWindow = window.open(generatedAudio.url, '_blank')
        if (newWindow) {
          alert('Download started in new tab. Right-click the audio and select "Save as..." to download.')
        } else {
          throw new Error('Popup blocked')
        }
      } catch (fallbackError) {
        // Fallback 2: Copy URL to clipboard
        try {
          await navigator.clipboard.writeText(generatedAudio.url)
          alert('Download failed, but audio URL copied to clipboard. Paste it in a new tab to access your audio.')
        } catch (clipboardError) {
          alert(`Download failed: ${error.message}. Please try generating the audio again.`)
        }
      }
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return script.trim().length > 0
      case 2: return selectedLanguage !== ''
      case 3: return selectedVoice !== ''
      case 4: return true
      default: return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Mic className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access the voice generator</p>
            <Button onClick={() => blink.auth.login()} className="w-full bg-purple-600 hover:bg-purple-700">
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
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">PariVaani</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/video-dubbing" className="text-gray-600 hover:text-purple-600">
                Video Dubbing
              </Link>
              <Link to="/dashboard" className="text-gray-600 hover:text-purple-600">
                Dashboard
              </Link>
              <Button 
                onClick={() => blink.auth.logout()}
                variant="outline"
                size="sm"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-full h-1 mx-4 ${
                    currentStep > step.number ? 'bg-purple-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-600">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-8">
          <CardContent className="p-6">
            {currentStep === 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Enter Your Script
                </h3>
                <Textarea
                  placeholder="Type or paste your text here... (supports all Indian languages)"
                  value={script}
                  onChange={(e) => setScript(e.target.value)}
                  className="min-h-[200px] text-lg"
                />
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    {script.length} characters
                  </span>
                  <Badge variant={script.length > 1000 ? "destructive" : "secondary"}>
                    {script.length > 1000 ? 'Premium required for longer text' : 'Within free limit'}
                  </Badge>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Language
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {languages.map((language) => (
                    <Card 
                      key={language.code}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedLanguage === language.code 
                          ? 'ring-2 ring-purple-600 bg-purple-50' 
                          : ''
                      }`}
                      onClick={() => setSelectedLanguage(language.code)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{language.flag}</div>
                        <div className="font-medium text-gray-900">{language.name}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose Voice
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {voices.map((voice) => (
                    <Card 
                      key={voice.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedVoice === voice.id 
                          ? 'ring-2 ring-purple-600 bg-purple-50' 
                          : ''
                      }`}
                      onClick={() => setSelectedVoice(voice.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{voice.avatar}</div>
                          <div>
                            <div className="font-medium text-gray-900">{voice.name}</div>
                            <div className="text-sm text-gray-500">{voice.gender} • {voice.tone}</div>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Play sample
                          }}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Preview
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Voice Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voice Speed: {voiceSpeed[0]}x
                    </label>
                    <Slider
                      value={voiceSpeed}
                      onValueChange={setVoiceSpeed}
                      max={2}
                      min={0.5}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>0.5x (Slow)</span>
                      <span>1x (Normal)</span>
                      <span>2x (Fast)</span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Preview Settings</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Language:</span>
                        <span className="ml-2 font-medium">
                          {languages.find(l => l.code === selectedLanguage)?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Voice:</span>
                        <span className="ml-2 font-medium">
                          {voices.find(v => v.id === selectedVoice)?.name}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Speed:</span>
                        <span className="ml-2 font-medium">{voiceSpeed[0]}x</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 font-medium">~{Math.ceil(script.length / 10)}s</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="text-center">
                {!generatedAudio ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Generate Your Voiceover
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Language:</span>
                          <span className="ml-2 font-medium">
                            {languages.find(l => l.code === selectedLanguage)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Voice:</span>
                          <span className="ml-2 font-medium">
                            {voices.find(v => v.id === selectedVoice)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Speed:</span>
                          <span className="ml-2 font-medium">{voiceSpeed[0]}x</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Characters:</span>
                          <span className="ml-2 font-medium">{script.length}</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 p-3 bg-white rounded border">
                        {script.substring(0, 100)}...
                      </div>
                    </div>
                    <Button 
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Volume2 className="h-5 w-5 mr-2" />
                          Generate Voiceover
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Your Voiceover is Ready!
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-800 mb-4">
                        Successfully generated voiceover in {languages.find(l => l.code === selectedLanguage)?.name}
                      </p>
                      
                      {/* Show translation if text was translated */}
                      {generatedAudio?.translatedText && generatedAudio.translatedText !== script && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <h4 className="font-medium text-blue-900 mb-2">Translated Text:</h4>
                          <p className="text-blue-800 text-sm italic">
                            "{generatedAudio.translatedText}"
                          </p>
                        </div>
                      )}
                      
                      {/* Voice and settings info */}
                      <div className="bg-white border rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Voice:</span>
                            <span className="ml-2 font-medium">
                              {voices.find(v => v.id === selectedVoice)?.name} ({voices.find(v => v.id === selectedVoice)?.gender})
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Speed:</span>
                            <span className="ml-2 font-medium">{voiceSpeed[0]}x</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Duration:</span>
                            <span className="ml-2 font-medium">{generatedAudio.duration}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Language:</span>
                            <span className="ml-2 font-medium">{languages.find(l => l.code === selectedLanguage)?.name}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-4">
                        <Button 
                          variant="outline"
                          onClick={handlePlayAudio}
                          disabled={!generatedAudio?.url}
                          size="lg"
                        >
                          {isPlaying ? (
                            <>
                              <Volume2 className="h-4 w-4 mr-2" />
                              Playing...
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play Audio
                            </>
                          )}
                        </Button>
                        <Button 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={handleDownloadAudio}
                          disabled={!generatedAudio?.url}
                          size="lg"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download MP3
                        </Button>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setCurrentStep(1)
                        setScript('')
                        setSelectedLanguage('')
                        setSelectedVoice('')
                        setGeneratedAudio(null)
                      }}
                      variant="outline"
                    >
                      Create Another Voiceover
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < 5 ? (
            <Button 
              onClick={() => setCurrentStep(currentStep + 1)}
              disabled={!canProceed()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}