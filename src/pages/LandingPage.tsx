import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { blink } from '../blink/client'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  Mic, 
  Globe, 
  Zap, 
  Download, 
  Star, 
  Play, 
  Menu, 
  X,
  CheckCircle,
  Users,
  Clock,
  Shield,
  Video
} from 'lucide-react'

export default function LandingPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  const languages = [
    'Hindi', 'Tamil', 'Telugu', 'Gujarati', 'Marathi', 'Bengali', 
    'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Assamese', 'Urdu'
  ]

  const features = [
    {
      icon: <Globe className="h-8 w-8 text-purple-600" />,
      title: "15+ Indian Languages",
      description: "Support for all major Indian languages with authentic accents and pronunciations"
    },
    {
      icon: <Mic className="h-8 w-8 text-purple-600" />,
      title: "AI-Powered Voices",
      description: "Natural-sounding male and female voices powered by advanced AI technology"
    },
    {
      icon: <Zap className="h-8 w-8 text-purple-600" />,
      title: "Lightning Fast",
      description: "Generate professional voiceovers in seconds, not hours"
    },
    {
      icon: <Download className="h-8 w-8 text-purple-600" />,
      title: "Instant Download",
      description: "Download your voiceovers as high-quality MP3 files instantly"
    }
  ]

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Content Creator",
      content: "PariVaani has revolutionized my content creation process. The Hindi voices are incredibly natural!",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Small Business Owner",
      content: "Perfect for creating promotional videos in regional languages. Saved me thousands on voice actors.",
      rating: 5
    },
    {
      name: "Anita Patel",
      role: "Educator",
      content: "The Gujarati voice quality is outstanding. My students love the educational content I create.",
      rating: 5
    }
  ]

  const stats = [
    { number: "50,000+", label: "Voiceovers Generated" },
    { number: "15+", label: "Indian Languages" },
    { number: "10,000+", label: "Happy Users" },
    { number: "99.9%", label: "Uptime" }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
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

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/pricing" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                  Pricing
                </Link>
                <Link to="/support" className="text-gray-600 hover:text-purple-600 px-3 py-2 text-sm font-medium">
                  Support
                </Link>
                {user ? (
                  <Link to="/dashboard">
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Button 
                    onClick={() => blink.auth.login()}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-600 hover:text-purple-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link to="/pricing" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600">
                Pricing
              </Link>
              <Link to="/support" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-purple-600">
                Support
              </Link>
              {user ? (
                <Link to="/dashboard" className="block px-3 py-2">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <div className="px-3 py-2">
                  <Button 
                    onClick={() => blink.auth.login()}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Create Professional
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Indian Language Voiceovers
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Transform your text into natural-sounding voiceovers in 15+ Indian languages. 
              Perfect for content creators, businesses, and educators.
            </p>
            
            {/* Language Pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {languages.slice(0, 8).map((lang) => (
                <Badge key={lang} variant="secondary" className="bg-white/20 text-white border-white/30">
                  {lang}
                </Badge>
              ))}
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                +4 more
              </Badge>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to={user ? "/generate" : "#"}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-semibold px-8 py-3 text-lg"
                  onClick={!user ? () => blink.auth.login() : undefined}
                >
                  <Mic className="mr-2 h-5 w-5" />
                  Create Voiceover
                </Button>
              </Link>
              <Link to={user ? "/video-dubbing" : "#"}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-700 to-purple-800 hover:from-purple-800 hover:to-purple-900 text-white px-8 py-3 text-lg"
                  onClick={!user ? () => blink.auth.login() : undefined}
                >
                  <Video className="mr-2 h-5 w-5" />
                  Dub Videos
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-900 px-8 py-3 text-lg"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-400">{stat.number}</div>
                  <div className="text-purple-200 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose PariVaani?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the power of AI-driven voice generation designed specifically for Indian languages and accents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Create professional voiceovers in just 4 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Enter Your Script", description: "Type or paste your text in any Indian language" },
              { step: "2", title: "Choose Language & Voice", description: "Select from 15+ languages and voice options" },
              { step: "3", title: "Customize Settings", description: "Adjust speed, tone, and other voice parameters" },
              { step: "4", title: "Generate & Download", description: "Get your professional voiceover as MP3" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of satisfied creators and businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade as you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Free",
                price: "₹0",
                period: "/month",
                features: ["5 voiceovers/month", "Basic voices", "30 seconds max", "Standard quality"],
                cta: "Get Started",
                popular: false
              },
              {
                name: "Creator",
                price: "₹299",
                period: "/month",
                features: ["50 voiceovers/month", "Premium voices", "5 minutes max", "HD quality", "Priority support"],
                cta: "Start Free Trial",
                popular: true
              },
              {
                name: "Business",
                price: "₹799",
                period: "/month",
                features: ["Unlimited voiceovers", "All premium voices", "No time limit", "Commercial license", "API access"],
                cta: "Contact Sales",
                popular: false
              }
            ].map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-purple-500 shadow-lg scale-105' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-500 ml-1">{plan.period}</span>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/pricing">
              <Button variant="outline" size="lg">
                View All Plans & Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Amazing Voiceovers?
          </h2>
          <p className="text-xl mb-8 text-purple-100">
            Join thousands of creators who trust PariVaani for their voiceover needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={user ? "/generate" : "#"}>
              <Button 
                size="lg" 
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                onClick={!user ? () => blink.auth.login() : undefined}
              >
                <Mic className="mr-2 h-5 w-5" />
                Start Creating Now
              </Button>
            </Link>
            <Link to="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3 text-lg"
              >
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
                  <Mic className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold">PariVaani</span>
              </div>
              <p className="text-gray-400 mb-4">
                Professional AI-powered voiceover generator for Indian languages.
              </p>
              <div className="flex space-x-4">
                <Users className="h-5 w-5 text-gray-400" />
                <Clock className="h-5 w-5 text-gray-400" />
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/generate" className="hover:text-white">Voice Generator</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/dashboard" className="hover:text-white">Dashboard</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/support" className="hover:text-white">Help Center</Link></li>
                <li><a href="mailto:support@parivaani.com" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PariVaani. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}