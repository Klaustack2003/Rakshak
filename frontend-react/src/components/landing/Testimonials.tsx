import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Marathon Runner',
    content: 'Had a nasty fall during my trail run. Rakshak literally saved my life by alerting my fam before I could even think straight. This app is a whole vibe. 💯',
    rating: 5,
    avatar: 'SJ'
  },
  {
    name: 'Michael Chen',
    role: 'Daily Commuter',
    content: 'Got into a car accident and blacked out. Woke up to paramedics already there. Rakshak did its thing while I was out. Unreal. Everyone needs this fr fr.',
    rating: 5,
    avatar: 'MC'
  },
  {
    name: 'Emily Rodriguez',
    role: 'Living Solo',
    content: 'As someone living alone, this app is everything. Had a bad fall at home and my sis got the alert instantly. She saved me. Rakshak is worth every penny.',
    rating: 5,
    avatar: 'ER'
  },
  {
    name: 'David Thompson',
    role: 'Cyclist',
    content: 'Got hit while cycling to work. I was dazed af and couldn\'t use my phone. Rakshak automatically sent my location to everyone. Straight up a lifesaver.',
    rating: 5,
    avatar: 'DT'
  },
  {
    name: 'Lisa Park',
    role: 'Concerned Daughter',
    content: 'My parents are getting older and this gives me so much peace of mind. They\'re protected 24/7 and I get alerts. Best investment for their safety fr.',
    rating: 5,
    avatar: 'LP'
  },
  {
    name: 'James Wilson',
    role: 'Construction Worker',
    content: 'Working construction is risky. Had an accident on site and my boss was notified in seconds. The AI detection is scary accurate. This app slaps. 🔥',
    rating: 5,
    avatar: 'JW'
  }
];

export function Testimonials() {
  return (
    <section id="reviews" className="py-20 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-1/4 left-0 size-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-0 size-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            ⭐ Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Real People,
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              Real Life-Saving Stories
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Don't just take our word. These folks are alive because of Rakshak. No cap. 🙏
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-all">
                <Quote className="absolute top-6 right-6 size-8 text-cyan-500/30" />
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="size-12 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-cyan-400 text-cyan-400" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid md:grid-cols-4 gap-8"
        >
          <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">4.9/5</div>
            <div className="text-gray-400">App Store Rating</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">15K+</div>
            <div className="text-gray-400">5-Star Reviews</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">2M+</div>
            <div className="text-gray-400">Downloads</div>
          </div>
          <div className="text-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">150+</div>
            <div className="text-gray-400">Countries</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}