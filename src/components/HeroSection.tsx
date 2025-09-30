import { Button } from "@/components/ui/button";
import { ArrowRight, Heart, Shield, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import heroImage from "@/assets/hero-family-health.jpg";
import Navbar from "./Navbar";

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('=== HeroSection mounted ===');
    console.log('User state:', user);
    console.log('Navigate function:', navigate);
    
    // Check if features element exists
    const featuresElement = document.getElementById('features');
    console.log('Features element on mount:', featuresElement);
    
    if (featuresElement) {
      console.log('Features element position:', featuresElement.getBoundingClientRect());
    }
  }, [user, navigate]);

  const handleGetStarted = () => {
    console.log('=== Get Started button clicked ===');
    console.log('User state:', user);
    console.log('Navigate function:', navigate);
    
    try {
      if (user) {
        // User is logged in, navigate to dashboard
        console.log('User is logged in, navigating to dashboard');
        navigate('/dashboard');
      } else {
        // User is not logged in, navigate to auth page
        console.log('User is not logged in, navigating to auth page');
        navigate('/auth');
      }
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  const handleLearnMore = () => {
    console.log('=== Learn More button clicked ===');
    console.log('Window object:', window);
    console.log('Document object:', document);
    
    try {
      const featuresElement = document.getElementById('features');
      console.log('Features element search result:', featuresElement);
      
      if (featuresElement) {
        console.log('Features element found, scrolling to it');
        console.log('Element position:', featuresElement.getBoundingClientRect());
        featuresElement.scrollIntoView({ behavior: 'smooth' });
        console.log('ScrollIntoView called successfully');
      } else {
        console.log('Features element not found, trying fallback scroll');
        // Fallback: scroll to top of page
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Fallback scroll called');
      }
    } catch (error) {
      console.error('Error scrolling to features:', error);
      // Fallback: scroll to top of page
      try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        console.log('Error fallback scroll called');
      } catch (fallbackError) {
        console.error('Even fallback scroll failed:', fallbackError);
      }
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      <Navbar />
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 animate-pulse">
        <div className="w-full h-full bg-repeat" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.5'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-white">
              <Heart className="w-4 h-4" />
              <span className="text-sm font-medium">AI Powered Health Management</span>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
                Pariwar+
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                Your Family's Smart Health Buddy
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto lg:mx-0">
                Track medicines, appointments, and reports for your whole family from one place. 
                Organize medical history, set smart reminders, and generate emergency health cards.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="group" onClick={handleGetStarted}>
                {user ? 'Go to Dashboard' : 'Start Free Trial'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                onClick={handleLearnMore}
              >
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center lg:justify-start gap-8 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>For Whole Family</span>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-gradient-card rounded-3xl p-8 shadow-glow">
              <img 
                src={heroImage} 
                alt="Family Health Management" 
                className="w-full h-auto rounded-2xl shadow-card"
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl p-4 shadow-card animate-bounce">
                <Heart className="w-6 h-6 text-primary" />
                <p className="text-xs font-medium mt-1">Health Alerts</p>
              </div>
              
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-4 shadow-card animate-bounce delay-1000">
                <Shield className="w-6 h-6 text-secondary" />
                <p className="text-xs font-medium mt-1">Secure Data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;