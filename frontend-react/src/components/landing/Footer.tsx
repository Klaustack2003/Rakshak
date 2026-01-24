import { Shield, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-gray-300 pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <Shield className="size-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Rakshak</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Your digital guardian. Auto-alerting your squad when life hits different. Stay safe, stay protected. 🛡️
            </p>
            <div className="flex gap-3">
              <a href="#" className="size-10 bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all border border-white/10 hover:border-transparent">
                <Facebook className="size-5" />
              </a>
              <a href="#" className="size-10 bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all border border-white/10 hover:border-transparent">
                <Twitter className="size-5" />
              </a>
              <a href="#" className="size-10 bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all border border-white/10 hover:border-transparent">
                <Instagram className="size-5" />
              </a>
              <a href="#" className="size-10 bg-white/5 hover:bg-gradient-to-br hover:from-cyan-500 hover:to-blue-600 rounded-lg flex items-center justify-center transition-all border border-white/10 hover:border-transparent">
                <Linkedin className="size-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="hover:text-cyan-400 transition-colors">Features</a></li>
              <li><a href="#demo" className="hover:text-cyan-400 transition-colors">Demo</a></li>
              <li><a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a></li>
              <li><a href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Download</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Press Kit</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="size-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>help@rakshak.app</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>1-800-SAFE-911</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="size-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Silicon Valley, CA 94025</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 Rakshak. All rights reserved. Built with 💙 for your safety.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cyan-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}