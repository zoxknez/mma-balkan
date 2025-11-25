'use client';

import React from 'react';
import Link from 'next/link';
import { Zap, Home, Users, Calendar, MapPin } from 'lucide-react';

export function Footer() {
  const navigation = [
    { name: 'Početna', href: '/', icon: Home },
    { name: 'Borci', href: '/fighters', icon: Users },
    { name: 'Događaji', href: '/events', icon: Calendar },
    { name: 'Klubovi', href: '/clubs', icon: MapPin },
  ];

  return (
    <footer data-testid="footer" className="bg-gray-900/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-lg font-bold text-white">
                MMA <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">Balkan</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Prva i jedina platforma koja spaja sve MMA organizacije, borce i klubove 
              sa Balkana na jednom mestu. Lokalni borci, globalne borbe.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigacija</h4>
            <ul data-testid="footer-links" className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    className="text-gray-400 hover:text-green-400 text-sm transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>info@mmabalkan.com</li>
              <li>Beograd, Srbija</li>
              <li>+381 11 123 4567</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 MMA Balkan. Sva prava zadržana.
          </p>
        </div>
      </div>
    </footer>
  );
}
