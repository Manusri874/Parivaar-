import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Download, Trash2, ExternalLink } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter
} from '@/components/ui/alert-dialog';

// ---------------- TYPES ---------------- //
interface Document {
  id: number;
  title: string;
  document_type: string;
  document_date: string | null;
  file_name: string;
  notes?: string;
  created_at: string;
}

interface DocumentsListProps {
  memberId: string;
  refresh?: number;
  readOnly?: boolean;
}

// ---------------- BACKEND HOST ---------------- //
const BACKEND_HOST = "http://127.0.0.1:8000";

const DocumentsList = ({ memberId, refresh = 0, readOnly = false }: DocumentsListProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => { fetchDocuments(); }, [memberId, refresh]);

  // ---------------- FETCH DOCUMENTS ---------------- //
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_HOST}/api/family-members/${memberId}/documents`);
      if (!res.ok) throw new Error("Failed to fetch documents");
      setDocuments(await res.json());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------- DELETE DOCUMENT ---------------- //
  const handleDelete = async (documentId: number) => {
    if (readOnly) return;
    try {
      const res = await fetch(`${BACKEND_HOST}/api/documents/${documentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete document");
      toast({ title: "Deleted", description: "Document deleted successfully" });
      fetchDocuments();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  // ---------------- DOWNLOAD DOCUMENT ---------------- //
  const handleDownload = (documentId: number, fileName: string) => {
    const link = document.createElement("a");
    link.href = `${BACKEND_HOST}/api/documents/${documentId}`;
    link.download = fileName;
    link.click();
  };

  if (loading) return <p>Loading documents...</p>;
  if (!documents.length) return <p>No documents uploaded yet.</p>;

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card key={doc.id}>
          <CardContent className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold">{doc.title}</h3>
              <div className="flex gap-2 items-center mb-1">
                <Badge variant="secondary">{doc.document_type}</Badge>
                <span>{doc.document_date ? new Date(doc.document_date).toLocaleDateString() : "N/A"}</span>
              </div>
              {doc.notes && <p>{doc.notes}</p>}
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleDownload(doc.id, doc.file_name)} aria-label={`Download ${doc.title}`}>
                <Download className="w-4 h-4 mr-1" /> Download
              </Button>
              <Button
                onClick={() => window.open(`${BACKEND_HOST}/api/documents/${doc.id}`, "_blank")}
                aria-label={`View ${doc.title}`}
              >
                <ExternalLink className="w-4 h-4 mr-1" /> View
              </Button>
              {!readOnly && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" aria-label={`Delete ${doc.title}`}><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(doc.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentsList;
