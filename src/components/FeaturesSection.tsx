import { Button } from "@/components/ui/button";
import { 
  Users, 
  Bell, 
  FileText, 
  Clock, 
  QrCode, 
  Stethoscope,
  ArrowRight,
  Heart
} from "lucide-react";
import medicalDocsImage from "@/assets/medical-documents.jpg";
import emergencyCardImage from "@/assets/emergency-card.jpg";

const features = [
  {
    icon: Users,
    title: "Family Accounts",
    description: "Manage health profiles for your entire family with role-based access control.",
    color: "text-primary"
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    description: "Never miss medicines or appointments with intelligent notifications.",
    color: "text-secondary"
  },
  {
    icon: FileText,
    title: "Document Organizer",
    description: "Store and organize prescriptions, lab reports, and medical bills securely.",
    color: "text-accent"
  },
  {
    icon: Clock,
    title: "Medical Timeline",
    description: "Visualize your family's health history with interactive timelines.",
    color: "text-primary"
  },
  {
    icon: QrCode,
    title: "Emergency QR Cards",
    description: "Generate instant-access health cards for emergencies with QR codes.",
    color: "text-secondary"
  },
  {
    icon: Stethoscope,
    title: "Doctor Directory",
    description: "Maintain a directory of doctors and hospitals for easy access.",
    color: "text-accent"
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-feature rounded-full px-4 py-2 mb-6">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Key Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
            Everything Your Family Needs for Better Health Management
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive tools designed to simplify healthcare for families, 
            from daily medicine tracking to emergency preparedness.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-gradient-card rounded-2xl p-8 shadow-soft hover:shadow-card transition-all duration-300 hover:-translate-y-2 border border-border/50"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-feature mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Feature Showcase */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Document Management */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Organize Medical Documents Effortlessly
              </h3>
              <p className="text-lg text-muted-foreground">
                Upload, categorize, and access all your family's medical documents in one secure place. 
                Never lose important health records again.
              </p>
            </div>
            
                        <div className="bg-gradient-card rounded-2xl p-6 shadow-card">
              <img 
                src={medicalDocsImage} 
                alt="Medical Document Organization" 
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>

          {/* Right - Emergency Cards */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                Emergency Health Cards with QR Access
              </h3>
              <p className="text-lg text-muted-foreground">
                Generate printable emergency cards with QR codes that provide instant access 
                to critical health information when it matters most.
              </p>
            </div>
            
                        <div className="bg-gradient-card rounded-2xl p-6 shadow-card">
              <img 
                src={emergencyCardImage} 
                alt="Emergency Health Card with QR Code" 
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;