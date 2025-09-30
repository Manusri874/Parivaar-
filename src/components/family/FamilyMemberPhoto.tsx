import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Users, Baby, Heart, UserCheck, UserX, UserPlus } from 'lucide-react';

interface FamilyMemberPhotoProps {
  photoUrl?: string | null;
  name: string;
  relation: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const FamilyMemberPhoto = ({ 
  photoUrl, 
  name, 
  relation, 
  size = 'md',
  className = '' 
}: FamilyMemberPhotoProps) => {
  // Get appropriate icon based on relation
  const getRelationIcon = (relation: string) => {
    const lowerRelation = relation.toLowerCase();
    
    if (lowerRelation.includes('father') || lowerRelation.includes('dad') || lowerRelation.includes('papa')) {
      return <User className="w-full h-full" />;
    }
    if (lowerRelation.includes('mother') || lowerRelation.includes('mom') || lowerRelation.includes('mama')) {
      return <Heart className="w-full h-full" />;
    }
    if (lowerRelation.includes('brother') || lowerRelation.includes('bhai')) {
      return <UserCheck className="w-full h-full" />;
    }
    if (lowerRelation.includes('sister') || lowerRelation.includes('behen')) {
      return <UserPlus className="w-full h-full" />;
    }
    if (lowerRelation.includes('child') || lowerRelation.includes('son') || lowerRelation.includes('daughter') || lowerRelation.includes('baby')) {
      return <Baby className="w-full h-full" />;
    }
    if (lowerRelation.includes('self') || lowerRelation.includes('me')) {
      return <User className="w-full h-full" />;
    }
    if (lowerRelation.includes('grand') || lowerRelation.includes('elder')) {
      return <UserX className="w-full h-full" />;
    }
    
    // Default icon for other relations
    return <Users className="w-full h-full" />;
  };

  // Get size classes
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8';
      case 'md':
        return 'w-12 h-12';
      case 'lg':
        return 'w-16 h-16';
      case 'xl':
        return 'w-20 h-20';
      default:
        return 'w-12 h-12';
    }
  };

  return (
    <Avatar className={`${getSizeClasses(size)} ${className}`}>
      {photoUrl ? (
        <AvatarImage 
          src={photoUrl} 
          alt={`${name} (${relation})`}
          className="object-cover"
        />
      ) : null}
      <AvatarFallback className="bg-primary/20 text-primary">
        <div className="flex items-center justify-center w-full h-full">
          {getRelationIcon(relation)}
        </div>
      </AvatarFallback>
    </Avatar>
  );
};

export default FamilyMemberPhoto;
