import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

interface AddTimelineDialogProps {
  memberId: string;
  onTimelineAdded: () => void;
}

const AddTimelineDialog = ({ memberId, onTimelineAdded }: AddTimelineDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '',
    event_type: '',
    event_date: '',
    severity: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ member_id: memberId, ...formData })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to add timeline entry");

      toast({ title: "Success!", description: "Timeline entry added successfully!" });

      setFormData({ title: '', event_type: '', event_date: '', severity: '', notes: '' });
      setOpen(false);
      onTimelineAdded();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" /> Add Timeline Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Medical Timeline Entry</DialogTitle>
          <DialogDescription>
            Record illnesses, medications, surgeries, and recovery progress.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Title *</Label>
            <Input value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Event Type *</Label>
            <Select value={formData.event_type} onValueChange={(value) => handleInputChange('event_type', value)} required>
              <SelectTrigger><SelectValue placeholder="Select event type" /></SelectTrigger>
              <SelectContent>
                {["Illness","Medication","Surgery","Recovery","Checkup","Vaccination","Injury","Test","Other"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Event Date *</Label>
            <Input type="date" value={formData.event_date} onChange={(e) => handleInputChange('event_date', e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
              <SelectTrigger><SelectValue placeholder="Select severity (optional)" /></SelectTrigger>
              <SelectContent>
                {["Low","Medium","High","Critical"].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea value={formData.notes} onChange={(e) => handleInputChange('notes', e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Entry'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTimelineDialog;
