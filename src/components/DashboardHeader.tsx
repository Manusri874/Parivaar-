import { ArrowLeft, Heart, Shield, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DashboardHeaderProps {
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  backLabel?: string;
}

const DashboardHeader = ({ 
  title = "Dashboard", 
  subtitle = "Manage your family's health",
  showBackButton = false,
  backTo = "/",
  backLabel = "Back to Dashboard"
}: DashboardHeaderProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        {/* Simple Top Bar */}
        <div className="flex items-center justify-between">
          {/* Simple Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">Pariwar+</span>
          </div>

          {/* Back Button */}
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate(backTo)}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {backLabel}
            </Button>
          )}
        </div>

        {/* Simple Title Section */}
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
