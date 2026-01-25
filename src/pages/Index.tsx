import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CustomCursor } from '@/components/effects/CustomCursor';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { ProductsSection } from '@/components/sections/ProductsSection';
import { ProcessSection } from '@/components/sections/ProcessSection';
import { TechSection } from '@/components/sections/TechSection';
import { OrdersSection } from '@/components/sections/OrdersSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { NewsletterSection } from '@/components/sections/NewsletterSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <CustomCursor />
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <ProductsSection />
        <ProcessSection />
        <TechSection />
        <OrdersSection />
        <AboutSection />
        <TestimonialsSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
