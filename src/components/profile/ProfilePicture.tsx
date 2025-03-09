
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { uploadProfilePicture } from '@/services/profileService';
import { updateProfile } from '@/lib/firebase';

interface ProfilePictureProps {
  url?: string;
  username?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onPictureUpdated?: (url: string) => void;
  editable?: boolean;
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  url,
  username,
  size = 'md',
  onPictureUpdated,
  editable = false,
}) => {
  const { currentUser } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | undefined>(url);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setImageUrl(url);
  }, [url]);
  
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };
  
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    return name.substring(0, 2).toUpperCase();
  };
  
  const handleClick = () => {
    if (editable && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    
    try {
      setIsUploading(true);
      
      if (!file.type.startsWith('image/')) {
        console.error("Invalid file type");
        setIsUploading(false);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        console.error("File too large");
        setIsUploading(false);
        return;
      }
      
      // Create a local preview
      const objectUrl = URL.createObjectURL(file);
      setImageUrl(objectUrl);
      
      try {
        console.log("Starting profile picture upload for user:", currentUser.uid);
        const downloadURL = await uploadProfilePicture(currentUser.uid, file);
        console.log("Profile picture upload succeeded. URL:", downloadURL);
        
        // Clean up the object URL to prevent memory leaks
        URL.revokeObjectURL(objectUrl);
        
        // Update the UI with the actual Firebase Storage URL
        setImageUrl(downloadURL);
        
        // Update the user's profile in Firebase Auth
        await updateProfile(currentUser, {
          photoURL: downloadURL
        });
        
        // Notify parent component
        if (onPictureUpdated) {
          onPictureUpdated(downloadURL);
        }
      } catch (error) {
        console.error("Error in Firebase upload:", error);
        
        // Revert to previous image if upload fails
        URL.revokeObjectURL(objectUrl);
        setImageUrl(url);
      }
    } catch (error) {
      console.error("Error in file handling:", error);
      setImageUrl(url);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  
  return (
    <div className="relative inline-block">
      <Avatar 
        className={`${sizeClasses[size]} ${editable ? 'cursor-pointer' : ''} border-2 border-white shadow-lg`}
        onClick={handleClick}
      >
        <AvatarImage src={imageUrl} alt={username || "Profile"} />
        <AvatarFallback className="bg-maronaut-500 text-white">
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : getInitials(username)}
        </AvatarFallback>
      </Avatar>
      
      {editable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div
            className={`absolute bottom-0 right-0 rounded-full shadow-md ${isUploading ? 'bg-gray-200' : 'bg-white'}`}
          >
            <Button
              size="icon"
              variant="secondary"
              className="h-8 w-8 rounded-full"
              onClick={handleClick}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePicture;
