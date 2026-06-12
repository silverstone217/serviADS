import { getUser } from "@/actions/user";
import AdminAccessDenied from "@/components/admins/AdminAccessDenied";
import Aside from "@/components/admins/Aside";
import Header from "@/components/admins/Header";
import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const user = await getUser();

  if (!user) {
    return <AdminAccessDenied type="unauthenticated" />;
  }

  if (user.role !== "ADMIN") {
    return <AdminAccessDenied type="unauthorized" />;
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50">
        <Header />
      </div>

      <div className="lg:flex lg:h-screen">
        {/* Desktop Aside */}
        <aside className="hidden lg:block lg:w-64 lg:h-screen lg:sticky lg:top-0 shrink-0">
          <Aside />
        </aside>

        {/* Content */}
        <main
          className="
            pt-16
            lg:pt-0
            flex-1
            lg:h-screen
            lg:overflow-y-auto
          "
        >
          <div className="container mx-auto max-w-6xl p-4">{children}</div>
        </main>
      </div>
    </>
  );
}
