import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { 
  ArrowLeft, 
  Check, 
  Star,
  Mic,
  Zap,
  Crown,
  Rocket
} from 'lucide-react'

interface PricingProps {
  user: any
  onNavigate: (page: string) => void
}

const Pricing = ({ user, onNavigate }: PricingProps) => {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for trying out PariVaani',
      icon: <Mic className="w-6 h-6" />,
      color: 'bg-gray-100 text-gray-600',
      features: [
        '5 voiceovers per month',
        'Up to 500 characters per voiceover',
        '3 Indian languages',
        '2 voice options',
        'Standard quality audio',
        'MP3 download'
      ],
      limitations: [
        'Limited language support',
        'Basic voice options',
        'Standard audio quality'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Creator',
      price: '₹299',
      period: 'per month',
      description: 'Ideal for content creators and educators',
      icon: <Zap className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600',
      features: [
        '50 voiceovers per month',
        'Up to 2,000 characters per voiceover',
        'All 15+ Indian languages',
        '8 premium voice options',
        'High-quality audio (320kbps)',
        'Priority processing',
        'Voice speed control',
        'Email support'
      ],
      limitations: [],
      cta: 'Start Creator Plan',
      popular: true
    },
    {
      name: 'Business',
      price: '₹799',
      period: 'per month',
      description: 'Perfect for businesses and agencies',
      icon: <Crown className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600',
      features: [
        '200 voiceovers per month',
        'Up to 5,000 characters per voiceover',
        'All 15+ Indian languages',
        '12 premium voice options',
        'Studio-quality audio (320kbps)',
        'Instant processing',
        'Advanced voice controls',
        'Custom voice training (coming soon)',
        'Priority support',
        'Commercial usage rights'
      ],
      limitations: [],
      cta: 'Start Business Plan',
      popular: false
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'pricing',
      description: 'For large organizations with custom needs',
      icon: <Rocket className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-600',
      features: [
        'Unlimited voiceovers',
        'Unlimited characters',
        'All current and future languages',
        'Custom voice cloning',
        'API access',
        'White-label solution',
        'Dedicated account manager',
        '24/7 phone support',
        'Custom integrations',
        'SLA guarantee'
      ],
      limitations: [],
      cta: 'Contact Sales',
      popular: false
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we\'ll prorate the billing accordingly.'
    },
    {
      question: 'What languages are supported?',
      answer: 'We support 15+ Indian languages including Hindi, Tamil, Telugu, Gujarati, Bengali, Marathi, Kannada, Malayalam, Punjabi, Odia, Assamese, and Urdu.'
    },
    {
      question: 'Can I use the voiceovers commercially?',
      answer: 'Yes, all paid plans include commercial usage rights. You can use the generated voiceovers in your business projects, YouTube videos, podcasts, and more.'
    },
    {
      question: 'What audio quality do you provide?',
      answer: 'Free plan provides standard quality (128kbps), while paid plans offer high-quality (320kbps) and studio-quality audio with crystal clear pronunciation.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, our Free plan is available forever with 5 voiceovers per month. You can also try any paid plan with a 7-day free trial.'
    },
    {
      question: 'How accurate is the pronunciation?',
      answer: 'Our AI models are specifically trained on Indian languages and accents, achieving 99%+ accuracy in pronunciation and natural speech patterns.'
    }
  ]

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
              {user && (
                <Button onClick={() => onNavigate('dashboard')} variant="outline">
                  Dashboard
                </Button>
              )}
              <Button onClick={() => onNavigate('generator')} className="gradient-primary">
                Try Free
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our premium Indian language AI voices.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : 'hover:shadow-lg'} transition-all duration-300`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-white px-4 py-1">
                    <Star className="w-4 h-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 ${plan.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  {plan.period !== 'pricing' && (
                    <span className="text-gray-600 ml-1">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-600 mt-2">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="pt-0">
                <Button 
                  className={`w-full mb-6 ${plan.popular ? 'gradient-primary' : ''}`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => onNavigate('generator')}
                >
                  {plan.cta}
                </Button>
                
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Compare All Features</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold">Features</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Creator</th>
                  <th className="text-center py-4 px-4 font-semibold">Business</th>
                  <th className="text-center py-4 px-4 font-semibold">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-4 px-4 font-medium">Monthly Voiceovers</td>
                  <td className="text-center py-4 px-4">5</td>
                  <td className="text-center py-4 px-4">50</td>
                  <td className="text-center py-4 px-4">200</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Characters per Voiceover</td>
                  <td className="text-center py-4 px-4">500</td>
                  <td className="text-center py-4 px-4">2,000</td>
                  <td className="text-center py-4 px-4">5,000</td>
                  <td className="text-center py-4 px-4">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Indian Languages</td>
                  <td className="text-center py-4 px-4">3</td>
                  <td className="text-center py-4 px-4">15+</td>
                  <td className="text-center py-4 px-4">15+</td>
                  <td className="text-center py-4 px-4">All + Future</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Voice Options</td>
                  <td className="text-center py-4 px-4">2</td>
                  <td className="text-center py-4 px-4">8</td>
                  <td className="text-center py-4 px-4">12</td>
                  <td className="text-center py-4 px-4">Custom</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Audio Quality</td>
                  <td className="text-center py-4 px-4">Standard</td>
                  <td className="text-center py-4 px-4">High</td>
                  <td className="text-center py-4 px-4">Studio</td>
                  <td className="text-center py-4 px-4">Studio</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Commercial Usage</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">API Access</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">❌</td>
                  <td className="text-center py-4 px-4">✅</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium">Support</td>
                  <td className="text-center py-4 px-4">Community</td>
                  <td className="text-center py-4 px-4">Email</td>
                  <td className="text-center py-4 px-4">Priority</td>
                  <td className="text-center py-4 px-4">24/7 Phone</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index} className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of creators using PariVaani for their voiceover needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => onNavigate('generator')} size="lg" className="gradient-primary px-8">
              Start Free Trial
            </Button>
            <Button onClick={() => onNavigate('support')} variant="outline" size="lg" className="px-8">
              Contact Sales
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Pricing