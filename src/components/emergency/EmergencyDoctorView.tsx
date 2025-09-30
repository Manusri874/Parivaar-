import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { useToast } from "@/hooks/use-toast";

interface EmergencyCard {
  allergies?: string;
  ongoing_medicines?: string;
  medical_conditions?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  doctor_name?: string;
  doctor_phone?: string;
}

interface Member {
  id: number;
  name: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  phone?: string;
}

interface TimelineEvent {
  id: number;
  title: string;
  event_type: string;
  date: string;
  severity: string;
  notes?: string;
}

interface Document {
  id: number;
  title: string;
  document_type: string;
  document_date: string;
  file_name: string;
  notes?: string;
}

interface EmergencyData {
  member: Member;
  emergency_card: EmergencyCard;
  timeline: TimelineEvent[];
  documents: Document[];
}

const BACKEND_HOST = "http://localhost:8000";

const EmergencyDoctorView = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const [data, setData] = useState<EmergencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!uuid) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`${BACKEND_HOST}/api/doctor-view/${uuid}`);
        if (!res.ok) throw new Error("Member not found or invalid UUID");
        const json: EmergencyData = await res.json();
        setData(json);
      } catch (err: any) {
        setError(err.message || "Failed to fetch emergency data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uuid]);

  if (loading) return <p className="text-center mt-10">Loading emergency data...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">{error}</p>;
  if (!data) return null;

  const { member, emergency_card, timeline, documents } = data;
  const qrUrl = `${window.location.origin}/doctor-view/${uuid}`;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">
      {/* Emergency Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">🆘 Emergency Health Card</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Name:</strong> {member.name || "N/A"}</p>
              <p><strong>Age:</strong> {member.age ?? "N/A"}</p>
              <p><strong>Gender:</strong> {member.gender || "N/A"}</p>
              <p><strong>Blood Group:</strong> {member.blood_group || "N/A"}</p>
            </div>
            <div>
              <p><strong>Phone:</strong> {member.phone || "N/A"}</p>
              <p><strong>Emergency Contact:</strong> {emergency_card.emergency_contact_name || "N/A"}</p>
              <p><strong>Contact Phone:</strong> {emergency_card.emergency_contact_phone || "N/A"}</p>
              <p><strong>Doctor:</strong> {emergency_card.doctor_name || "N/A"}</p>
              <p><strong>Doctor Phone:</strong> {emergency_card.doctor_phone || "N/A"}</p>
            </div>
          </div>

          {emergency_card.allergies && (
            <div>
              <p className="font-semibold text-red-500">⚠️ Allergies:</p>
              <p>{emergency_card.allergies}</p>
            </div>
          )}

          {emergency_card.ongoing_medicines && (
            <div>
              <p className="font-semibold">💊 Current Medications:</p>
              <p>{emergency_card.ongoing_medicines}</p>
            </div>
          )}

          {emergency_card.medical_conditions && (
            <div>
              <p className="font-semibold text-red-500">🩺 Medical History:</p>
              <p>{emergency_card.medical_conditions}</p>
            </div>
          )}

          <div className="text-center mt-6">
            <QRCode value={qrUrl} size={128} />
            <p className="text-xs mt-2">Scan to access emergency profile</p>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      {timeline.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">📅 Medical Timeline</h2>
          <div className="space-y-4">
            {timeline.map(event => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title} ({event.event_type})</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
                  <p><strong>Severity:</strong> {event.severity}</p>
                  {event.notes && <p><strong>Notes:</strong> {event.notes}</p>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Documents */}
      {documents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">📄 Medical Documents</h2>
          <div className="space-y-4">
            {documents.map(doc => (
              <Card key={doc.id}>
                <CardHeader>
                  <CardTitle>{doc.title} ({doc.document_type})</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between items-center">
                  <div>
                    <p><strong>Date:</strong> {new Date(doc.document_date).toLocaleDateString()}</p>
                    {doc.notes && <p><strong>Notes:</strong> {doc.notes}</p>}
                  </div>
                  <Button
                    onClick={async () => {
                      try {
                        const res = await fetch(`${BACKEND_HOST}/api/documents/${doc.id}`);
                        if (!res.ok) throw new Error("Failed to fetch document");
                        const blob = await res.blob();
                        const link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = doc.file_name;
                        link.click();
                      } catch (err: any) {
                        toast({
                          title: "Error",
                          description: err.message || "Failed to download document",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyDoctorView;
