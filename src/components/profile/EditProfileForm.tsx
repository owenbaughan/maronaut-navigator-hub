
import React from 'react';
import { useForm } from 'react-hook-form';
import { useUser, useClerk } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type ProfileFormValues = {
  fullName: string;
  location: string;
  bio: string;
  boatName: string;
  boatType: string;
  boatLength: string;
  homeMarina: string;
  sailingSince: string;
};

const EditProfileForm = () => {
  const { user } = useUser();
  const { register, handleSubmit, reset } = useForm<ProfileFormValues>({
    defaultValues: {
      fullName: user?.fullName || '',
      location: user?.unsafeMetadata?.location as string || '',
      bio: user?.unsafeMetadata?.bio as string || '',
      boatName: user?.unsafeMetadata?.boatName as string || '',
      boatType: user?.unsafeMetadata?.boatType as string || '',
      boatLength: user?.unsafeMetadata?.boatLength as string || '',
      homeMarina: user?.unsafeMetadata?.homeMarina as string || '',
      sailingSince: user?.unsafeMetadata?.sailingSince as string || '',
    }
  });
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      // Update user's fullName through Clerk API
      await user?.update({
        firstName: data.fullName.split(' ')[0] || '',
        lastName: data.fullName.split(' ').slice(1).join(' ') || '',
        // Update additional profile information in user metadata
        unsafeMetadata: {
          ...user?.unsafeMetadata,
          location: data.location,
          bio: data.bio,
          boatName: data.boatName,
          boatType: data.boatType,
          boatLength: data.boatLength,
          homeMarina: data.homeMarina,
          sailingSince: data.sailingSince,
        },
      });

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen) {
      reset({
        fullName: user?.fullName || '',
        location: user?.unsafeMetadata?.location as string || '',
        bio: user?.unsafeMetadata?.bio as string || '',
        boatName: user?.unsafeMetadata?.boatName as string || '',
        boatType: user?.unsafeMetadata?.boatType as string || '',
        boatLength: user?.unsafeMetadata?.boatLength as string || '',
        homeMarina: user?.unsafeMetadata?.homeMarina as string || '',
        sailingSince: user?.unsafeMetadata?.sailingSince as string || '',
      });
    }
  }, [isOpen, user, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="absolute top-6 right-6 p-2 rounded-full bg-maronaut-100 text-maronaut-600 hover:bg-maronaut-200 transition-colors"
        >
          <Edit size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Your full name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="City, State"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sailingSince">Sailing Since</Label>
              <Input
                id="sailingSince"
                {...register('sailingSince')}
                placeholder="e.g., 2015"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                {...register('bio')}
                placeholder="Tell us about yourself and your sailing experience"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <h3 className="text-lg font-semibold mt-4">Boat Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="boatName">Boat Name</Label>
                  <Input
                    id="boatName"
                    {...register('boatName')}
                    placeholder="Name of your boat"
                  />
                </div>
                <div>
                  <Label htmlFor="boatType">Boat Type</Label>
                  <Input
                    id="boatType"
                    {...register('boatType')}
                    placeholder="e.g., Beneteau Oceanis 38"
                  />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="boatLength">Boat Length</Label>
                  <Input
                    id="boatLength"
                    {...register('boatLength')}
                    placeholder="e.g., 38 ft"
                  />
                </div>
                <div>
                  <Label htmlFor="homeMarina">Home Marina</Label>
                  <Input
                    id="homeMarina"
                    {...register('homeMarina')}
                    placeholder="Your home marina"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileForm;
