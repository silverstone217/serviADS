import { getUser } from "@/actions/user";
import AuthComponent from "@/components/AuthComponent";
import React from "react";

async function page() {
  const user = await getUser();

  if (!user) {
    return <AuthComponent />;
  }

  return <div>page {user.email}</div>;
}

export default page;
