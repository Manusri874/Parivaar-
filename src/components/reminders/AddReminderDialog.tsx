import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Plus } from 'lucide-react';

interface AddReminderDialogProps {
  memberId: number;
  memberEmail: string;
  userEmail: string;
  onReminderAdded: () => void;
}

interface FormData {
  title: string;
  reminderType: string;
  startDate: string;
  endDate: string;
  reminderTime: string;
  frequency: string;
  dosage: string;
  notes: string;
  dayOfWeek?: string;
  dayOfMonth?: string;
}

const AddReminderDialog = ({ memberId, memberEmail, userEmail, onReminderAdded }: AddReminderDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    title: '',
    reminderType: '',
    startDate: '',
    endDate: '',
    reminderTime: '',
    frequency: '',
    dosage: '',
    notes: '',
    dayOfWeek: '',
    dayOfMonth: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          family_member_id: memberId,
          title: formData.title,
          reminder_type: formData.reminderType,
          start_date: formData.startDate,
          end_date: formData.endDate,
          reminder_time: formData.reminderTime,
          frequency: formData.frequency,
          dosage: formData.dosage,
          notes: formData.notes,
          day_of_week: formData.dayOfWeek,
          day_of_month: formData.dayOfMonth,
          member_email: memberEmail,
          user_email: userEmail
        })
      });

      const data = await res.json();
      if (res.ok) {
        toast({ title: 'Success!', description: 'Reminder added successfully!' });
        setFormData({
          title: '',
          reminderType: '',
          startDate: '',
          endDate: '',
          reminderTime: '',
          frequency: '',
          dosage: '',
          notes: '',
          dayOfWeek: '',
          dayOfMonth: ''
        });
        setOpen(false);
        onReminderAdded();
      } else {
        toast({ title: 'Error', description: data.error || 'Something went wrong', variant: 'destructive' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Reminder
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add Reminder</DialogTitle>
          <DialogDescription>Set a new reminder for your family member.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={e => handleInputChange('title', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderType">Type *</Label>
            <Select
              value={formData.reminderType}
              onValueChange={v => handleInputChange('reminderType', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Medication">Medication</SelectItem>
                <SelectItem value="Appointment">Appointment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date *</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={e => handleInputChange('startDate', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">End Date</Label>
            <Input
              id="endDate"
              type="date"
              value={formData.endDate}
              onChange={e => handleInputChange('endDate', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reminderTime">Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={formData.reminderTime}
              onChange={e => handleInputChange('reminderTime', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Frequency</Label>
            <Select
              value={formData.frequency}
              onValueChange={v => handleInputChange('frequency', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Once">Once</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conditional fields */}
          {formData.frequency === "Weekly" && (
            <div className="space-y-2">
              <Label htmlFor="dayOfWeek">Day of the Week</Label>
              <Select
                value={formData.dayOfWeek || ""}
                onValueChange={v => handleInputChange('dayOfWeek' as keyof FormData, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map(day => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {formData.frequency === "Monthly" && (
            <div className="space-y-2">
              <Label htmlFor="dayOfMonth">Day of the Month</Label>
              <Select
                value={formData.dayOfMonth || ""}
                onValueChange={v => handleInputChange('dayOfMonth' as keyof FormData, v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 31 }, (_, i) => (
                    <SelectItem key={i+1} value={`${i+1}`}>{i+1}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={e => handleInputChange('dosage', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={e => handleInputChange('notes', e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Reminder'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddReminderDialog;
