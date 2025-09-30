import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Clock, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface TimelineEntry {
  id: number;
  title: string;
  event_type: string;
  event_date: string | null;
  severity?: string;
  notes?: string;
  created_at: string | null;
}

interface TimelineListProps {
  memberId: string;
  refresh?: number;
  showLimited?: boolean;
  readOnly?: boolean;
}

const TimelineList = ({ memberId, refresh = 0, showLimited = false, readOnly = false }: TimelineListProps) => {
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimeline();
  }, [memberId, refresh]);

  const fetchTimeline = async () => {
    setLoading(true);
    try {
      const limitParam = showLimited ? "?limit=3" : "";
      const res = await fetch(`http://localhost:8000/api/family-members/${memberId}/timeline${limitParam}`);
      if (!res.ok) throw new Error("Failed to fetch timeline");
      const data: TimelineEntry[] = await res.json();
      setTimeline(data);
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (entryId: number) => {
    if (readOnly) return;
    try {
      const res = await fetch(`http://localhost:8000/api/timeline/${entryId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete entry");
      toast({ title: "Deleted", description: "Timeline entry deleted successfully" });
      fetchTimeline();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity?.toLowerCase()) {
      case "critical":
      case "high": return "bg-red-600 text-white";
      case "medium": return "bg-yellow-400 text-black";
      case "low": return "bg-green-400 text-black";
      default: return "bg-gray-300 text-black";
    }
  };

  const getEventTypeColor = (eventType: string) => {
    switch (eventType.toLowerCase()) {
      case "illness": return "bg-red-100 text-red-800";
      case "medication": return "bg-blue-100 text-blue-800";
      case "surgery": return "bg-orange-100 text-orange-800";
      case "recovery": return "bg-green-100 text-green-800";
      case "checkup": return "bg-purple-100 text-purple-800";
      case "vaccination": return "bg-teal-100 text-teal-800";
      case "injury": return "bg-yellow-100 text-yellow-800";
      case "test": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) return <p>Loading timeline...</p>;
  if (!timeline.length) return <p>No timeline entries yet.</p>;

  return (
    <div className="relative pl-12 border-l-2 border-gray-200">
      {timeline.map((entry) => (
        <div key={entry.id} className="mb-8 relative">
          <div className="absolute -left-6 top-2 w-4 h-4 rounded-full border-2 border-blue-500 bg-white"></div>
          <div className="bg-white p-4 shadow rounded-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{entry.title}</h3>
                <div className="flex gap-2 mt-1">
                  <Badge className={getEventTypeColor(entry.event_type)}>{entry.event_type}</Badge>
                  {entry.severity && <Badge className={getSeverityColor(entry.severity)}>{entry.severity}</Badge>}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Event Date: {entry.event_date ? new Date(entry.event_date).toLocaleDateString() : "N/A"}
                </p>
                {entry.notes && <p className="mt-1">{entry.notes}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  Added: {entry.created_at ? new Date(entry.created_at).toLocaleDateString() : "N/A"}
                </p>
              </div>

              {!readOnly && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" aria-label={`Delete ${entry.title}`}><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Timeline Entry</AlertDialogTitle>
                      <p>Are you sure you want to delete "{entry.title}"?</p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineList;
