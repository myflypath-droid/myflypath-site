import React from "react";
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import TrustBar from "../components/landing/TrustBar";
import TrainingSection from "../components/landing/TrainingSection";
import IFRSection from "../components/landing/IFRSection";
import LogbookSection from "../components/landing/LogbookSection";
import ProfileSection from "../components/landing/ProfileSection";
import PricingSection from "../components/landing/PricingSection";
import DownloadCTA from "../components/landing/DownloadCTA";
import MyUniversSection from "../components/landing/MyUniversSection";
import ContactNewsletterSection from "../components/landing/ContactNewsletterSection";
import Footer from "../components/landing/Footer";


export default function Home() {
  return (
    <div
      className="min-h-screen font-sans overflow-x-hidden"
      style={{ background: '#13141f', color: '#fff' }}
    >
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <TrainingSection />
        <IFRSection />
        <LogbookSection />
        <MyUniversSection />
        <ProfileSection />
        <PricingSection />
        <ContactNewsletterSection />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  );
}