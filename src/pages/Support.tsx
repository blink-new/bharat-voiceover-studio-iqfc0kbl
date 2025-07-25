import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion'
import { 
  ArrowLeft, 
  Search,
  Mail,
  MessageCircle,
  Phone,
  Clock,
  Mic,
  HelpCircle,
  Book,
  Video,
  FileText,
  Users
} from 'lucide-react'

interface SupportProps {
  user: any
  onNavigate: (page: string) => void
}

const Support = ({ user, onNavigate }: SupportProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create my first voiceover?',
          answer: 'Simply click on "Create Voice" from the homepage, enter your script, choose your language and voice, then click generate. Your voiceover will be ready in seconds!'
        },
        {
          question: 'Which Indian languages are supported?',
          answer: 'We support 15+ Indian languages including Hindi, Tamil, Telugu, Gujarati, Bengali, Marathi, Kannada, Malayalam, Punjabi, Odia, Assamese, and Urdu. More languages are added regularly.'
        },
        {
          question: 'How accurate is the pronunciation?',
          answer: 'Our AI models are specifically trained on Indian languages and achieve 99%+ accuracy in pronunciation, including proper regional accents and speech patterns.'
        }
      ]
    },
    {
      category: 'Pricing & Plans',
      questions: [
        {
          question: 'Can I try PariVaani for free?',
          answer: 'Yes! Our Free plan includes 5 voiceovers per month forever. You can also try any paid plan with a 7-day free trial.'
        },
        {
          question: 'Can I change my plan anytime?',
          answer: 'Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately with prorated billing.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'Yes, we offer a 30-day money-back guarantee for all paid plans. Contact our support team for assistance.'
        }
      ]
    },
    {
      category: 'Technical Support',
      questions: [
        {
          question: 'What audio formats do you support?',
          answer: 'All voiceovers are generated in high-quality MP3 format (320kbps for paid plans, 128kbps for free plan). We\'re working on adding more formats like WAV and FLAC.'
        },
        {
          question: 'Can I use the voiceovers commercially?',
          answer: 'Yes, all paid plans include commercial usage rights. You can use the generated voiceovers in your business projects, YouTube videos, podcasts, and more.'
        },
        {
          question: 'Is there an API available?',
          answer: 'API access is available for Enterprise customers. Contact our sales team to discuss your integration needs.'
        }
      ]
    },
    {
      category: 'Account & Billing',
      questions: [
        {
          question: 'How do I update my payment method?',
          answer: 'Go to your Dashboard > Account Settings > Billing to update your payment method. Changes take effect immediately.'
        },
        {
          question: 'Can I download my previous voiceovers?',
          answer: 'Yes, all your generated voiceovers are saved in your Dashboard and can be downloaded anytime. Free plan users have access for 30 days, paid users have unlimited access.'
        },
        {
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription anytime from your Dashboard > Account Settings. Your plan will remain active until the end of your billing period.'
        }
      ]
    }
  ]

  const resources = [
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video guides to get you started',
      icon: <Video className="w-6 h-6" />,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Documentation',
      description: 'Comprehensive guides and API documentation',
      icon: <Book className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Best Practices',
      description: 'Tips to create better voiceovers',
      icon: <FileText className="w-6 h-6" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Community Forum',
      description: 'Connect with other PariVaani users',
      icon: <Users className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-600'
    }
  ]

  const contactOptions = [
    {
      title: 'Email Support',
      description: 'Get help via email within 24 hours',
      icon: <Mail className="w-6 h-6" />,
      contact: 'support@parivaani.com',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Live Chat',
      description: 'Chat with our support team instantly',
      icon: <MessageCircle className="w-6 h-6" />,
      contact: 'Available 9 AM - 6 PM IST',
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Phone Support',
      description: 'Call us for urgent issues (Business+ plans)',
      icon: <Phone className="w-6 h-6" />,
      contact: '+91-80-1234-5678',
      color: 'bg-orange-100 text-orange-600'
    }
  ]

  const filteredFAQs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      searchQuery === '' || 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', contactForm)
    // Reset form
    setContactForm({ name: '', email: '', subject: '', message: '' })
    alert('Thank you for your message! We\'ll get back to you within 24 hours.')
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
              {user && (
                <Button onClick={() => onNavigate('dashboard')} variant="outline">
                  Dashboard
                </Button>
              )}
              <Button onClick={() => onNavigate('generator')} className="gradient-primary">
                Create Voice
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Find answers to common questions, browse our resources, or get in touch with our support team.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search for help articles, FAQs, or guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 focus:border-primary"
            />
          </div>
        </div>

        {/* Quick Help Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {resources.map((resource, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className={`w-12 h-12 ${resource.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                  {resource.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            
            {filteredFAQs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching with different keywords or browse all FAQs below.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-8">
                {filteredFAQs.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.category}</h3>
                    <Accordion type="single" collapsible className="space-y-2">
                      {category.questions.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`} className="border border-gray-200 rounded-lg px-4">
                          <AccordionTrigger className="text-left hover:no-underline">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-gray-600 pb-4">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Contact Section */}
          <div className="space-y-8">
            {/* Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactOptions.map((option, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className={`w-10 h-10 ${option.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {option.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{option.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                      <p className="text-sm font-medium text-primary">{option.contact}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Subject"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Describe your issue or question..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full gradient-primary">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-primary" />
                  <h4 className="font-semibold text-gray-900">Response Times</h4>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Email Support:</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Live Chat:</span>
                    <span className="font-medium">Instant</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phone Support:</span>
                    <span className="font-medium">Immediate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Support