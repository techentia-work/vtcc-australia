"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";
import vtccLogo from "@/assets/vtcc-logo.png";
import { navItems } from "@/lib/consts";

const Footer = () => {
    return (
        <footer className="bg-primary text-primary-foreground pt-16 pb-8">
            <div className="container mx-auto px-4">
                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Logo & About */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <Image
                                src={vtccLogo}
                                alt="VTCC Logo"
                                width={48}
                                height={48}
                                className="h-12 w-12"
                            />
                            <div>
                                <h2 className="font-serif text-2xl font-bold">Victorian Tamil</h2>
                                <p className="text-sm opacity-80 -mt-1">Community Centre</p>
                            </div>
                        </div>
                        <p className="text-sm opacity-80 leading-relaxed">
                            Bringing communities together with a modern, elegant venue for
                            weddings, celebrations, and cultural events in Melbourne.
                        </p>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-gold">Quick Links</h3>
                        <ul className="space-y-3">
                            {navItems?.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="hover:text-gold transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-gold">Contact</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gold" />
                                <Link href="mailto:info@vtcc.org.au" className="hover:text-gold">
                                    info@vtcc.org.au
                                </Link>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gold" />
                                <Link href="tel:0389006498" className="hover:text-gold">
                                    03 8900 6498
                                </Link>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-gold" />
                                <Link href="tel:0451480410" className="hover:text-gold">
                                    0451 480 410
                                </Link>
                            </li>
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gold mt-1" />
                                <span>123 Community Road, <br /> Melbourne, VIC</span>
                            </li>
                        </ul>
                    </div>

                    {/* CTA + Social */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4 text-gold">Get Involved</h3>
                        <p className="text-sm opacity-80 mb-4">
                            Ready to book your next event? Let’s make your celebration unforgettable.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-block bg-gold text-primary font-semibold px-6 py-3 rounded-lg shadow hover:scale-105 transition-transform"
                        >
                            Book Now
                        </Link>

                        {/* Social */}
                        <div className="flex gap-4 mt-6">
                            <Link href="https://facebook.com" target="_blank" className="hover:text-gold">
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link href="https://instagram.com" target="_blank" className="hover:text-gold">
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link href="https://youtube.com" target="_blank" className="hover:text-gold">
                                <Youtube className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gold/40 mt-12 pt-6 text-center text-sm opacity-80">
                    © {new Date().getFullYear()} Victorian Tamil Community Centre. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
