import { motion } from 'motion/react';
import { Shield, Zap, Users, MapPin, Bell, Heart } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: 'Instant Detection',
    description: 'AI algorithms detect impacts in milliseconds. From crash to alert – faster than you can say "help".',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    icon: Bell,
    title: 'Auto Alerts',
    description: 'Unconscious? No worries. Auto-sends SOS with your exact location to your emergency squad.',
    color: 'from-red-500 to-pink-600'
  },
  {
    icon: MapPin,
    title: 'Live Location',
    description: 'Real-time GPS tracking. Your people know exactly where you are. Always.',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Users,
    title: 'Squad Network',
    description: 'Set unlimited contacts. Family, friends, authorities – everyone gets notified instantly.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Military-grade encryption. Your data stays yours. Only shared when it actually matters.',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: Heart,
    title: '24/7 Guardian',
    description: 'Never sleeps, never stops. Your personal bodyguard in your pocket, wherever you go.',
    color: 'from-pink-500 to-rose-600'
  }
];

export function Features() {
  return (
    <section id="features" className="py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 left-1/4 size-96 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 size-96 bg-blue-600/20 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            ⚡ Features
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Built Different,
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Hits Different
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Every feature is fire 🔥 Designed to keep you safe without you lifting a finger
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center size-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4 shadow-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}