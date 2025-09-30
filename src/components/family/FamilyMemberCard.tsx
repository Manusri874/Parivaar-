import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FamilyMemberPhoto from './FamilyMemberPhoto';

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
}

interface FamilyMemberCardProps {
  member: FamilyMember;
}

const FamilyMemberCard = ({ member }: FamilyMemberCardProps) => {
  const navigate = useNavigate();

  const handleViewProfile = () => {
    navigate(`/member/${member.id}`);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <FamilyMemberPhoto 
            photoUrl={member.photo_url}
            name={member.name}
            relation={member.relation}
            size="md"
          />
          <div>
            <h3 className="font-semibold">{member.name}</h3>
            <p className="text-sm text-muted-foreground">{member.relation}</p>
          </div>
        </div>
        <div className="space-y-2 text-sm">
          {member.age && <p><span className="font-medium">Age:</span> {member.age}</p>}
          {member.gender && <p><span className="font-medium">Gender:</span> {member.gender}</p>}
          {member.phone && <p><span className="font-medium">Phone:</span> {member.phone}</p>}
          {member.email && <p><span className="font-medium">Email:</span> {member.email}</p>}
        </div>
        <Button variant="outline" className="w-full mt-4" onClick={handleViewProfile}>
          View Profile
        </Button>
      </CardContent>
    </Card>
  );
};

export default FamilyMemberCard;