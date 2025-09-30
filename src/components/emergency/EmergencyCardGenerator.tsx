import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Shield, Download, Pencil } from "lucide-react";
import QRCode from "qrcode";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet, Image } from "@react-pdf/renderer";

interface FamilyMember {
  id: number;
  uuid?: string;
  name: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  phone?: string;
}

interface EmergencyCardGeneratorProps {
  member: FamilyMember;
}

const BACKEND_HOST = "http://localhost:8000";

// ---------------- PDF Styles ----------------
const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Helvetica" },
  card: { border: "2pt solid #dc2626", borderRadius: 15, padding: 15, backgroundColor: "#fff" },
  header: { textAlign: "center", marginBottom: 15 },
  title: { fontSize: 18, color: "#dc2626", fontWeight: "bold", marginBottom: 10, letterSpacing: 1 },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 10 },
  grid: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  gridItem: { width: "50%", marginBottom: 5 },
  section: { marginBottom: 8, padding: 5, borderLeft: "4pt solid #dc2626", backgroundColor: "#fef2f2", borderRadius: 5 },
  sectionTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 2 },
  qr: { marginTop: 10, alignItems: "center" },
  footer: { fontSize: 8, textAlign: "center", marginTop: 10, color: "#555" },
  multilineText: { marginBottom: 2 },
});

// ---------------- PDF Component ----------------
const EmergencyCardPDF = ({ member, emergencyData, qrCodeUrl }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🆘 EMERGENCY HEALTH CARD</Text>
          <Text style={styles.name}>{member.name}</Text>
        </View>

        {/* Basic Info Grid */}
        <View style={styles.grid}>
          <View style={styles.gridItem}><Text>Age: {member.age || "N/A"}</Text></View>
          <View style={styles.gridItem}><Text>Gender: {member.gender || "N/A"}</Text></View>
          <View style={styles.gridItem}><Text>Blood: {emergencyData.blood_group || "N/A"}</Text></View>
          <View style={styles.gridItem}><Text>Phone: {member.phone || "N/A"}</Text></View>
        </View>

        {/* Sections */}
        {[
          { label: "Emergency Contact", content: [emergencyData.emergency_contact_name, emergencyData.emergency_contact_phone], color: "#dc2626" },
          { label: "Allergies", content: [emergencyData.allergies], color: "#f59e0b" },
          { label: "Medications", content: [emergencyData.ongoing_medicines], color: "#3b82f6" },
          { label: "Medical Conditions", content: [emergencyData.medical_conditions], color: "#8b5cf6" },
          { label: "Doctor", content: [`${emergencyData.doctor_name || ""} - ${emergencyData.doctor_phone || "N/A"}`], color: "#16a34a" },
        ].map((sec, idx) =>
          sec.content && sec.content.some(c => c) ? (
            <View key={idx} style={{ ...styles.section, borderLeft: `4pt solid ${sec.color}`, backgroundColor: `${sec.color}20` }}>
              <Text style={styles.sectionTitle}>{sec.label}</Text>
              {sec.content.map((text, i) => (
                text && <Text key={i} style={styles.multilineText}>{text}</Text>
              ))}
            </View>
          ) : null
        )}

        {/* QR Code */}
        {qrCodeUrl && (
          <View style={styles.qr}>
            <Image src={qrCodeUrl} style={{ width: 120, height: 120 }} />
          </View>
        )}

        <Text style={styles.footer}>Generated on {new Date().toLocaleDateString()}</Text>
      </View>
    </Page>
  </Document>
);

// ---------------- Main Component ----------------
const EmergencyCardGenerator = ({ member }: EmergencyCardGeneratorProps) => {
  const { toast } = useToast();
  const [memberUuid, setMemberUuid] = useState<string | undefined>(member.uuid);
  const [editing, setEditing] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [emergencyData, setEmergencyData] = useState({
    blood_group: member.blood_group || "",
    allergies: member.allergies || "",
    ongoing_medicines: "",
    medical_conditions: "",
    emergency_contact_name: member.emergency_contact_name || "",
    emergency_contact_phone: member.emergency_contact_phone || "",
    doctor_name: "",
    doctor_phone: "",
  });

  // ---------------- Restore card from Local Storage ----------------
  useEffect(() => {
    const saved = localStorage.getItem(`card_${member.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setEmergencyData(parsed.emergencyData);
      setEditing(false);

      // Regenerate QR code if missing
      if (!parsed.qrCodeUrl) {
        generateQRCode();
      } else {
        setQrCodeUrl(parsed.qrCodeUrl);
      }
    }
  }, [member.id, memberUuid]);

  // ---------------- Auto-generate UUID ----------------
  useEffect(() => {
    const ensureUuid = async () => {
      if (!memberUuid) {
        try {
          const res = await fetch(`${BACKEND_HOST}/generate-uuid/${member.id}`, { method: "POST" });
          if (res.ok) {
            const data = await res.json();
            setMemberUuid(data.uuid);
            toast({ title: "UUID Generated", description: "Unique link created for QR." });
          }
        } catch { }
      }
    };
    ensureUuid();
  }, [member.id, memberUuid, toast]);

  const handleInputChange = (field: string, value: string) => {
    setEmergencyData(prev => ({ ...prev, [field]: value }));
  };

  const generateQRCode = async () => {
    try {
      const url = memberUuid ? `${BACKEND_HOST}/doctor-view/${memberUuid}` : "";
      const qrDataURL = await QRCode.toDataURL(url, { width: 240 });
      setQrCodeUrl(qrDataURL);
    } catch {
      toast({ title: "Error", description: "Failed to generate QR code", variant: "destructive" });
    }
  };

  const generateCard = async () => {
    await generateQRCode();
    setEditing(false);

    // Save to local storage
    localStorage.setItem(`card_${member.id}`, JSON.stringify({
      emergencyData,
      qrCodeUrl,
    }));

    toast({ title: "Emergency Card Generated!" });
  };

  const updateCard = () => setEditing(true);

  return (
    <div className="space-y-6">
      {editing && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" /> Emergency Card Form
            </CardTitle>
            <CardDescription>Fill the emergency health card details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputGroup label="Blood Group" value={emergencyData.blood_group} onChange={(v) => handleInputChange("blood_group", v)} />
              <InputGroup label="Emergency Contact Name" value={emergencyData.emergency_contact_name} onChange={(v) => handleInputChange("emergency_contact_name", v)} />
              <InputGroup label="Emergency Contact Phone" value={emergencyData.emergency_contact_phone} onChange={(v) => handleInputChange("emergency_contact_phone", v)} />
              <InputGroup label="Primary Doctor Name" value={emergencyData.doctor_name} onChange={(v) => handleInputChange("doctor_name", v)} />
              <InputGroup label="Doctor Phone" value={emergencyData.doctor_phone} onChange={(v) => handleInputChange("doctor_phone", v)} />
            </div>

            <TextareaGroup label="Allergies" value={emergencyData.allergies} onChange={(v) => handleInputChange("allergies", v)} />
            <TextareaGroup label="Ongoing Medicines" value={emergencyData.ongoing_medicines} onChange={(v) => handleInputChange("ongoing_medicines", v)} />
            <TextareaGroup label="Medical Conditions" value={emergencyData.medical_conditions} onChange={(v) => handleInputChange("medical_conditions", v)} />

            <Button onClick={generateCard} variant="destructive" className="w-full mt-4">Generate Card</Button>
          </CardContent>
        </Card>
      )}

      {!editing && (
        <Card>
          <CardHeader>
            <CardTitle>Emergency Card Preview</CardTitle>
            <CardDescription>Beautiful preview of the emergency health card</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Preview Card */}
            <div className="max-w-sm mx-auto bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-lg">
              <div className="text-center mb-4 pb-3 border-b-2 border-red-300">
                <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                  🆘 EMERGENCY HEALTH CARD
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Age</div>
                  <div>{member.age || "N/A"}</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Gender</div>
                  <div>{member.gender || "N/A"}</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Blood</div>
                  <div>{emergencyData.blood_group || "N/A"}</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Phone</div>
                  <div>{member.phone || "N/A"}</div>
                </div>
              </div>

              <div className="bg-white/80 p-2 rounded mb-2">
                <div className="text-gray-700 font-semibold text-xs">Emergency Contact</div>
                <div>{emergencyData.emergency_contact_name || "N/A"}</div>
                <div>{emergencyData.emergency_contact_phone || "N/A"}</div>
              </div>

              {emergencyData.allergies && <Section label="Allergies" color="yellow" content={emergencyData.allergies} />}
              {emergencyData.ongoing_medicines && <Section label="Medications" color="blue" content={emergencyData.ongoing_medicines} />}
              {emergencyData.medical_conditions && <Section label="Medical Conditions" color="purple" content={emergencyData.medical_conditions} />}
              {emergencyData.doctor_name && <Section label="Doctor" color="green" content={`${emergencyData.doctor_name} - ${emergencyData.doctor_phone || "N/A"}`} />}

              {/* QR Code */}
              {qrCodeUrl && <img src={qrCodeUrl} className="w-32 h-32 mx-auto mt-4" alt="QR Code" />}
            </div>

            {/* PDF Download + Update */}
            <PDFDownloadLink
              document={<EmergencyCardPDF member={member} emergencyData={emergencyData} qrCodeUrl={qrCodeUrl} />}
              fileName={`${member.name}_Emergency_Card.pdf`}
            >
              {({ loading }) => (
                <Button variant="destructive" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? "Generating PDF..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>

            <Button onClick={() => setEditing(true)} variant="outline" className="w-full">
              <Pencil className="w-4 h-4 mr-2" /> Update Card
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// ---------------- Preview Helpers ----------------
const InputGroup = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Input value={value} placeholder={label} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const TextareaGroup = ({ label, value, onChange }: any) => (
  <div className="space-y-2">
    <Label>{label}</Label>
    <Textarea value={value} placeholder={label} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Section = ({ label, content, color }: any) => (
  <div className={`bg-${color}-100 border-l-4 border-${color}-500 p-2 rounded mb-2 text-xs break-words`}>
    <div className="font-semibold text-gray-700">{label}</div>
    <div>{content}</div>
  </div>
);

export default EmergencyCardGenerator;
