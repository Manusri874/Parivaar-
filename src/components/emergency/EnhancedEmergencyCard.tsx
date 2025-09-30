import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Shield, Download, QrCode, User, Phone, Heart } from 'lucide-react';
import QRCode from 'qrcode';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FamilyMember {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  blood_group?: string;
  allergies?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  phone?: string;
}

interface EnhancedEmergencyCardProps {
  member: FamilyMember;
}

const EnhancedEmergencyCard = ({ member }: EnhancedEmergencyCardProps) => {
  const { toast } = useToast();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pmhDialogOpen, setPmhDialogOpen] = useState(false);
  const [pmhInput, setPmhInput] = useState('');
  const [emergencyData, setEmergencyData] = useState({
    blood_group: member.blood_group || '',
    allergies: member.allergies || '',
    ongoing_medicines: '',
    medical_conditions: '',
    emergency_contact_name: member.emergency_contact_name || '',
    emergency_contact_phone: member.emergency_contact_phone || '',
    doctor_name: '',
    doctor_phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setEmergencyData(prev => ({ ...prev, [field]: value }));
  };

  const buildTimelineUrl = () => {
    const base = `${window.location.origin}/member/${member.id}?tab=timeline`;
    const pmh = emergencyData.medical_conditions?.trim();
    return pmh ? `${base}&pmh=${encodeURIComponent(btoa(pmh))}` : base;
  };

  const generateQRCode = async () => {
    try {
      const url = buildTimelineUrl();
      const qrDataURL = await QRCode.toDataURL(url, {
        width: 240,
        margin: 1,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      setQrCodeUrl(qrDataURL);
      toast({
        title: 'QR Code Generated!',
        description: 'QR links to the health timeline and embeds past history.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate QR code',
        variant: 'destructive',
      });
    }
  };

  const onGenerateClick = () => {
    if (!emergencyData.medical_conditions?.trim()) {
      setPmhInput('');
      setPmhDialogOpen(true);
      return;
    }
    generateQRCode();
  };
  const downloadHealthCard = async () => {
    try {
      // Generate QR code if not already generated
      let qrCode = qrCodeUrl;
      if (!qrCode) {
        const url = buildTimelineUrl();
        qrCode = await QRCode.toDataURL(url, { width: 240, margin: 1 });
      }

      // Create HTML content for the health card
      const cardHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Emergency Health Card - ${member.name}</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 20px;
              background: #f5f5f5;
            }
            .card {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border-radius: 15px;
              padding: 20px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
              border: 2px solid #dc2626;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
              border-bottom: 2px solid #dc2626;
              padding-bottom: 15px;
            }
            .emergency-title {
              background: #dc2626;
              color: white;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: bold;
              display: inline-block;
              margin-bottom: 10px;
            }
            .name {
              font-size: 24px;
              font-weight: bold;
              color: #333;
              margin: 0;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              margin-bottom: 15px;
            }
            .info-item {
              padding: 8px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            .info-label {
              font-size: 12px;
              color: #666;
              font-weight: bold;
              text-transform: uppercase;
            }
            .info-value {
              font-size: 14px;
              color: #333;
              margin-top: 2px;
            }
            .section {
              margin-bottom: 15px;
              padding: 10px;
              background: #f8f9fa;
              border-radius: 8px;
              border-left: 4px solid #dc2626;
            }
            .section-title {
              font-size: 12px;
              font-weight: bold;
              color: #dc2626;
              text-transform: uppercase;
              margin-bottom: 5px;
            }
            .section-content {
              font-size: 13px;
              color: #333;
              line-height: 1.4;
            }
            .qr-section {
              text-align: center;
              margin-top: 20px;
              padding-top: 15px;
              border-top: 1px solid #eee;
            }
            .qr-code {
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 15px;
              font-size: 10px;
              color: #666;
            }
            .emergency-contacts {
              background: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              padding: 10px;
              margin-bottom: 15px;
            }
            @media print {
              body { background: white; padding: 0; }
              .card { box-shadow: none; margin: 0; max-width: none; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="emergency-title">🆘 EMERGENCY HEALTH CARD</div>
              <h1 class="name">${member.name}</h1>
            </div>
            
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Age</div>
                <div class="info-value">${member.age || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gender</div>
                <div class="info-value">${member.gender || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Blood Group</div>
                <div class="info-value">${emergencyData.blood_group || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Phone</div>
                <div class="info-value">${member.phone || 'N/A'}</div>
              </div>
            </div>

            <div class="emergency-contacts">
              <div class="section-title">📞 Emergency Contact</div>
              <div class="section-content">
                <strong>${emergencyData.emergency_contact_name || 'N/A'}</strong><br>
                ${emergencyData.emergency_contact_phone || 'N/A'}
              </div>
            </div>

            ${emergencyData.allergies ? `
            <div class="section">
              <div class="section-title">⚠️ Allergies</div>
              <div class="section-content">${emergencyData.allergies}</div>
            </div>
            ` : ''}

            ${emergencyData.ongoing_medicines ? `
            <div class="section">
              <div class="section-title">💊 Current Medications</div>
              <div class="section-content">${emergencyData.ongoing_medicines}</div>
            </div>
            ` : ''}

            ${emergencyData.medical_conditions ? `
            <div class="section">
              <div class="section-title">🏥 Medical Conditions</div>
              <div class="section-content">${emergencyData.medical_conditions}</div>
            </div>
            ` : ''}

            ${emergencyData.doctor_name ? `
            <div class="section">
              <div class="section-title">👨‍⚕️ Primary Doctor</div>
              <div class="section-content">
                <strong>${emergencyData.doctor_name}</strong><br>
                ${emergencyData.doctor_phone || 'No phone provided'}
              </div>
            </div>
            ` : ''}

            <div class="qr-section">
              <div class="section-title">📱 Scan for Full Profile</div>
              <div class="qr-code">
                <img src="${qrCode}" alt="QR Code for medical profile" style="width: 120px; height: 120px;">
              </div>
              <div style="font-size: 10px; color: #666;">
                Scan to view complete medical history
              </div>
            </div>

            <div class="footer">
              Generated on ${new Date().toLocaleDateString()}<br>
              Keep this card in your wallet for emergencies
            </div>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([cardHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${member.name}_Emergency_Health_Card.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Health Card Downloaded!",
        description: "Emergency health card downloaded. Open the HTML file in your browser to print.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate health card",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="w-5 h-5" />
              Emergency Health Card Generator
            </CardTitle>
            <CardDescription>
              Generate a comprehensive emergency health card for {member.name} with QR code for quick access.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blood_group">Blood Group</Label>
                <Input
                  id="blood_group"
                  value={emergencyData.blood_group}
                  onChange={(e) => handleInputChange('blood_group', e.target.value)}
                  placeholder="e.g., A+, B-, O+"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                <Input
                  id="emergency_contact_name"
                  value={emergencyData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  placeholder="Contact person name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
                <Input
                  id="emergency_contact_phone"
                  value={emergencyData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  placeholder="Contact phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor_name">Primary Doctor Name</Label>
                <Input
                  id="doctor_name"
                  value={emergencyData.doctor_name}
                  onChange={(e) => handleInputChange('doctor_name', e.target.value)}
                  placeholder="Primary doctor name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="doctor_phone">Doctor Phone</Label>
                <Input
                  id="doctor_phone"
                  value={emergencyData.doctor_phone}
                  onChange={(e) => handleInputChange('doctor_phone', e.target.value)}
                  placeholder="Doctor phone number"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Textarea
                id="allergies"
                value={emergencyData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                placeholder="List all known allergies (e.g., Penicillin, Shellfish, Nuts)"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ongoing_medicines">Ongoing Medicines</Label>
              <Textarea
                id="ongoing_medicines"
                value={emergencyData.ongoing_medicines}
                onChange={(e) => handleInputChange('ongoing_medicines', e.target.value)}
                placeholder="List all current medications with dosages"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medical_conditions">Medical Conditions</Label>
              <Textarea
                id="medical_conditions"
                value={emergencyData.medical_conditions}
                onChange={(e) => handleInputChange('medical_conditions', e.target.value)}
                placeholder="List any chronic conditions, past surgeries, or important medical history"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button onClick={downloadHealthCard} className="flex-1 gap-2" variant="destructive">
                <Download className="w-4 h-4" />
                Download Health Card
              </Button>
              <Button onClick={onGenerateClick} variant="outline" className="flex-1 gap-2">
                <QrCode className="w-4 h-4" />
                Generate QR Code
              </Button>
            </div>

            {qrCodeUrl && (
              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">QR Code for Emergency Profile:</p>
                <img src={qrCodeUrl} alt="Emergency QR Code" className="mx-auto border rounded-lg" />
                <p className="text-xs text-muted-foreground mt-2">
                  This QR code links to {member.name}'s emergency health profile
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Enhanced Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Card Preview</CardTitle>
            <CardDescription>
              Preview of how your emergency health card will look
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-200 rounded-xl p-6 shadow-lg">
              {/* Header */}
              <div className="text-center mb-4 pb-3 border-b-2 border-red-300">
                <div className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold mb-2">
                  🆘 EMERGENCY HEALTH CARD
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              </div>
              
              {/* Basic Info Grid */}
              <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Age</div>
                  <div className="text-gray-900">{member.age || 'N/A'}</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Gender</div>
                  <div className="text-gray-900">{member.gender || 'N/A'}</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Blood</div>
                  <div className="text-gray-900 font-bold text-red-600">{emergencyData.blood_group || 'N/A'}</div>
                </div>
                <div className="bg-white/70 p-2 rounded">
                  <div className="text-gray-600 font-semibold">Phone</div>
                  <div className="text-gray-900">{member.phone || 'N/A'}</div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="bg-red-50 border border-red-200 rounded p-2 mb-3">
                <div className="text-red-700 font-bold text-xs mb-1">📞 EMERGENCY CONTACT</div>
                <div className="text-xs">
                  <div className="font-semibold">{emergencyData.emergency_contact_name || 'N/A'}</div>
                  <div>{emergencyData.emergency_contact_phone || 'N/A'}</div>
                </div>
              </div>

              {/* Allergies */}
              {emergencyData.allergies && (
                <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mb-3">
                  <div className="text-yellow-700 font-bold text-xs mb-1">⚠️ ALLERGIES</div>
                  <div className="text-xs text-gray-700">{emergencyData.allergies}</div>
                </div>
              )}

              {/* Medications */}
              {emergencyData.ongoing_medicines && (
                <div className="bg-blue-50 border border-blue-200 rounded p-2 mb-3">
                  <div className="text-blue-700 font-bold text-xs mb-1">💊 MEDICATIONS</div>
                  <div className="text-xs text-gray-700">{emergencyData.ongoing_medicines}</div>
                </div>
              )}

              {/* Conditions */}
              {emergencyData.medical_conditions && (
                <div className="bg-purple-50 border border-purple-200 rounded p-2 mb-3">
                  <div className="text-purple-700 font-bold text-xs mb-1">🏥 CONDITIONS</div>
                  <div className="text-xs text-gray-700">{emergencyData.medical_conditions}</div>
                </div>
              )}

              {/* QR Section */}
              <div className="text-center pt-3 border-t border-red-200">
                <div className="text-red-700 font-bold text-xs mb-1">📱 SCAN FOR TIMELINE</div>
                <div className="w-16 h-16 bg-white border-2 border-red-300 rounded mx-auto flex items-center justify-center">
                  <div className="text-xs text-gray-500">QR</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={pmhDialogOpen} onOpenChange={setPmhDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Before generating QR</DialogTitle>
            <DialogDescription>
              Add a brief Past Medical History to embed into the QR and link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="pmh">Past Medical History</Label>
            <Textarea
              id="pmh"
              value={pmhInput}
              onChange={(e) => setPmhInput(e.target.value)}
              placeholder="e.g., Asthma since 2010; Appendectomy in 2018; Diabetes Type II"
            />
            <p className="text-xs text-muted-foreground">
              This text will be encoded inside the QR link so clinicians can see it quickly.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPmhDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              setEmergencyData(prev => ({ ...prev, medical_conditions: pmhInput.trim() }));
              setPmhDialogOpen(false);
              setTimeout(() => generateQRCode(), 0);
            }}>Continue & Generate</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnhancedEmergencyCard;