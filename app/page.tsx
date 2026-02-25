"use client";

import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import Services from "@/components/Services";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Kit from "@/components/Kit";
import AppSection from "@/components/AppSection";
import Booking from "@/components/Booking";
import Footer from "@/components/Footer";

const Nav = dynamic(() => import("@/components/Nav"), { ssr: false });

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Ticker />
        <Services />
        <About />
        <Experience />
        <Kit />
        <AppSection />
        <Booking />
        <Footer />
      </main>
    </>
  );
}
