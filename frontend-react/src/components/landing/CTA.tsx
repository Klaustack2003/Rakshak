import { motion } from 'motion/react';
import { Download, Apple, Smartphone, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-cyan-600 via-blue-700 to-purple-800 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff12_1px,transparent_1px),linear-gradient(to_bottom,#ffffff12_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Animated Orbs */}
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-0 left-0 size-96 bg-purple-500 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ 
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5]
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute bottom-0 right-0 size-96 bg-cyan-400 rounded-full blur-[120px]"
      />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
          >
            <Sparkles className="size-4" />
            Limited Time: 30-Day Free Trial
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Don't Wait for
            <br />
            <span className="bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
              An Emergency
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Join 2M+ people who already vibe with Rakshak. Download now and get instant protection. 
            It's giving main character energy. ✨
          </p>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 font-bold shadow-2xl">
              <Apple className="mr-2 size-6" />
              Download for iOS
            </Button>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 font-bold shadow-2xl">
              <Smartphone className="mr-2 size-6" />
              Download for Android
            </Button>
          </div>

          {/* Features List */}
          <div className="grid sm:grid-cols-3 gap-6 text-white">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <Download className="size-10 mx-auto mb-3" />
              <div className="font-bold mb-1 text-lg">Free to Start</div>
              <div className="text-sm text-blue-100">No credit card, no commitment</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <Smartphone className="size-10 mx-auto mb-3" />
              <div className="font-bold mb-1 text-lg">Super Easy Setup</div>
              <div className="text-sm text-blue-100">Protected in 3 minutes</div>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all"
            >
              <Sparkles className="size-10 mx-auto mb-3" />
              <div className="font-bold mb-1 text-lg">Premium Trial</div>
              <div className="text-sm text-blue-100">30 days, all features</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}