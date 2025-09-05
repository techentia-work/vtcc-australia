"use client";
import { useState } from 'react';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from "next/image";
import vtccLogo from "@/assets/vtcc-logo.png";
import Link from 'next/link';
import { navItems } from '@/lib/consts';


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top Contact Bar */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <Link href="mailto:info@vtcc.org.au" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Mail className="w-4 h-4" />
              info@vtcc.org.au
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="tel:0389006498" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4" />
              03 8900 6498
            </Link>
            <Link href="tel:0451480410" className="flex items-center gap-2 hover:text-gold transition-colors">
              <Phone className="w-4 h-4" />
              0451 480 410
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <Image src={vtccLogo} alt="VTCC Logo" width={48} height={48} className="h-12 w-12" priority />
              <div>
                <h1 className="font-serif text-2xl font-bold text-primary">
                  Victorian Tamil
                </h1>
                <p className="text-sm text-muted-foreground -mt-1">
                  Community Centre
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navItems?.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors font-medium"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center gap-4">

              <Button variant="gold" size="lg" className="hidden lg:flex">
                <Link href="/contact" >
                  Book Now
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col gap-6 mt-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                    <Button variant="gold" size="lg" className="hidden lg:flex">
                      <Link href="/contact" >
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;