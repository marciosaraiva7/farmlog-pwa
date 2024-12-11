import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AvatarProps } from "@/types/schema";

export function AvatarUser({ profilePicture, initials }: AvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={profilePicture} alt="profile image" />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}
