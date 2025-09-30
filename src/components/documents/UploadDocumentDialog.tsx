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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface UploadDocumentDialogProps {
  memberId: string;
  onDocumentUploaded: () => void;
}

const UploadDocumentDialog = ({ memberId, onDocumentUploaded }: UploadDocumentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    document_type: '',
    document_date: '',
    notes: '',
    file: null as File | null
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // ---------------- File Change ---------------- //
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== 'application/pdf') {
        toast({
          title: "Error",
          description: "Only PDF files are allowed",
          variant: "destructive"
        });
        e.target.value = '';
        return;
      }
      setFormData(prev => ({ ...prev, file }));
    }
  };

  // ---------------- Submit ---------------- //
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file || !formData.document_type || !formData.title || !formData.document_date) {
      toast({
        title: "Error",
        description: "Please fill all required fields and select a PDF file",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('memberId', memberId);
      data.append('title', formData.title);
      data.append('document_type', formData.document_type);
      data.append('document_date', formData.document_date);
      data.append('notes', formData.notes);
      data.append('file', formData.file);

      const res = await fetch('http://localhost:8000/api/documents/upload', {
        method: 'POST',
        body: data
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to upload document');

      toast({
        title: 'Success!',
        description: 'Document uploaded successfully!'
      });

      setFormData({ title: '', document_type: '', document_date: '', notes: '', file: null });
      setOpen(false);
      onDocumentUploaded();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="w-4 h-4" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Medical Document</DialogTitle>
          <DialogDescription>
            Upload prescriptions, lab reports, bills, and other medical documents (PDF only).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Document Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Document Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Blood Test Report"
              required
            />
          </div>

          {/* Document Type */}
          <div className="space-y-2">
            <Label htmlFor="document_type">Document Type *</Label>
            <Select
              value={formData.document_type}
              onValueChange={(value) => handleInputChange('document_type', value)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prescription">Prescription</SelectItem>
                <SelectItem value="Lab">Lab Report</SelectItem>
                <SelectItem value="Bill">Medical Bill</SelectItem>
                <SelectItem value="Other">Other (X-Ray, MRI, CT Scan)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Document Date */}
          <div className="space-y-2">
            <Label htmlFor="document_date">Document Date *</Label>
            <Input
              id="document_date"
              type="date"
              value={formData.document_date}
              onChange={(e) => handleInputChange('document_date', e.target.value)}
              required
            />
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">File Upload (PDF only) *</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentDialog;
