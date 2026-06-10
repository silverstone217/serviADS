import { AdvertisingFormats } from "@/components/home/AdvertisingFormats";
import { Footer } from "@/components/home/footer";
import Header from "@/components/home/Header";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";

export default function Home() {
  return (
    <main>
      {/* HEADER */}
      <Header />

      {/*  CONTENT */}
      <div className="pt-4 pb-20">
        {/* HERO */}
        <Hero />

        {/* HOW IT WORKS */}
        <HowItWorks />

        {/* FORMAT */}
        <AdvertisingFormats />
      </div>

      {/* FOOTER */}
      <Footer />
    </main>
  );
}
