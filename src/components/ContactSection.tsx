import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageCircle, Users, Shield, Heart, Send, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  familySize: string;
  interest: string;
}

const ContactSection = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ContactForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    familySize: '',
    interest: ''
  });

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
        familySize: '',
        interest: ''
      });
      setIsSubmitting(false);
    }, 2000);
  };

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Support",
      value: "support@pariwarplus.com",
      description: "Get help via email"
    },
    {
      icon: Phone,
      title: "Phone Support",
      value: "+91 8080 808 080",
      description: "Call us anytime"
    },
    {
      icon: Clock,
      title: "Support Hours",
      value: "24/7 Available",
      description: "Emergency support ready"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Mumbai, Maharashtra",
      description: "Headquartered in India"
    }
  ];

  const features = [
    {
      icon: Users,
      title: "Family-Focused",
      description: "Designed specifically for families"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Bank-level security for your data"
    },
    {
      icon: Heart,
      title: "Health First",
      description: "Prioritizing your family's wellness"
    }
  ];

  return (
         <section className="py-20 bg-gradient-to-br from-primary via-primary/60 to-secondary relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="text-sm font-semibold text-white">Contact Us</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Transform Your Family's Health?
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of families who trust Pariwar+ for comprehensive health management. 
            Get started today and experience the peace of mind that comes with organized healthcare.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Content */}
          <div className="text-white space-y-12">
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Get in Touch</h3>
              {contactInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-4 group hover:bg-white/10 p-4 rounded-2xl transition-all duration-300">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{info.title}</p>
                    <p className="text-white/90">{info.value}</p>
                    <p className="text-white/70 text-sm">{info.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold mb-6">Why Choose Pariwar+?</h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{feature.title}</p>
                    <p className="text-white/80 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleGetStarted}
                size="lg" 
                className="bg-white text-primary hover:bg-white/90 group font-semibold"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white/10 font-semibold"
              >
                Schedule Demo
              </Button>
            </div>
          </div>

          {/* Right Content - Enhanced Contact Form */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Send us a Message</h3>
                <p className="text-white/80 text-sm">We'll get back to you within 24 hours</p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    First Name <span className="text-red-400">*</span>
                  </label>
                  <input 
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Last Name
                  </label>
                  <input 
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input 
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Family Size
                  </label>
                  <select
                    value={formData.familySize}
                    onChange={(e) => handleInputChange('familySize', e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  >
                    <option value="">Select size</option>
                    <option value="2-3">2-3 members</option>
                    <option value="4-5">4-5 members</option>
                    <option value="6+">6+ members</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Primary Interest
                  </label>
                  <select
                    value={formData.interest}
                    onChange={(e) => handleInputChange('interest', e.target.value)}
                    className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
                  >
                    <option value="">Select interest</option>
                    <option value="medication">Medication Management</option>
                    <option value="documents">Document Storage</option>
                    <option value="emergency">Emergency Cards</option>
                    <option value="reminders">Health Reminders</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea 
                  rows={4}
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 resize-none transition-all duration-300"
                  placeholder="Tell us about your family's health management needs, questions, or how we can help you..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-white text-primary hover:bg-white/90 font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                size="lg"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    Sending...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="mt-20 pt-12 border-t border-white/20">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="text-white">
              <h4 className="font-bold text-lg mb-4">Pariwar+</h4>
              <p className="text-white/80 text-sm leading-relaxed">
                Empowering families with comprehensive health management solutions.
              </p>
            </div>
            <div className="text-white">
              <h4 className="font-bold text-lg mb-4">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Features</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Pricing</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Security</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">API</a>
              </div>
            </div>
            <div className="text-white">
              <h4 className="font-bold text-lg mb-4">Support</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Help Center</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Status</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Community</a>
              </div>
            </div>
            <div className="text-white">
              <h4 className="font-bold text-lg mb-4">Company</h4>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-white/80 hover:text-white transition-colors">About</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Blog</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Careers</a>
                <a href="#" className="block text-white/80 hover:text-white transition-colors">Press</a>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-8 text-white/80 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <a href="#" className="hover:text-white transition-colors">GDPR</a>
            </div>
            <p className="text-white/60 text-sm text-center">
              © 2024 Pariwar+. All rights reserved. Built with ❤️ for families in India.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;