import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Heart, Plus, Calendar, Users, Bell, Pill } from 'lucide-react';
import DashboardHeader from '@/components/DashboardHeader';
import AddMemberDialog from '@/components/family/AddMemberDialog';
import ViewMembersDialog from '@/components/family/ViewMembersDialog';

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchFamilyMembers();
      fetchFamilyMemberCount();
    }
  }, [user?.id]);

  // Fetch members list
  const fetchFamilyMembers = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8000/api/family-members?user_id=${user.id}`);
      if (!res.ok) throw new Error(`Failed to fetch members. Status: ${res.status}`);

      const data: FamilyMember[] = await res.json();
      setFamilyMembers(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load family members",
        variant: "destructive",
      });
      setFamilyMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch family member count
  const fetchFamilyMemberCount = async () => {
    if (!user?.id) return;

    try {
      const res = await fetch(`http://localhost:8000/api/family-members/count?user_id=${user.id}`);
      if (!res.ok) throw new Error(`Failed to fetch count. Status: ${res.status}`);

      const data: { count: number } = await res.json();
      setMemberCount(data?.count || 0);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load member count",
        variant: "destructive",
      });
      setMemberCount(0);
    }
  };

  // Callback after adding member
  const handleMemberAdded = () => {
    fetchFamilyMembers();
    fetchFamilyMemberCount();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <DashboardHeader 
        title="Welcome back!"
        subtitle="Manage your family's health with Parivar+ AI Health Buddy"
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{memberCount}</p>
                <p className="text-sm text-muted-foreground">Family Members</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Active Medications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Upcoming Appointments</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-sm text-muted-foreground">Pending Alerts</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Add Family Member */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-xl">Add Family Member</CardTitle>
              <CardDescription>Add new family members to manage their health information</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <AddMemberDialog onMemberAdded={handleMemberAdded} />
            </CardContent>
          </Card>

          {/* View Members */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <CardTitle className="text-xl">View Members</CardTitle>
              <CardDescription>View and manage all your family members' profiles</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {loading ? (
                <p className="text-muted-foreground">Loading members...</p>
              ) : (
                <ViewMembersDialog members={familyMembers} />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Family Overview</CardTitle>
            <CardDescription>
              You have {memberCount} family member{memberCount !== 1 ? 's' : ''} registered
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                Use the buttons above to add new members or view existing ones
              </p>
              {memberCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  Click "View Members" to see all family members and access their health profiles
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
