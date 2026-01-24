import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, AlertTriangle, Send, CheckCircle, MapPin, Phone, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

type DemoStep = 'idle' | 'detecting' | 'analyzing' | 'alerting' | 'complete';

export function InteractiveDemo() {
  const [step, setStep] = useState<DemoStep>('idle');
  const [progress, setProgress] = useState(0);

  const startDemo = () => {
    setStep('detecting');
    setProgress(0);
    
    // Detection phase
    setTimeout(() => {
      setProgress(33);
      setStep('analyzing');
    }, 800);
    
    // Analysis phase
    setTimeout(() => {
      setProgress(66);
      setStep('alerting');
    }, 1600);
    
    // Alert sent
    setTimeout(() => {
      setProgress(100);
      setStep('complete');
    }, 2400);
    
    // Reset
    setTimeout(() => {
      setStep('idle');
      setProgress(0);
    }, 5000);
  };

  return (
    <section id="demo" className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            🎮 Interactive Demo
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              See It In Action
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Watch how Rakshak responds in under 3 seconds. Click to simulate an emergency.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative mx-auto max-w-sm">
                {/* Phone Frame */}
                <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 border-4 border-gray-700 shadow-2xl">
                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl" />
                  
                  {/* Screen */}
                  <div className="relative bg-black rounded-[2.5rem] overflow-hidden aspect-[9/19]">
                    {/* Status Bar */}
                    <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-between px-8 text-white text-xs z-10">
                      <span>9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-4 border border-white rounded-sm" />
                        <div className="w-4 h-4 border border-white rounded-sm" />
                        <div className="w-4 h-4 border border-white rounded-sm" />
                      </div>
                    </div>

                    {/* App Content */}
                    <div className="relative h-full flex flex-col items-center justify-center p-6 pt-16">
                      <AnimatePresence mode="wait">
                        {step === 'idle' && (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center"
                          >
                            <div className="size-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-cyan-500/50">
                              <Activity className="size-12 text-white" />
                            </div>
                            <h3 className="text-white text-xl font-bold mb-2">Rakshak Active</h3>
                            <p className="text-gray-400 text-sm">Monitoring your safety 24/7</p>
                          </motion.div>
                        )}

                        {step === 'detecting' && (
                          <motion.div
                            key="detecting"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="size-24 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-yellow-500/50"
                            >
                              <AlertTriangle className="size-12 text-white" />
                            </motion.div>
                            <h3 className="text-white text-xl font-bold mb-2">Impact Detected!</h3>
                            <p className="text-gray-400 text-sm">Analyzing situation...</p>
                          </motion.div>
                        )}

                        {step === 'analyzing' && (
                          <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 0.5, repeat: Infinity }}
                              className="size-24 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-orange-500/50"
                            >
                              <Zap className="size-12 text-white" />
                            </motion.div>
                            <h3 className="text-white text-xl font-bold mb-2">Emergency Confirmed</h3>
                            <p className="text-gray-400 text-sm">Preparing alerts...</p>
                          </motion.div>
                        )}

                        {step === 'alerting' && (
                          <motion.div
                            key="alerting"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                          >
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 0.6, repeat: Infinity }}
                              className="size-24 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-red-500/50"
                            >
                              <Send className="size-12 text-white" />
                            </motion.div>
                            <h3 className="text-white text-xl font-bold mb-2">Sending Alerts</h3>
                            <p className="text-gray-400 text-sm">Notifying emergency contacts...</p>
                          </motion.div>
                        )}

                        {step === 'complete' && (
                          <motion.div
                            key="complete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="text-center"
                          >
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="size-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-green-500/50"
                            >
                              <CheckCircle className="size-12 text-white" />
                            </motion.div>
                            <h3 className="text-white text-xl font-bold mb-2">Help On The Way! 🚑</h3>
                            <p className="text-gray-400 text-sm">Squad notified with your location</p>
                            
                            {/* Alert Cards */}
                            <div className="mt-6 space-y-2">
                              <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 flex items-center gap-3"
                              >
                                <Phone className="size-5 text-cyan-400" />
                                <div className="text-left">
                                  <div className="text-white text-sm font-semibold">Mom - Notified ✓</div>
                                  <div className="text-gray-400 text-xs">2 seconds ago</div>
                                </div>
                              </motion.div>
                              <motion.div
                                initial={{ x: -50, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 flex items-center gap-3"
                              >
                                <MapPin className="size-5 text-cyan-400" />
                                <div className="text-left">
                                  <div className="text-white text-sm font-semibold">911 - Dispatched ✓</div>
                                  <div className="text-gray-400 text-xs">2 seconds ago</div>
                                </div>
                              </motion.div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Progress Bar */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* Glow Effect */}
                {step !== 'idle' && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-[3rem] blur-2xl -z-10"
                  />
                )}
              </div>
            </motion.div>

            {/* Info Panel */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <h3 className="text-2xl font-bold text-white mb-6">How It Works</h3>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 size-10 rounded-xl flex items-center justify-center ${step === 'detecting' || step === 'analyzing' || step === 'alerting' || step === 'complete' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-white/10'} transition-all duration-300`}>
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Impact Detection</h4>
                      <p className="text-gray-400 text-sm">AI sensors detect sudden impacts or falls instantly</p>
                      <p className="text-cyan-400 text-xs mt-1">~0.5 seconds</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 size-10 rounded-xl flex items-center justify-center ${step === 'analyzing' || step === 'alerting' || step === 'complete' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-white/10'} transition-all duration-300`}>
                      <span className="text-white font-bold">2</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Smart Analysis</h4>
                      <p className="text-gray-400 text-sm">Confirms emergency and gathers location data</p>
                      <p className="text-cyan-400 text-xs mt-1">~1.2 seconds</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 size-10 rounded-xl flex items-center justify-center ${step === 'alerting' || step === 'complete' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-white/10'} transition-all duration-300`}>
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Emergency Broadcast</h4>
                      <p className="text-gray-400 text-sm">Sends SOS with GPS to all emergency contacts</p>
                      <p className="text-cyan-400 text-xs mt-1">~1.3 seconds</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className={`flex-shrink-0 size-10 rounded-xl flex items-center justify-center ${step === 'complete' ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-white/10'} transition-all duration-300`}>
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold mb-1">Help Dispatched</h4>
                      <p className="text-gray-400 text-sm">Your squad knows and help is on the way</p>
                      <p className="text-green-400 text-xs mt-1">Total: &lt;3 seconds</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={startDemo}
                disabled={step !== 'idle'}
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {step === 'idle' ? '🚨 Simulate Emergency' : 'Simulation Running...'}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
