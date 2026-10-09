import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/sections/HeroSection';
import { ProblemSection } from '../components/sections/ProblemSection';
import { InteractiveDemoSection } from '../components/sections/InteractiveDemoSection';
import { CapabilitiesSection } from '../components/sections/CapabilitiesSection';
import { PipelineSection } from '../components/sections/PipelineSection';
import { AwsStrandsSection } from '../components/sections/AwsStrandsSection';
import { TechStackSection } from '../components/sections/TechStackSection';
import { UseCasesSection } from '../components/sections/UseCasesSection';
import { CtaSection } from '../components/sections/CtaSection';
import { Footer } from '../components/layout/Footer';

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-page-root">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ProblemSection />
        <InteractiveDemoSection />
        <CapabilitiesSection />
        <PipelineSection />
        <AwsStrandsSection />
        <TechStackSection />
        <UseCasesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};
