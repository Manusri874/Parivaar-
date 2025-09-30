import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Bell, Trash2, Clock, CheckCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Reminder {
  id: number;
  title: string;
  reminder_type: string;
  start_date: string;
  end_date?: string | null;
  reminder_time?: string | null;
  frequency?: string | null;
  day_of_week?: number | null;
  day_of_month?: number | null;
  dosage?: string | null;
  notes?: string | null;
  is_active: boolean;
  created_at: string;
}

interface RemindersListProps {
  memberId: string;
  refresh: number;
  showLimited?: boolean;
}

const RemindersList = ({ memberId, refresh, showLimited = false }: RemindersListProps) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (!memberId) return;
    fetchReminders();
  }, [memberId, refresh]);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/family-members/${memberId}/reminders`);
      if (!res.ok) throw new Error(`Failed to fetch reminders (Status ${res.status})`);
      const data: Reminder[] = await res.json();
      setReminders(data || []);
    } catch (error: any) {
      console.error('Error fetching reminders:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to load reminders',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (reminderId: number, isActive: boolean) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reminders/${reminderId}/toggle-active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (!res.ok) throw new Error(`Failed to update reminder (Status ${res.status})`);
      toast({ title: 'Success', description: `Reminder ${isActive ? 'activated' : 'deactivated'}` });
      fetchReminders();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const handleDelete = async (reminderId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reminders/${reminderId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Failed to delete reminder (Status ${res.status})`);
      toast({ title: 'Success', description: 'Reminder deleted successfully' });
      fetchReminders();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const markAsTaken = async (reminderId: number) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/reminders/${reminderId}/mark-taken`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member_id: memberId }),
      });
      if (!res.ok) throw new Error(`Failed to mark reminder as taken (Status ${res.status})`);
      toast({ title: 'Success', description: 'Reminder marked as taken' });
    } catch (error: any) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'medicine': return 'bg-blue-100 text-blue-800';
      case 'appointment': return 'bg-green-100 text-green-800';
      case 'vaccination': return 'bg-purple-100 text-purple-800';
      case 'checkup': return 'bg-orange-100 text-orange-800';
      case 'exercise': return 'bg-red-100 text-red-800';
      case 'diet': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isExpired = (endDate?: string | null) => !!endDate && new Date(endDate) < new Date();
  const isActive = (startDate: string, endDate?: string | null) => {
    const now = new Date();
    const start = new Date(startDate);
    if (now < start) return false;
    if (endDate && now > new Date(endDate)) return false;
    return true;
  };

  // ----------- LOADING SKELETON -----------
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // ----------- NO REMINDERS PLACEHOLDER -----------
  if (reminders.length === 0) {
    return (
      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="text-center py-12">
          <Bell className="w-20 h-20 text-muted-foreground mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-semibold mb-2">No Reminders Yet</h3>
          <p className="text-muted-foreground">Set up reminders for medications, appointments, and more.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {reminders.map((reminder) => (
        <Card
          key={reminder.id}
          className={`transition-all ${!reminder.is_active ? 'opacity-60' : ''} ${isExpired(reminder.end_date) ? 'border-muted' : ''}`}
        >
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${reminder.is_active && isActive(reminder.start_date, reminder.end_date) ? 'bg-primary/10' : 'bg-muted'}`}>
                  <Bell className={`w-6 h-6 ${reminder.is_active && isActive(reminder.start_date, reminder.end_date) ? 'text-primary' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{reminder.title}</h3>
                    <Badge className={getTypeColor(reminder.reminder_type)}>{reminder.reminder_type}</Badge>
                    {isExpired(reminder.end_date) && <Badge variant="outline">Expired</Badge>}
                    {!isActive(reminder.start_date, reminder.end_date) && !isExpired(reminder.end_date) && <Badge variant="secondary">Upcoming</Badge>}
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {reminder.reminder_time ? `${reminder.reminder_time} ${reminder.frequency ? `- ${reminder.frequency}` : ''}` : reminder.frequency || 'No specific time'}
                      </span>
                    </div>
                    <p>
                      From: {new Date(reminder.start_date).toLocaleDateString()}
                      {reminder.end_date && ` To: ${new Date(reminder.end_date).toLocaleDateString()}`}
                    </p>
                    {reminder.day_of_week !== null && <p><strong>Day of Week:</strong> {reminder.day_of_week}</p>}
                    {reminder.day_of_month !== null && <p><strong>Day of Month:</strong> {reminder.day_of_month}</p>}
                    {reminder.dosage && <p><strong>Dosage:</strong> {reminder.dosage}</p>}
                    {reminder.notes && <p className="mt-2">{reminder.notes}</p>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {reminder.reminder_type.toLowerCase() === 'medicine' && reminder.is_active && isActive(reminder.start_date, reminder.end_date) && (
                  <Button variant="outline" size="sm" onClick={() => markAsTaken(reminder.id)} className="gap-2">
                    <CheckCircle className="w-4 h-4" /> Mark Taken
                  </Button>
                )}
                <div className="flex items-center gap-2">
                  <Switch checked={reminder.is_active} onCheckedChange={(checked) => handleToggleActive(reminder.id, checked)} />
                  <span className="text-xs text-muted-foreground">{reminder.is_active ? 'Active' : 'Inactive'}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                      <p>Are you sure you want to delete "{reminder.title}"? This action cannot be undone.</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(reminder.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RemindersList;
