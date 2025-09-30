import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Heart, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-sm border-b border-white/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Heart className="w-6 h-6" />
            Pariwar+
          </Link>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={signOut}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/auth?mode=signup">
                  <Button 
                    variant="hero" 
                    size="sm"
                    className="text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    variant="hero" 
                    size="sm"
                    className="text-white"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;