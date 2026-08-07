"use client";

import { useScrollAnimate } from "@/app/hooks/useAnimations";
import Navbar from "@/app/components/Navbar";
import ScrollTop from "@/app/components/ScrollTop";
import Hero from "@/app/components/landing/Hero";
import Ticker from "@/app/components/landing/Ticker";
import HowItWorks from "@/app/components/landing/HowItWorks";
import FeaturedDrops from "@/app/components/landing/FeaturedDrops";
import TrustScore from "@/app/components/landing/TrustScore";
import Testimonials from "@/app/components/landing/Testimonials";
import CtaBanner from "@/app/components/landing/CtaBanner";
import Footer from "@/app/components/landing/Footer";

export default function Home() {
  useScrollAnimate();

  return (
    <>
      <Navbar />
      <Hero />
      <Ticker />
      <HowItWorks />
      <FeaturedDrops />
      <TrustScore />
      <Testimonials />
      <CtaBanner />
      <Footer />
      <ScrollTop />
    </>
  );
}
