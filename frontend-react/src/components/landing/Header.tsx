import { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Menu, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button'; 

interface HeaderProps {
  onLoginClick: () => void;
}

export function Header({ onLoginClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Features', href: '#features' },
    { name: 'Demo', href: '#demo' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'FAQ', href: '#faq' }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <Shield className="size-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Rakshak</span>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-300 hover:text-cyan-400 transition-colors font-medium">
                {item.name}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Button onClick={onLoginClick} variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
              Sign In
            </Button>
            <Button onClick={onLoginClick} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/30">
              <Download className="mr-2 size-4" />
              Get App
            </Button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-gray-300 hover:text-white">
            {isMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>
    </motion.header>
  );
}