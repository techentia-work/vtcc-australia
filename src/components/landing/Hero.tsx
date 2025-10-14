"use client";

import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star } from 'lucide-react';
import heroHall from '@/assets/hero-hall.jpg';
import Image from 'next/image';
import Link from 'next/link';

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <Image src={heroHall} alt="Victorian Tamil Community Centre Hall" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-hero" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-10 text-center text-white">
        <div className="max-w-5xl mx-auto">
          {/* Main Heading */}
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-">
            Victorian Tamil
            <span className="block text-gold">Community Centre</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-[18px] mb-8 text-white/90 max-w-4xl mx-auto leading-relaxed">
            Give your special day an elegant touch by hosting your function at our beautiful Palmyra Hall.
            We provide an excellent experience that you'll never forget.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/contact" >
            <Button variant="hero" size="xl" className="font-semibold">
              <Calendar className="w-5 h-5" />
              Book Your Event
            </Button></Link>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Users className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">350 Guests</h3>
              <p className="text-white/80">Spacious hall accommodating up to 350 guests</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <MapPin className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">On-site Parking</h3>
              <p className="text-white/80">Convenient parking available for all guests</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <Star className="w-8 h-8 text-gold mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-2">Full Service</h3>
              <p className="text-white/80">Complete event planning and coordination</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent" />
    </section>
  );
};

export default Hero;