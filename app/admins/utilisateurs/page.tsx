import { getUser } from "@/actions/user";
import { getUsers } from "@/actions/users";
import MainComponent from "@/components/admins/users/MainComponent";
import React from "react";

export default async function page() {
  const user = await getUser();

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const allUsers = await getUsers();

  const taxis = allUsers ? allUsers.taxis : [];
  const users = allUsers ? allUsers.users : [];

  return (
    <div>
      <MainComponent taxis={taxis} users={users} />
    </div>
  );
}
