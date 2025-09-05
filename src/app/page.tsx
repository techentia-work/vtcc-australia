import { About, Hero, PreferredSuppliers, PricingPlans, Reviews, Services, Footer, Contact, } from "@/components";
import Halls from "@/components/landing/Halls";

export default function page() {
  return (
    <div className="">
      <Hero />

      <About />
      <Reviews />
      <Halls/>
      <PreferredSuppliers />
      <PricingPlans />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};