import { motion } from 'framer-motion';
import { Cpu, Layers, Zap, Shield, Target, Users } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'Advanced Technology',
    description: 'State-of-the-art 3D printers with precision up to 0.05mm layer height.',
  },
  {
    icon: Layers,
    title: 'Premium Materials',
    description: '50+ materials including PLA, ABS, PETG, Nylon, TPU, and specialty resins.',
  },
  {
    icon: Zap,
    title: 'Fast Turnaround',
    description: 'Quick production times with express options available for urgent orders.',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'Every print undergoes rigorous quality checks before shipping.',
  },
  {
    icon: Target,
    title: 'Custom Solutions',
    description: 'From prototypes to production runs, we handle projects of any scale.',
  },
  {
    icon: Users,
    title: 'Expert Support',
    description: '24/7 technical support and design assistance from our team of experts.',
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Why Choose <span className="gradient-text">3DINVENZA</span>?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with exceptional craftsmanship to deliver 
            outstanding 3D printing solutions for every need.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* About Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary font-semibold mb-4 block">Our Story</span>
            <h3 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Pioneering the Future of <span className="gradient-text">Manufacturing</span>
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2020, 3DINVENZA emerged from a vision to democratize access to 
                advanced manufacturing technology. What started as a small workshop has 
                grown into a full-service 3D printing facility serving clients worldwide.
              </p>
              <p>
                Our team of engineers, designers, and materials scientists work tirelessly 
                to push the boundaries of what's possible with additive manufacturing. 
                We've helped thousands of customers turn their ideas into reality.
              </p>
              <p>
                From rapid prototyping for startups to production runs for established 
                enterprises, we provide end-to-end solutions that meet the highest 
                standards of quality and precision.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-border">
              {[
                { value: '5+', label: 'Years Experience' },
                { value: '10K+', label: 'Projects Completed' },
                { value: '50+', label: 'Countries Served' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-3xl font-display font-bold gradient-text">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=800&fit=crop"
                alt="3D Printing Technology"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            
            {/* Floating card */}
            <motion.div
              className="absolute -bottom-8 -left-8 bg-card p-6 rounded-xl border border-border shadow-2xl"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-display font-bold text-2xl gradient-text">99.9%</div>
                  <div className="text-sm text-muted-foreground">Print Success Rate</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
