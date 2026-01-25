import React, { useState } from 'react';
import { Shield, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Features", href: "#features" },
    { label: "Live Demo", href: "#demo" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" }
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Shield className="w-8 h-8 text-cyan-500" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
            RAKSHAK
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => (
            <a 
              key={item.label} 
              href={item.href} 
              className="text-sm text-gray-300 hover:text-cyan-400 transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button 
            onClick={onLoginClick}
            className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold"
          >
            Sign In
          </Button>
        </nav>

        {/* Mobile Menu Button (The "Three Lines") */}
        <button 
          className="md:hidden p-2 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-4 space-y-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-300 hover:text-cyan-400 py-2 block text-center border-b border-white/5"
                >
                  {item.label}
                </a>
              ))}
              
              {/* CRITICAL: This adds the Login button to the mobile menu */}
              <Button 
                onClick={() => {
                  setIsOpen(false);
                  onLoginClick();
                }}
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold mt-4"
              >
                Sign In / Access Console
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}