"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { inter } from "@/lib/fonts";

interface UserAvatarProps {
  name: string | undefined | null;
  image: string | undefined | null;
}

const UserAvatar = ({ image, name }: UserAvatarProps) => {
  const basedName = name ? name.slice(0, 1).toUpperCase() : "U";

  return (
    <Avatar>
      {image ? (
        <AvatarImage src={image} />
      ) : (
        <AvatarFallback className={`font-bold ${inter.className}`}>
          {basedName}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
