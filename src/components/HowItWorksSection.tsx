import { UserPlus, Users, Upload, Shield, Heart } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Create Account",
    description: "Sign up as the family head and set up your secure account with just a few details."
  },
  {
    icon: Users,
    step: "02", 
    title: "Add Family Members",
    description: "Add profiles for each family member with their basic information and health details."
  },
  {
    icon: Upload,
    step: "03",
    title: "Upload & Set Reminders",
    description: "Upload medical documents, set medicine reminders, and organize health records."
  },
  {
    icon: Shield,
    step: "04",
    title: "Access Emergency Cards",
    description: "Generate and access emergency health cards with QR codes anytime, anywhere."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-16 bg-gradient-to-br from-muted/20 via-background to-muted/30 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-32 h-32 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-secondary rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-12">
          <div className="inline-flex items-center gap-3 bg-gradient-feature rounded-full px-6 py-3 mb-6 shadow-lg">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <Heart className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-foreground">Simple Steps</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            How Pariwar+ Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get started with your family's health management in just four simple steps. 
            No technical expertise required.
          </p>
        </div>

        {/* Enhanced Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Enhanced Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 left-full w-full h-1 bg-gradient-to-r from-primary via-secondary to-primary transform translate-y-1 z-0">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-secondary rounded-full shadow-lg"></div>
                </div>
              )}
              
              {/* Enhanced Step Card */}
              <div className="relative bg-gradient-card rounded-3xl p-6 shadow-soft hover:shadow-2xl transition-all duration-500 group hover:-translate-y-4 border border-border/50 overflow-hidden">
                {/* Hover Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  {/* Enhanced Step Number */}
                  <div className="absolute -top-4 left-8 bg-gradient-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-lg">
                    {step.step}
                  </div>
                  
                  {/* Enhanced Icon */}
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-feature mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                    <step.icon className="w-8 h-8 text-primary" />
                  </div>
                  
                  {/* Enhanced Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-8">
          <div className="bg-gradient-card rounded-3xl p-8 md:p-12 shadow-card border border-border/50 overflow-hidden relative">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Floating Health Icons */}
              <div className="absolute top-10 left-10 w-8 h-8 text-primary/20 animate-pulse">
                <Heart className="w-full h-full" />
              </div>
              <div className="absolute top-20 right-20 w-6 h-6 text-secondary/20 animate-pulse delay-1000">
                <Shield className="w-full h-full" />
              </div>
              <div className="absolute bottom-20 left-20 w-10 h-10 text-green-500/20 animate-pulse delay-500">
                <Users className="w-full h-full" />
              </div>
              <div className="absolute bottom-10 right-10 w-7 h-7 text-purple-500/20 animate-pulse delay-1500">
                <Upload className="w-full h-full" />
              </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Your Health Ecosystem
            </h3>
              
              {/* Interactive Health Network */}
              <div className="grid lg:grid-cols-3 gap-8 mb-8">
                {/* Central Hub */}
                <div className="lg:col-span-3 flex justify-center mb-8">
                  <div className="relative">
                    {/* Main Health Hub */}
                    <div className="w-40 h-40 bg-gradient-to-br from-primary via-secondary to-purple-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                      <div className="w-32 h-32 bg-white/90 rounded-full flex items-center justify-center">
                        <Heart className="w-16 h-16 text-primary" />
                      </div>
                    </div>
                    
                    {/* Orbiting Health Elements */}
                    <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-300">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-600">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg animate-bounce delay-900">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Health Pathways */}
                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Family Network</h4>
                        <div className="text-2xl font-bold text-blue-500">4+</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Connected family members with shared health insights</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Smart Records</h4>
                        <div className="text-2xl font-bold text-green-500">50+</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">AI-organized medical documents & reports</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-foreground">Health Shield</h4>
                        <div className="text-2xl font-bold text-purple-500">24/7</div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">Continuous monitoring & emergency alerts</p>
                  </div>
                </div>
              </div>

              {/* Health Achievement Showcase */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-white text-xl font-bold">✓</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Medication Adherence</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-white text-xl font-bold">📊</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Health Analytics</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-white text-xl font-bold">🔔</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Smart Reminders</div>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <div className="text-white text-xl font-bold">🆘</div>
                    </div>
                    <div className="text-sm text-muted-foreground">Emergency Cards</div>
                  </div>
                </div>
              </div>

              {/* Bottom Message */}
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-lg text-foreground/80 font-medium">
                  Experience the future of family health management with Pariwar+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;