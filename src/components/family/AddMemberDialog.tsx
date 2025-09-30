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

interface AddMemberDialogProps {
  onMemberAdded: () => void;
}

interface FormData {
  name: string;
  phone: string;
  email: string;
  age: string;
  gender: string;
  relation: string;
}

const AddMemberDialog = ({ onMemberAdded }: AddMemberDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    email: '',
    age: '',
    gender: '',
    relation: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Error", description: "User not logged in", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/family-members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          age: formData.age ? parseInt(formData.age) : null,
          gender: formData.gender,
          relation: formData.relation
        })
      });

      const data = await res.json();

      if (res.ok) {
        toast({ title: "Success!", description: "Member added successfully!" });
        setFormData({ name: '', phone: '', email: '', age: '', gender: '', relation: '' });
        setOpen(false);
        onMemberAdded();
      } else {
        toast({ title: "Error", description: data.error || "Something went wrong", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Family Member
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Family Member</DialogTitle>
          <DialogDescription>
            Add a new family member to your health management system.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange('phone', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={formData.age}
              onChange={e => handleInputChange('age', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relation">Relation *</Label>
            <Select value={formData.relation} onValueChange={v => handleInputChange('relation', v)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select relation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Self">Self</SelectItem>
                <SelectItem value="Father">Father</SelectItem>
                <SelectItem value="Mother">Mother</SelectItem>
                <SelectItem value="Son">Son</SelectItem>
                <SelectItem value="Daughter">Daughter</SelectItem>
                <SelectItem value="Wife">Wife</SelectItem>
                <SelectItem value="Husband">Husband</SelectItem>
                <SelectItem value="Brother">Brother</SelectItem>
                <SelectItem value="Sister">Sister</SelectItem>
                <SelectItem value="Grandfather">Grandfather</SelectItem>
                <SelectItem value="Grandmother">Grandmother</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? 'Adding...' : 'Add Member'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMemberDialog;
