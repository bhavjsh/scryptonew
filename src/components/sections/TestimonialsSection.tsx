import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Product Designer',
    company: 'TechStart Inc.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    content: '3DINVENZA transformed our prototyping process. What used to take weeks now takes days. The quality and precision are absolutely incredible.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Mechanical Engineer',
    company: 'AutoMotive Solutions',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    content: 'The material options and technical support are outstanding. They helped us choose the perfect material for our high-stress automotive components.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Creative Director',
    company: 'Design Studio Co.',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    content: 'Working with 3DINVENZA has been a game-changer for our creative projects. They turn our wildest designs into tangible reality.',
    rating: 5,
  },
  {
    id: 4,
    name: 'David Wilson',
    role: 'Startup Founder',
    company: 'InnovateTech',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    content: 'Fast turnaround, excellent communication, and top-notch quality. 3DINVENZA is our go-to partner for all prototyping needs.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 relative bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            What Our <span className="gradient-text">Clients</span> Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what our valued customers have to say about their experience.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="bg-card rounded-2xl p-8 md:p-12 border border-border card-glow text-center"
          >
            <Quote className="w-12 h-12 text-primary mx-auto mb-6 opacity-50" />
            
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              "{testimonials[activeIndex].content}"
            </p>

            <div className="flex justify-center gap-1 mb-6">
              {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-primary fill-primary" />
              ))}
            </div>

            <div className="flex items-center justify-center gap-4">
              <img
                src={testimonials[activeIndex].image}
                alt={testimonials[activeIndex].name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary"
              />
              <div className="text-left">
                <div className="font-display font-semibold">{testimonials[activeIndex].name}</div>
                <div className="text-sm text-muted-foreground">
                  {testimonials[activeIndex].role} at {testimonials[activeIndex].company}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex
                    ? 'bg-primary w-8'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          {/* Thumbnail Nav */}
          <div className="hidden md:flex justify-center gap-4 mt-8">
            {testimonials.map((testimonial, index) => (
              <motion.button
                key={testimonial.id}
                onClick={() => setActiveIndex(index)}
                className={`p-1 rounded-full transition-all ${
                  index === activeIndex
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'opacity-50 hover:opacity-100'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
