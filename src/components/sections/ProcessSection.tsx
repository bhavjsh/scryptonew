import { motion } from 'framer-motion';
import { Upload, MessageSquare, Cog, Truck, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: Upload,
    step: '01',
    title: 'Upload Your Design',
    description: 'Send us your 3D model file (STL, OBJ, STEP) or describe your idea and we\'ll help create it.',
    details: 'Supported formats: STL, OBJ, STEP, IGES, 3MF, and more.',
  },
  {
    icon: MessageSquare,
    step: '02',
    title: 'Get Expert Review',
    description: 'Our engineers analyze your design for printability and suggest optimizations.',
    details: 'Free design consultation and DFM recommendations.',
  },
  {
    icon: Cog,
    step: '03',
    title: 'Production Begins',
    description: 'Your design enters our state-of-the-art production facility with real-time tracking.',
    details: 'Quality checks at every stage of production.',
  },
  {
    icon: Truck,
    step: '04',
    title: 'Fast Delivery',
    description: 'Professionally packaged and shipped with tracking. Express options available.',
    details: 'Global shipping with 24-48hr express options.',
  },
  {
    icon: CheckCircle,
    step: '05',
    title: 'Quality Guaranteed',
    description: 'Every print backed by our satisfaction guarantee. Not happy? We\'ll reprint for free.',
    details: '100% satisfaction or free reprint guarantee.',
  },
];

export function ProcessSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
            How It Works
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            From <span className="gradient-text">Concept</span> to <span className="gradient-text">Creation</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our streamlined process ensures quality and speed at every step.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 -translate-x-1/2" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                {/* Content */}
                <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:pl-16'}`}>
                  <motion.div
                    className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`flex items-center gap-4 mb-4 ${
                      index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                    }`}>
                      <span className="text-5xl font-display font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors">
                        {step.step}
                      </span>
                      <h3 className="font-display font-semibold text-xl group-hover:text-primary transition-colors">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {step.description}
                    </p>
                    <p className="text-sm text-primary/80">
                      {step.details}
                    </p>
                  </motion.div>
                </div>

                {/* Center icon */}
                <motion.div
                  className="relative z-10 w-16 h-16 rounded-full bg-card border-2 border-primary flex items-center justify-center card-glow"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <step.icon className="w-7 h-7 text-primary" />
                </motion.div>

                {/* Spacer for opposite side */}
                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
