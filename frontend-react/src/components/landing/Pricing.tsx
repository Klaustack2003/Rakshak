import { motion } from 'motion/react';
import { Check, Zap, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    description: 'Perfect for getting started',
    icon: Zap,
    gradient: 'from-gray-600 to-gray-700',
    features: [
      'Basic accident detection',
      'Up to 3 emergency contacts',
      'Manual SOS button',
      'Location sharing',
      'Community support',
      'Basic app features'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Pro',
    price: '4.99',
    period: 'month',
    description: 'Most popular for individuals',
    icon: Crown,
    gradient: 'from-cyan-500 to-blue-600',
    features: [
      'Advanced AI detection',
      'Unlimited emergency contacts',
      'Auto-alert system',
      'Real-time GPS tracking',
      'Medical info sharing',
      '24/7 priority support',
      'Family sharing (up to 5)',
      'Crash history & analytics',
      'No ads'
    ],
    cta: 'Go Pro',
    popular: true
  },
  {
    name: 'Elite',
    price: '9.99',
    period: 'month',
    description: 'Ultimate protection',
    icon: Sparkles,
    gradient: 'from-purple-500 to-pink-600',
    features: [
      'Everything in Pro',
      'Direct 911 integration',
      'Live emergency concierge',
      'Medical records access',
      'International coverage',
      'Dedicated safety advisor',
      'Family sharing (unlimited)',
      'Premium insurance partner',
      'Wearable device sync',
      'API access'
    ],
    cta: 'Get Elite',
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            💎 Pricing
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Choose Your Level of
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Protection
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            From free to elite. Pick what vibes with you. Cancel anytime, no BS. 🚀
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative group ${plan.popular ? 'md:-mt-4' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg z-10">
                    🔥 Most Popular
                  </div>
                )}

                <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300`} />
                
                <div className={`relative bg-white/5 backdrop-blur-sm border ${plan.popular ? 'border-cyan-500/50' : 'border-white/10'} rounded-2xl p-8 h-full flex flex-col hover:border-cyan-500/30 transition-all duration-300`}>
                  {/* Icon */}
                  <div className={`inline-flex items-center justify-center size-14 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4 shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>

                  {/* Plan Name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-gray-400 text-xl">$</span>
                      <span className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-gray-400">/{plan.period}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full mb-6 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white border-0 shadow-lg shadow-cyan-500/30'
                        : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 flex-grow">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className="size-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-400 mb-6">Trusted by millions. Protected by the best.</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <div className="text-gray-500">
              <div className="text-2xl font-bold text-white">30-Day</div>
              <div className="text-sm">Money Back</div>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="text-gray-500">
              <div className="text-2xl font-bold text-white">256-bit</div>
              <div className="text-sm">Encryption</div>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="text-gray-500">
              <div className="text-2xl font-bold text-white">24/7</div>
              <div className="text-sm">Support</div>
            </div>
            <div className="h-8 w-px bg-gray-700" />
            <div className="text-gray-500">
              <div className="text-2xl font-bold text-white">Cancel</div>
              <div className="text-sm">Anytime</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
