import { motion } from 'framer-motion';
import { useState } from 'react';

const technologies = [
  {
    id: 'fdm',
    name: 'FDM Technology',
    fullName: 'Fused Deposition Modeling',
    description: 'The most widely used 3D printing technology. Thermoplastic filament is heated and extruded layer by layer.',
    specs: [
      { label: 'Layer Height', value: '0.1-0.4mm' },
      { label: 'Build Volume', value: 'Up to 500mm³' },
      { label: 'Accuracy', value: '±0.2mm' },
      { label: 'Materials', value: '15+ options' },
    ],
    materials: ['PLA', 'ABS', 'PETG', 'Nylon', 'TPU', 'Carbon Fiber'],
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&h=400&fit=crop',
  },
  {
    id: 'sla',
    name: 'SLA/DLP Resin',
    fullName: 'Stereolithography & Digital Light Processing',
    description: 'High-precision printing using UV light to cure liquid resin. Perfect for detailed models and jewelry.',
    specs: [
      { label: 'Layer Height', value: '0.025-0.1mm' },
      { label: 'Build Volume', value: 'Up to 290mm³' },
      { label: 'Accuracy', value: '±0.05mm' },
      { label: 'Materials', value: '10+ resins' },
    ],
    materials: ['Standard', 'Tough', 'Flexible', 'Castable', 'Dental', 'Ceramic'],
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop',
  },
  {
    id: 'sls',
    name: 'SLS Industrial',
    fullName: 'Selective Laser Sintering',
    description: 'Industrial-grade technology using lasers to sinter powdered material. No supports needed.',
    specs: [
      { label: 'Layer Height', value: '0.1-0.15mm' },
      { label: 'Build Volume', value: 'Up to 400mm³' },
      { label: 'Accuracy', value: '±0.1mm' },
      { label: 'Materials', value: '8+ powders' },
    ],
    materials: ['PA12 Nylon', 'Glass-Filled', 'Aluminum-Filled', 'Carbon-Filled', 'TPU', 'PEEK'],
    image: 'https://images.unsplash.com/photo-1637609773780-ac17e5021b0b?w=600&h=400&fit=crop',
  },
];

export function TechSection() {
  const [activeTech, setActiveTech] = useState(technologies[0]);

  return (
    <section className="py-24 relative bg-card/50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-sm font-medium bg-primary/10 text-primary rounded-full border border-primary/20">
            Our Technology
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Cutting-Edge <span className="gradient-text">Printing Tech</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We operate the latest industrial-grade 3D printing equipment for unmatched quality.
          </p>
        </motion.div>

        {/* Tech Selector */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {technologies.map((tech) => (
            <motion.button
              key={tech.id}
              onClick={() => setActiveTech(tech)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTech.id === tech.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tech.name}
            </motion.button>
          ))}
        </div>

        {/* Tech Details */}
        <motion.div
          key={activeTech.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={activeTech.image}
              alt={activeTech.name}
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <h3 className="font-display font-bold text-2xl mb-2">{activeTech.name}</h3>
              <p className="text-sm text-muted-foreground">{activeTech.fullName}</p>
            </div>
          </div>

          {/* Details */}
          <div>
            <p className="text-lg text-muted-foreground mb-8">
              {activeTech.description}
            </p>

            {/* Specs Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {activeTech.specs.map((spec, index) => (
                <motion.div
                  key={index}
                  className="bg-muted/50 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-sm text-muted-foreground mb-1">{spec.label}</div>
                  <div className="font-display font-bold text-xl gradient-text">{spec.value}</div>
                </motion.div>
              ))}
            </div>

            {/* Materials */}
            <div>
              <h4 className="font-semibold mb-4">Available Materials</h4>
              <div className="flex flex-wrap gap-2">
                {activeTech.materials.map((material, index) => (
                  <motion.span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {material}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
