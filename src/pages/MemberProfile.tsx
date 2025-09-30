import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Bell, Clock, FileText } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import DashboardHeader from '@/components/DashboardHeader';
import FamilyMemberPhoto from '@/components/family/FamilyMemberPhoto';
import RemindersList from '@/components/reminders/RemindersList';
import TimelineList from '@/components/timeline/TimelineList';
import DocumentsList from '@/components/documents/DocumentsList';
import AddReminderDialog from '@/components/reminders/AddReminderDialog';
import AddTimelineDialog from '@/components/timeline/AddTimelineDialog';
import UploadDocumentDialog from '@/components/documents/UploadDocumentDialog';
import EmergencyCardGenerator from '@/components/emergency/EmergencyCardGenerator';
import AddDoctorDialog from '@/components/doctors/AddDoctorDialog';
import DoctorsList from '@/components/doctors/DoctorsList';

interface FamilyMember {
  id: number;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  blood_group?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  photo_url?: string;
}

const MemberProfile = () => {
  const { memberId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [member, setMember] = useState<FamilyMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchMember();
  }, [memberId, user]);

  const fetchMember = async () => {
    if (!user || !memberId) return;

    try {
      setLoading(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/family-members/${memberId}?user_id=${user.id}`
      );
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to load member profile');
      }
      const data: FamilyMember = await res.json();
      setMember(data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load member profile',
        variant: 'destructive',
      });
      setMember(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => setRefreshTrigger(prev => prev + 1);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Member not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header with Summarizer Button */}
      <div className="flex items-center justify-between px-6 py-4 bg-card shadow">
        <div>
          <h1 className="text-2xl font-bold">{member.name}</h1>
          <p className="text-sm text-muted-foreground capitalize">{member.relation}</p>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate(`/medical-summarizer/${member.id}`)}
        >
          Summarize Medical Report
        </Button>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Photo & Quick Info */}
        <div className="flex items-center gap-6 mb-8">
          <FamilyMemberPhoto photoUrl={member.photo_url} name={member.name} relation={member.relation} size="xl" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {member.age && <InfoCard label="Age" value={`${member.age} years`} />}
            {member.gender && <InfoCard label="Gender" value={member.gender} />}
            {member.blood_group && <InfoCard label="Blood Group" value={member.blood_group} />}
            {member.phone && <InfoCard label="Phone" value={member.phone} />}
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="emergency">Health Card</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" /> Active Reminders
                  </CardTitle>
                  <CardDescription>Current medications and appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <RemindersList memberId={member.id} refresh={refreshTrigger} showLimited />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Recent Timeline
                  </CardTitle>
                  <CardDescription>Latest medical history entries</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimelineList memberId={member.id} refresh={refreshTrigger} showLimited />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reminders">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Reminders & Medications
                </CardTitle>
                <AddReminderDialog memberId={member.id} onReminderAdded={handleRefresh} />
              </CardHeader>
              <CardContent>
                <RemindersList memberId={member.id} refresh={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timeline">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" /> Medical Timeline
                </CardTitle>
                <AddTimelineDialog memberId={member.id} onTimelineAdded={handleRefresh} />
              </CardHeader>
              <CardContent>
                <TimelineList memberId={member.id} refresh={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" /> Documents
                </CardTitle>
                <UploadDocumentDialog memberId={member.id} onDocumentUploaded={handleRefresh} />
              </CardHeader>
              <CardContent>
                <DocumentsList memberId={member.id} refresh={refreshTrigger} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency">
            <EmergencyCardGenerator member={member} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// InfoCard component
const InfoCard = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-card rounded-lg p-3 shadow-soft">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);

export default MemberProfile;
