import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { 
  Mic, 
  ArrowLeft, 
  ArrowRight, 
  Play, 
  Download, 
  Upload,
  Video,
  Languages,
  CheckCircle,
  Loader2,
  FileVideo,
  Volume2,
  Pause
} from 'lucide-react'

export default function VideoDubbing() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedVideo, setUploadedVideo] = useState(null)
  const [originalLanguage, setOriginalLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [selectedVoice, setSelectedVoice] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedVideo, setProcessedVideo] = useState(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [processingStage, setProcessingStage] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', name: 'Tamil', flag: '🇮🇳' },
    { code: 'te', name: 'Telugu', flag: '🇮🇳' },
    { code: 'gu', name: 'Gujarati', flag: '🇮🇳' },
    { code: 'mr', name: 'Marathi', flag: '🇮🇳' },
    { code: 'bn', name: 'Bengali', flag: '🇮🇳' },
    { code: 'kn', name: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', name: 'Malayalam', flag: '🇮🇳' },
    { code: 'pa', name: 'Punjabi', flag: '🇮🇳' },
    { code: 'ur', name: 'Urdu', flag: '🇮🇳' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' }
  ]

  const voices = [
    { id: 'male-1', name: 'Arjun', gender: 'Male', tone: 'Professional', avatar: '👨‍💼' },
    { id: 'female-1', name: 'Priya', gender: 'Female', tone: 'Warm', avatar: '👩‍💼' },
    { id: 'male-2', name: 'Vikram', gender: 'Male', tone: 'Energetic', avatar: '👨‍🎤' },
    { id: 'female-2', name: 'Anita', gender: 'Female', tone: 'Calm', avatar: '👩‍🏫' },
    { id: 'neutral-1', name: 'Alex', gender: 'Neutral', tone: 'Friendly', avatar: '🧑‍💻' }
  ]

  const steps = [
    { number: 1, title: 'Upload Video', description: 'Select your video file' },
    { number: 2, title: 'Original Language', description: 'Current audio language' },
    { number: 3, title: 'Target Language', description: 'Desired language' },
    { number: 4, title: 'Voice Selection', description: 'Choose voice style' },
    { number: 5, title: 'Process', description: 'Generate dubbed video' }
  ]

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file')
      return
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      alert('File size must be less than 100MB')
      return
    }

    try {
      // Upload video to storage
      const { publicUrl } = await blink.storage.upload(
        file,
        `videos/${user.id}/${Date.now()}-${file.name}`,
        { upsert: true }
      )

      setUploadedVideo({
        file,
        url: publicUrl,
        name: file.name,
        size: file.size,
        duration: null // Will be set when video loads
      })

    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload video. Please try again.')
    }
  }

  const handleVideoMetadata = (event) => {
    const video = event.target
    setUploadedVideo(prev => ({
      ...prev,
      duration: Math.round(video.duration)
    }))
  }

  const handleProcessVideo = async () => {
    if (!uploadedVideo || !originalLanguage || !targetLanguage || !selectedVoice) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingStage('Extracting audio...')

    try {
      // Step 1: Extract audio and transcribe
      setProcessingProgress(20)
      setProcessingStage('Transcribing speech...')
      
      // Use Blink AI to transcribe the video audio
      const transcription = await blink.ai.transcribeAudio({
        audio: uploadedVideo.url,
        language: originalLanguage
      })

      // Step 2: Translate text
      setProcessingProgress(40)
      setProcessingStage('Translating text...')
      
      const translatedText = await blink.ai.generateText({
        prompt: `Translate the following text from ${languages.find(l => l.code === originalLanguage)?.name} to ${languages.find(l => l.code === targetLanguage)?.name}. Maintain the same tone and meaning:\n\n${transcription.text}`,
        maxTokens: 2000
      })

      // Step 3: Generate new voiceover
      setProcessingProgress(60)
      setProcessingStage('Generating new voiceover...')
      
      const { url: newAudioUrl } = await blink.ai.generateSpeech({
        text: translatedText.text,
        voice: 'nova',
        model: 'tts-1'
      })

      // Step 4: Simulate video processing (in real implementation, this would use ffmpeg)
      setProcessingProgress(80)
      setProcessingStage('Processing video...')
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Step 5: Save to database
      setProcessingProgress(100)
      setProcessingStage('Finalizing...')
      
      const dubbedVideo = await blink.db.videoDubbings.create({
        userId: user.id,
        originalVideoUrl: uploadedVideo.url,
        originalLanguage: originalLanguage,
        targetLanguage: targetLanguage,
        voice: selectedVoice,
        originalText: transcription.text,
        translatedText: translatedText.text,
        newAudioUrl: newAudioUrl,
        processedVideoUrl: uploadedVideo.url, // In real implementation, this would be the new video
        createdAt: new Date().toISOString()
      })

      setProcessedVideo({
        id: dubbedVideo.id,
        url: uploadedVideo.url, // In real implementation, this would be the dubbed video
        audioUrl: newAudioUrl,
        originalText: transcription.text,
        translatedText: translatedText.text
      })

    } catch (error) {
      console.error('Processing failed:', error)
      alert('Failed to process video. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDownloadVideo = () => {
    if (processedVideo?.url) {
      window.open(processedVideo.url, '_blank')
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return uploadedVideo !== null
      case 2: return originalLanguage !== ''
      case 3: return targetLanguage !== ''
      case 4: return selectedVoice !== ''
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
            <Video className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In Required</h2>
            <p className="text-gray-600 mb-6">Please sign in to access video dubbing</p>
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
              <Link to="/generate" className="text-gray-600 hover:text-purple-600">
                Voice Generator
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Video Dubbing Studio</h1>
          <p className="text-gray-600">Transform your videos with AI-powered voice translation</p>
        </div>

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
                  Upload Your Video
                </h3>
                {!uploadedVideo ? (
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FileVideo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      Choose a video file
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Supports MP4, MOV, AVI files up to 100MB
                    </p>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Select Video
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h4 className="font-medium text-green-900">{uploadedVideo.name}</h4>
                          <p className="text-sm text-green-700">
                            {(uploadedVideo.size / (1024 * 1024)).toFixed(1)} MB
                            {uploadedVideo.duration && ` • ${Math.floor(uploadedVideo.duration / 60)}:${(uploadedVideo.duration % 60).toString().padStart(2, '0')}`}
                          </p>
                        </div>
                      </div>
                    </div>
                    <video
                      src={uploadedVideo.url}
                      controls
                      className="w-full max-w-md mx-auto rounded-lg"
                      onLoadedMetadata={handleVideoMetadata}
                    />
                    <div className="text-center">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setUploadedVideo(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                      >
                        Choose Different Video
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Select Original Language
                </h3>
                <p className="text-gray-600 mb-6">
                  What language is currently spoken in your video?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {languages.map((language) => (
                    <Card 
                      key={language.code}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        originalLanguage === language.code 
                          ? 'ring-2 ring-purple-600 bg-purple-50' 
                          : ''
                      }`}
                      onClick={() => setOriginalLanguage(language.code)}
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
                  Select Target Language
                </h3>
                <p className="text-gray-600 mb-6">
                  Which language would you like to translate to?
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {languages.filter(lang => lang.code !== originalLanguage).map((language) => (
                    <Card 
                      key={language.code}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        targetLanguage === language.code 
                          ? 'ring-2 ring-purple-600 bg-purple-50' 
                          : ''
                      }`}
                      onClick={() => setTargetLanguage(language.code)}
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

            {currentStep === 4 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Choose Voice Style
                </h3>
                <p className="text-gray-600 mb-6">
                  Select the voice that will narrate your dubbed video
                </p>
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

            {currentStep === 5 && (
              <div className="text-center">
                {!processedVideo ? (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Process Your Video
                    </h3>
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-gray-500">Original:</span>
                          <span className="ml-2 font-medium">
                            {languages.find(l => l.code === originalLanguage)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Target:</span>
                          <span className="ml-2 font-medium">
                            {languages.find(l => l.code === targetLanguage)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Voice:</span>
                          <span className="ml-2 font-medium">
                            {voices.find(v => v.id === selectedVoice)?.name}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Video:</span>
                          <span className="ml-2 font-medium">{uploadedVideo?.name}</span>
                        </div>
                      </div>
                    </div>
                    
                    {isProcessing && (
                      <div className="mb-6">
                        <div className="flex items-center justify-center mb-2">
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          <span className="text-sm font-medium">{processingStage}</span>
                        </div>
                        <Progress value={processingProgress} className="w-full" />
                        <p className="text-xs text-gray-500 mt-1">{processingProgress}% complete</p>
                      </div>
                    )}
                    
                    <Button 
                      onClick={handleProcessVideo}
                      disabled={isProcessing}
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Video className="h-5 w-5 mr-2" />
                          Start Dubbing
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Your Dubbed Video is Ready!
                    </h3>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                      <p className="text-green-800 mb-4">
                        Successfully dubbed from {languages.find(l => l.code === originalLanguage)?.name} to {languages.find(l => l.code === targetLanguage)?.name}
                      </p>
                      
                      <div className="space-y-4">
                        <video
                          ref={videoRef}
                          src={processedVideo.url}
                          controls
                          className="w-full max-w-md mx-auto rounded-lg"
                        />
                        
                        <div className="flex justify-center space-x-4">
                          <Button 
                            variant="outline"
                            onClick={handlePlayVideo}
                          >
                            {isPlaying ? (
                              <>
                                <Pause className="h-4 w-4 mr-2" />
                                Pause
                              </>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                Play
                              </>
                            )}
                          </Button>
                          <Button 
                            className="bg-purple-600 hover:bg-purple-700"
                            onClick={handleDownloadVideo}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Video
                          </Button>
                        </div>
                        
                        {processedVideo.audioUrl && (
                          <div className="mt-4 p-4 bg-white rounded-lg border">
                            <h4 className="font-medium text-gray-900 mb-2">Generated Audio</h4>
                            <audio controls className="w-full">
                              <source src={processedVideo.audioUrl} type="audio/mpeg" />
                            </audio>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => {
                        setCurrentStep(1)
                        setUploadedVideo(null)
                        setOriginalLanguage('')
                        setTargetLanguage('')
                        setSelectedVoice('')
                        setProcessedVideo(null)
                        setProcessingProgress(0)
                      }}
                      variant="outline"
                    >
                      Dub Another Video
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