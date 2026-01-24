import { motion } from 'motion/react';
import { Shield, Download, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/landing/ImageWithFallback';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-950">
      {/* Animated Background Grid */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Glowing Orbs */}
      <div className="absolute top-20 left-10 size-96 bg-cyan-500 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-10 size-96 bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              <Sparkles className="size-4" />
              <span className="text-sm font-semibold">AI-Powered Emergency Response</span>
            </motion.div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
                Your Digital
              </span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Life Saver
              </span>
            </h1>

            <p className="text-xl text-gray-400 leading-relaxed">
              Auto-detects crashes. Alerts your squad instantly. Because when sh*t hits the fan, 
              you need backup ASAP. No cap. 🚨
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/50 px-8">
                <Download className="mr-2 size-5" />
                Get Rakshak
              </Button>
              <Button size="lg" variant="outline" className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent">
                <Zap className="mr-2 size-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">2M+</div>
                  <div className="text-sm text-gray-400">Lives Protected</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">&lt;3s</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg blur-xl opacity-0 group-hover:opacity-30 transition-opacity" />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">99.9%</div>
                  <div className="text-sm text-gray-400">Accuracy</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-cyan-500/20">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1764684994219-8347a5ab0e5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjByZXNwb25zZSUyMGhlbHB8ZW58MXx8fHwxNzY5MjY0MzE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Emergency response team"
                className="w-full h-auto"
              />
              {/* Floating Alert Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="absolute bottom-6 left-6 right-6 bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-xl shadow-lg shadow-cyan-500/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/50">
                    <Shield className="size-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">🚨 Emergency Alert Sent</div>
                    <div className="text-xs text-cyan-400">Squad notified • Help incoming</div>
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="size-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50"
                  />
                </div>
              </motion.div>
            </div>

            {/* Floating Tech Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-6 -right-6 size-24 bg-cyan-500 rounded-full blur-3xl opacity-40"
            />
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-6 -left-6 size-32 bg-blue-600 rounded-full blur-3xl opacity-40"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}