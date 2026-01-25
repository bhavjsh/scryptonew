import { motion } from 'framer-motion';
import { Printer, Cog, Rocket, Package, Palette, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    icon: Printer,
    title: 'FDM Printing',
    description: 'Fused Deposition Modeling for durable prototypes and functional parts. Ideal for large-scale models.',
    features: ['PLA, ABS, PETG, Nylon', 'Up to 500x500x500mm', 'Layer height from 0.1mm'],
    price: 'From $15',
    color: 'primary',
  },
  {
    icon: Palette,
    title: 'Resin Printing',
    description: 'High-resolution SLA/DLP printing for detailed miniatures, jewelry, and precision parts.',
    features: ['Standard & Tough Resins', 'Dental & Castable', '0.025mm layer precision'],
    price: 'From $25',
    color: 'accent',
  },
  {
    icon: Cog,
    title: 'Industrial SLS',
    description: 'Selective Laser Sintering for complex geometries and production-ready parts.',
    features: ['Nylon PA12 & Glass-filled', 'No support structures', 'High mechanical strength'],
    price: 'From $50',
    color: 'primary',
  },
  {
    icon: Rocket,
    title: 'Rapid Prototyping',
    description: '24-48 hour turnaround for urgent prototype needs. Perfect for iterative design.',
    features: ['Express 24hr delivery', 'Design feedback included', 'Multiple revision support'],
    price: 'From $35',
    color: 'accent',
  },
  {
    icon: Package,
    title: 'Batch Production',
    description: 'Scale from 10 to 10,000 units with consistent quality and competitive pricing.',
    features: ['Volume discounts', 'Quality assurance', 'Assembly services'],
    price: 'Custom quote',
    color: 'primary',
  },
  {
    icon: Settings,
    title: 'Post-Processing',
    description: 'Professional finishing services including sanding, painting, and assembly.',
    features: ['Vapor smoothing', 'Metal plating', 'Custom colors & textures'],
    price: 'From $10',
    color: 'accent',
  },
];

export function ServicesSection() {
  return (
    <section id="services" className="py-24 relative bg-secondary/10">
      {/* Background effects */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-accent/10 text-accent rounded-full border border-accent/20">
            Our Services
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Comprehensive <span className="gradient-text-accent">3D Solutions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From concept to completion, we offer end-to-end 3D printing services 
            tailored to your unique requirements.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/50 transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              {/* Gradient accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                service.color === 'accent' 
                  ? 'from-accent to-accent/50' 
                  : 'from-primary to-primary/50'
              }`} />
              
              <div className="p-8">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${
                  service.color === 'accent' 
                    ? 'bg-accent/10 group-hover:bg-accent/20' 
                    : 'bg-primary/10 group-hover:bg-primary/20'
                } transition-colors`}>
                  <service.icon className={`w-7 h-7 ${
                    service.color === 'accent' ? 'text-accent' : 'text-primary'
                  }`} />
                </div>

                <h3 className="font-display font-semibold text-xl mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-6">
                  {service.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        service.color === 'accent' ? 'bg-accent' : 'bg-primary'
                      }`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className={`font-display font-bold text-lg ${
                    service.color === 'accent' ? 'gradient-text-accent' : 'gradient-text'
                  }`}>
                    {service.price}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={service.color === 'accent' ? 'text-accent hover:text-accent' : 'text-primary hover:text-primary'}
                  >
                    Learn More →
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground mb-6">
            Need a custom solution? We'll work with you to create the perfect package.
          </p>
          <Button 
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold px-8"
          >
            Get Custom Quote
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
