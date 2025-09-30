import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Users2, Phone, Mail, MapPin, Clock, Trash2, ExternalLink } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface Doctor {
  id: string;
  doctor_name: string;
  specialization: string;
  phone?: string;
  email?: string;
  hospital_name?: string;
  address?: string;
  visiting_hours?: string;
  google_maps_link?: string;
  notes?: string;
  created_at: string;
}

interface DoctorsListProps {
  memberId: string;
  refresh: number;
}

const DoctorsList = ({ memberId, refresh }: DoctorsListProps) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, [memberId, refresh]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('family_member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoctors(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doctorId: string) => {
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', doctorId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Doctor deleted successfully",
      });
      
      fetchDoctors();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_self');
  };

  const handleMaps = (mapsLink: string) => {
    window.open(mapsLink, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Users2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Doctors Yet</h3>
          <p className="text-muted-foreground">
            Add doctors to build your healthcare directory
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {doctors.map((doctor) => (
        <Card key={doctor.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">Dr. {doctor.doctor_name}</h3>
                    <Badge variant="secondary">{doctor.specialization}</Badge>
                  </div>
                  
                  {doctor.hospital_name && (
                    <p className="text-sm text-muted-foreground mb-2">
                      <strong>Hospital:</strong> {doctor.hospital_name}
                    </p>
                  )}
                  
                  <div className="space-y-1 text-sm">
                    {doctor.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => handleCall(doctor.phone!)}
                        >
                          {doctor.phone}
                        </Button>
                      </div>
                    )}
                    
                    {doctor.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <Button
                          variant="link"
                          className="p-0 h-auto text-sm"
                          onClick={() => handleEmail(doctor.email!)}
                        >
                          {doctor.email}
                        </Button>
                      </div>
                    )}
                    
                    {doctor.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{doctor.address}</span>
                      </div>
                    )}
                    
                    {doctor.visiting_hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{doctor.visiting_hours}</span>
                      </div>
                    )}
                  </div>
                  
                  {doctor.notes && (
                    <p className="text-sm mt-2 p-2 bg-muted/50 rounded">{doctor.notes}</p>
                  )}
                  
                  <p className="text-xs text-muted-foreground mt-2">
                    Added: {new Date(doctor.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {doctor.google_maps_link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMaps(doctor.google_maps_link!)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Maps
                  </Button>
                )}
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "Dr. {doctor.doctor_name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(doctor.id)}>
                        Delete
                      </AlertDialogAction>
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

export default DoctorsList;