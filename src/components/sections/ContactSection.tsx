import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: Mail,
    title: 'Email Us',
    content: 'hello@print3d.com',
    link: 'mailto:hello@print3d.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    content: '+1 (555) 123-4567',
    link: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    content: '123 Innovation Drive, Tech City, TC 12345',
    link: '#',
  },
  {
    icon: Clock,
    title: 'Business Hours',
    content: 'Mon-Fri: 9AM-6PM EST',
    link: '#',
  },
];

const socialLinks = [
  { name: 'Twitter', icon: '𝕏', href: '#' },
  { name: 'LinkedIn', icon: 'in', href: '#' },
  { name: 'Instagram', icon: '📸', href: '#' },
  { name: 'YouTube', icon: '▶️', href: '#' },
];

export function ContactSection() {
  return (
    <section id="contact" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            className="bg-card rounded-2xl p-8 border border-border"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Send a Message
            </h3>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="mb-2 block">Name</Label>
                  <Input id="name" placeholder="Your name" className="bg-background" />
                </div>
                <div>
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" className="bg-background" />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="mb-2 block">Subject</Label>
                <Input id="subject" placeholder="What's this about?" className="bg-background" />
              </div>

              <div>
                <Label htmlFor="message" className="mb-2 block">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project..."
                  className="bg-background min-h-[150px]"
                />
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg font-semibold">
                Send Message
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={index}
                  href={info.link}
                  className="bg-card p-6 rounded-xl border border-border hover:border-primary/50 transition-all group"
                  whileHover={{ y: -4 }}
                >
                  <info.icon className="w-8 h-8 text-primary mb-3" />
                  <h4 className="font-semibold mb-1 group-hover:text-primary transition-colors">{info.title}</h4>
                  <p className="text-sm text-muted-foreground">{info.content}</p>
                </motion.a>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="bg-card rounded-xl border border-border overflow-hidden h-[250px] relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-3" />
                  <p className="font-display font-semibold">Interactive Map</p>
                  <p className="text-sm text-muted-foreground">Coming Soon</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-card p-6 rounded-xl border border-border">
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg hover:bg-primary hover:text-primary-foreground transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
