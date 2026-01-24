import { motion } from 'motion/react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How does Rakshak detect accidents automatically?',
    answer: 'Rakshak uses advanced AI algorithms that analyze data from your phone\'s accelerometer, gyroscope, and GPS. When it detects sudden impact patterns, abrupt speed changes, or abnormal falls, it immediately initiates the emergency protocol. The AI has been trained on millions of accident scenarios to distinguish between actual emergencies and regular movement.'
  },
  {
    question: 'Will it drain my phone battery?',
    answer: 'Nah, we optimized it hard. Rakshak uses less than 2% battery per day. Our smart detection system only activates when needed, and we use efficient background processing. You can protect yourself 24/7 without worrying about your battery dying.'
  },
  {
    question: 'What if I\'m in an area with no signal?',
    answer: 'Rakshak stores your last known location and emergency info locally. Once you regain signal, it immediately sends out all alerts. We also support offline mode where the app can trigger loud alarms and flash lights to attract nearby help.'
  },
  {
    question: 'Can I cancel a false alarm?',
    answer: 'Absolutely! When an impact is detected, you get a 30-second countdown with a big "I\'m OK" button. If you\'re conscious and fine, just tap it to cancel. No false alerts sent. Simple as that.'
  },
  {
    question: 'Is my location data private and secure?',
    answer: 'For sure. Your location is encrypted with military-grade 256-bit encryption and only stored on your device. It\'s ONLY shared when an actual emergency is detected. We don\'t sell your data, track you for ads, or do any shady stuff. Your privacy = our priority.'
  },
  {
    question: 'Does it work in other countries?',
    answer: 'Yes! Rakshak works worldwide. Our Pro and Elite plans include international emergency numbers and support. Whether you\'re in NYC or Tokyo, your squad gets notified with the correct local emergency services info.'
  },
  {
    question: 'Can my family members get notified too?',
    answer: 'Hell yeah! You can add unlimited emergency contacts (varies by plan). They get instant SMS and app notifications with your exact location, medical info you\'ve shared, and the ability to track your situation in real-time.'
  },
  {
    question: 'What kind of accidents does it detect?',
    answer: 'Rakshak detects car crashes, motorcycle accidents, bike falls, severe falls (stairs, hiking), and any high-impact events. Our AI continuously improves and learns new accident patterns. We\'re also adding sports-specific detection modes.'
  },
  {
    question: 'Do I need to keep the app open?',
    answer: 'Nope! Rakshak runs in the background 24/7. Just install it, set up your contacts, and forget about it. It\'ll be there when you need it, even if you haven\'t opened the app in weeks.'
  },
  {
    question: 'What about medical conditions?',
    answer: 'You can add your medical info, allergies, blood type, and emergency medications in your profile. When an alert is sent, this info goes to your contacts and emergency responders so they know exactly how to help you.'
  }
];

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute top-0 right-0 size-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 left-0 size-96 bg-blue-600/10 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-block bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm">
            ❓ FAQ
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Questions?
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              We Got Answers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to know about Rakshak. Still confused? Hit us up. 💬
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-6 hover:border-cyan-500/30 transition-colors data-[state=open]:border-cyan-500/50"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6 text-white font-semibold">
                    <span className="flex-1 pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-3">
              Still have questions?
            </h3>
            <p className="text-gray-400 mb-6">
              Our support squad is here 24/7. We respond fast, no automated BS.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:help@rakshak.app"
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-cyan-500/30"
              >
                📧 Email Support
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-semibold transition-all border border-white/20"
              >
                💬 Live Chat
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
