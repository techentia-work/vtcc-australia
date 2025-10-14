"use client";

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Award, Users, Globe } from 'lucide-react';
import Link from 'next/link';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-elegant">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-4">
            About Us
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto mb-6"></div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our venue provides an excellent experience for your wedding and other functions, 
            that you'll never forget. We offer a professional and tailored service for you 
            and your guests to suit your momentous occasion.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <h3 className="font-serif text-3xl font-bold text-primary">
              Excellence in Event Hosting
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our dedicated event consultant will help you with all the information and 
              recommendations for your wedding and functions. This includes our preferred 
              suppliers for Catering, Decorations, Professional Photography, Videography, 
              Cake suppliers, Florists, Bands and DJ's, special requests and more…
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              With years of experience in hosting memorable events, we understand the 
              importance of every detail. From intimate gatherings to grand celebrations, 
              our team ensures your special day reflects your vision and exceeds your expectations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="#contact">
              <Button variant="gold" size="lg">
                Contact Us
              </Button></Link>
            </div>
          </div>

          {/* Right Content - Stats */}
          <div className="grid grid-cols-2 gap-6">
            <Card className="p-6 text-center bg-card shadow-elegant hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
              <Heart className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-serif text-2xl font-bold text-primary mb-2">500+</h4>
              <p className="text-muted-foreground">Weddings Celebrated</p>
            </Card>
            
            <Card className="p-6 text-center bg-card shadow-elegant hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
              <Award className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-serif text-2xl font-bold text-primary mb-2">15+</h4>
              <p className="text-muted-foreground">Years Experience</p>
            </Card>
            
            <Card className="p-6 text-center bg-card shadow-elegant hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
              <Users className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-serif text-2xl font-bold text-primary mb-2">350</h4>
              <p className="text-muted-foreground">Guest Capacity</p>
            </Card>
            
            <Card className="p-6 text-center bg-card shadow-elegant hover:shadow-gold transition-all duration-300 hover:-translate-y-1">
              <Globe className="w-10 h-10 text-primary mx-auto mb-4" />
              <h4 className="font-serif text-2xl font-bold text-primary mb-2">100%</h4>
              <p className="text-muted-foreground">Satisfaction Rate</p>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;