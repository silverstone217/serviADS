import { Footer } from "@/components/home/footer";
import Header from "@/components/home/Header";
import React from "react";

function page() {
  return (
    <div>
      {/* HEADER */}
      <Header />

      <main className="py-10 min-h-svh">
        <h3>Solutions</h3>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default page;
