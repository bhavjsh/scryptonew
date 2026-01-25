/**
 * ScryptoLanding Page
 * 
 * Futuristic Web3 UI with dark theme, neon accents, glassmorphism,
 * and smooth animations for a trustless skill exchange platform.
 */

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Sparkles, 
  Shield, 
  Trophy,
  ArrowLeftRight,
  Coins,
  CheckCircle,
  Award,
  Gift,
  TrendingUp,
  Star,
  Flame,
  BadgeCheck,
  Zap,
  Lock,
  FileCheck,
  CreditCard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScryptoNavbar } from '@/components/layout/ScryptoNavbar';
import { ScryptoFooter } from '@/components/layout/ScryptoFooter';
import { WalletButton } from '@/components/wallet/WalletButton';
import { EscrowDemo } from '@/components/escrow/EscrowDemo';

const features = [
  {
    icon: ArrowLeftRight,
    title: 'Skill Exchange',
    description: 'Trade skills instead of money. Learn what you want by teaching what you know.'
  },
  {
    icon: Lock,
    title: 'Blockchain Escrow',
    description: 'Smart contract escrow ensures trustless transactions with automatic fund release.'
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Stake-based accountability ensures high-quality exchanges every time.'
  },
  {
    icon: Trophy,
    title: 'Reputation System',
    description: 'Build on-chain reputation through successful sessions. Top teachers earn recognition.'
  }
];

const workflowSteps = [
  {
    step: 1,
    icon: FileCheck,
    title: 'Create Skill',
    description: 'List your skill offering with price and description',
    status: 'Created'
  },
  {
    step: 2,
    icon: Zap,
    title: 'Accept Skill',
    description: 'Browse and accept skill offers from other providers',
    status: 'Accepted'
  },
  {
    step: 3,
    icon: CheckCircle,
    title: 'Complete Work',
    description: 'Deliver the skill session and mark work as complete',
    status: 'Completed'
  },
  {
    step: 4,
    icon: CreditCard,
    title: 'Release Payment',
    description: 'Funds automatically released from escrow on confirmation',
    status: 'Paid'
  }
];

const rewardBenefits = [
  {
    icon: Trophy,
    title: 'Top Teachers',
    description: 'Highest ranked educators receive crypto rewards from the pool.'
  },
  {
    icon: Flame,
    title: 'Satisfaction Streaks',
    description: 'Maintain perfect ratings to earn bonus multipliers.'
  },
  {
    icon: Star,
    title: 'Quality Contributors',
    description: 'Consistent excellence is recognized and rewarded.'
  }
];

const badges = [
  {
    icon: Star,
    name: '100% Satisfaction Mentor',
    description: 'Perfect satisfaction across 5+ sessions'
  },
  {
    icon: Trophy,
    name: 'Top Skill Provider',
    description: 'Ranked in top 10 on leaderboard'
  },
  {
    icon: Award,
    name: 'Trusted Teacher',
    description: '10+ successful sessions completed'
  }
];

export function ScryptoLanding() {
  return (
    <div className="min-h-screen animated-gradient-bg text-foreground relative overflow-hidden">
      <ScryptoNavbar />
      
      {/* Grid pattern overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none grid-pattern opacity-40" />
      
      {/* Animated neon glow orbs */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 rounded-full bg-primary/20 glow-breathe pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 rounded-full bg-accent/20 glow-breathe pointer-events-none" style={{ animationDelay: '2s' }} />
      <div className="fixed top-3/4 left-1/3 w-64 h-64 rounded-full bg-neon-blue/10 glow-breathe pointer-events-none" style={{ animationDelay: '1s' }} />
      <div className="fixed top-1/2 right-1/4 w-48 h-48 rounded-full bg-primary/15 glow-breathe pointer-events-none" style={{ animationDelay: '3s' }} />
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-[10%] w-2 h-2 rounded-full bg-primary/60 drift sparkle" />
        <div className="absolute top-40 left-[25%] w-1 h-1 rounded-full bg-accent/70 drift-delayed sparkle" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-60 left-[40%] w-1.5 h-1.5 rounded-full bg-primary/50 drift sparkle" style={{ animationDelay: '1s' }} />
        <div className="absolute top-32 right-[15%] w-2 h-2 rounded-full bg-accent/60 drift-delayed sparkle" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-80 right-[30%] w-1 h-1 rounded-full bg-primary/70 drift sparkle" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[5%] w-1.5 h-1.5 rounded-full bg-accent/50 drift-delayed sparkle" style={{ animationDelay: '2.5s' }} />
        <div className="absolute top-[70%] right-[8%] w-2 h-2 rounded-full bg-primary/60 drift sparkle" style={{ animationDelay: '3s' }} />
        <div className="absolute top-[45%] left-[60%] w-1 h-1 rounded-full bg-accent/70 drift-delayed sparkle" style={{ animationDelay: '0.8s' }} />
      </div>
      
      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center">
          <div className="container mx-auto px-6 lg:px-8">
            <div className="max-w-5xl mx-auto text-center pt-16 pb-32">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {/* Badge */}
                <motion.div 
                  className="flex justify-center mb-10"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <motion.div 
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-card neon-border-cyan"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-sm font-medium tracking-wide text-foreground/90">Decentralized Skill Exchange</span>
                  </motion.div>
                </motion.div>
                
                {/* Headline with animated keywords */}
                <motion.h1 
                  className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-8 leading-[1.1] tracking-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <span className="text-shimmer">Crypto-Backed</span>
                  <span className="text-foreground/90"> Trust</span>
                  <br />
                  <span className="text-foreground/90">for </span>
                  <span className="gradient-text">Skill Exchange</span>
                </motion.h1>
                
                {/* Subtext */}
                <motion.p 
                  className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  Code enforces trust, not people. Exchange skills with crypto-backed 
                  accountability and automated escrow protection.
                </motion.p>
                
                {/* CTAs */}
                <motion.div 
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.6 }}
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button asChild size="lg" className="gap-2 px-8 py-6 text-base bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-semibold rounded-xl btn-neon">
                      <Link to="/skills">
                        Get Started
                        <ArrowRight className="h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <WalletButton size="lg" />
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <motion.div 
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-6 h-10 rounded-full border-2 border-primary/30 flex items-start justify-center p-2 pulse-glow">
              <motion.div 
                className="w-1 h-2 bg-primary rounded-full"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
          
          {/* Decorative orbiting elements */}
          <div className="absolute top-1/3 right-[15%] pointer-events-none">
            <motion.div 
              className="w-3 h-3 rounded-full bg-primary/40"
              animate={{ 
                x: [0, 60, 0, -60, 0],
                y: [0, -30, -60, -30, 0],
                scale: [1, 1.2, 1, 0.8, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <div className="absolute top-1/2 left-[12%] pointer-events-none">
            <motion.div 
              className="w-2 h-2 rounded-full bg-accent/50"
              animate={{ 
                x: [0, -40, 0, 40, 0],
                y: [0, 40, 80, 40, 0],
                opacity: [0.5, 1, 0.5, 1, 0.5]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </section>

        {/* Interactive Escrow Visualization Section */}
        <section className="py-24 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Experience the <span className="gradient-text">Escrow Lifecycle</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
                Watch how trust is automated through blockchain escrow
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass-card neon-border-cyan rounded-3xl overflow-hidden">
                <CardContent className="p-0">
                  <EscrowDemo autoPlay className="min-h-[550px]" />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Workflow Cards - Card-based with hover animations */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                How It <span className="gradient-text">Works</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Four simple steps powered by smart contract automation
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group"
                >
                  <Card className="glass-card glass-card-hover h-full border-border/20 rounded-2xl overflow-hidden">
                    <CardContent className="p-8">
                      {/* Step number */}
                      <div className="flex items-center justify-between mb-6">
                        <span className="text-xs font-mono text-primary/60">0{step.step}</span>
                        <div className={`status-badge ${
                          step.step === 1 ? 'status-created' : 
                          step.step === 2 ? 'status-accepted' : 
                          step.step === 3 ? 'status-completed' : 
                          'status-paid'
                        }`}>
                          {step.status}
                        </div>
                      </div>
                      
                      {/* Icon */}
                      <motion.div 
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
                      >
                        <step.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      
                      <h3 className="font-semibold text-lg mb-3">{step.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* Connection line */}
            <div className="hidden lg:flex justify-center mt-8">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((i) => (
                  <motion.div 
                    key={i}
                    className="flex items-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <div className="w-16 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
                    <Zap className="h-4 w-4 text-primary mx-1" />
                    <div className="w-16 h-0.5 bg-gradient-to-r from-accent/50 to-primary/50" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features - Glassmorphism cards */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Why <span className="text-shimmer">Scrypto</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Decentralized skill exchange with built-in trust through blockchain technology
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -8 }}
                  className="group float-fast"
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  <Card className="glass-card glass-card-hover h-full border-border/20 rounded-2xl">
                    <CardContent className="p-8">
                      <motion.div 
                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                        animate={{ 
                          boxShadow: [
                            "0 0 0px hsl(185 100% 50% / 0.2)",
                            "0 0 20px hsl(185 100% 50% / 0.4)",
                            "0 0 0px hsl(185 100% 50% / 0.2)"
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      >
                        <feature.icon className="h-6 w-6 text-primary" />
                      </motion.div>
                      <h3 className="font-semibold text-lg mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Message */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <Card className="glass-card neon-border-purple border-accent/20 rounded-3xl overflow-hidden">
                <CardContent className="p-12 text-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
                  <div className="relative z-10">
                    <motion.div
                      animate={{ 
                        rotate: [0, 360],
                        scale: [1, 1.1, 1],
                        boxShadow: [
                          "0 0 20px hsl(185 100% 50% / 0.2)",
                          "0 0 40px hsl(270 80% 65% / 0.4)",
                          "0 0 20px hsl(185 100% 50% / 0.2)"
                        ]
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                        boxShadow: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
                      }}
                      className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                    >
                      <Shield className="h-10 w-10 text-primary" />
                    </motion.div>
                    <h3 className="font-display text-3xl md:text-4xl font-bold mb-6">
                      <span className="gradient-text">"Code Enforces Trust,</span>
                      <br />
                      <span className="text-foreground/90">Not People"</span>
                    </h3>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                      Smart contracts automatically manage escrow, verify completion, 
                      and release payments. No middlemen, no disputes, just trustless transactions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Leaderboard & Rewards */}
        <section className="py-32">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card neon-border-cyan mb-8">
                <Gift className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Earn While You Teach</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Leaderboard <span className="gradient-text">Rewards</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Top performers earn crypto rewards from the community pool
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              {rewardBenefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="float-delayed"
                  style={{ animationDelay: `${index * 0.3}s` }}
                >
                  <Card className="glass-card glass-card-hover text-center h-full border-border/20 rounded-2xl">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-6">
                        <benefit.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto"
            >
              <Card className="glass-card neon-border-cyan border-primary/20 rounded-2xl">
                <CardContent className="p-10 text-center">
                  <TrendingUp className="h-10 w-10 text-primary mx-auto mb-6" />
                  <h3 className="font-display text-xl font-semibold mb-4">
                    Top performers receive
                  </h3>
                  <div className="flex flex-wrap justify-center gap-3 text-sm">
                    <span className="px-4 py-2 rounded-full glass-card border-primary/20 text-foreground/80">
                      Crypto Rewards
                    </span>
                    <span className="px-4 py-2 rounded-full glass-card border-accent/20 text-foreground/80">
                      Platform Recognition
                    </span>
                    <span className="px-4 py-2 rounded-full glass-card border-success/20 text-foreground/80">
                      Priority Matching
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Achievement Badges */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card neon-border-purple mb-8">
                <BadgeCheck className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">On-Chain Proof</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                Achievement <span className="gradient-text">Badges</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Earn verifiable, non-transferable badges as proof of your teaching excellence
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
              {badges.map((badge, index) => (
                <motion.div
                  key={badge.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="float-slow"
                  style={{ animationDelay: `${index * 0.4}s` }}
                >
                  <Card className="glass-card glass-card-hover text-center h-full border-border/20 rounded-2xl">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center mx-auto mb-6">
                        <badge.icon className="h-8 w-8 text-accent" />
                      </div>
                      <h3 className="font-semibold text-lg mb-3">{badge.name}</h3>
                      <p className="text-muted-foreground leading-relaxed">{badge.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                  <Shield className="h-5 w-5 text-primary" />
                  Non-transferable
                </span>
                <span className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Verifiable
                </span>
                <span className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
                  <Lock className="h-5 w-5 text-accent" />
                  Immutable
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 relative">
          <div className="container mx-auto px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto text-center"
            >
              <Card className="glass-card neon-border-cyan rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
                <CardContent className="p-16 relative z-10">
                  <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
                    Ready to <span className="gradient-text">Exchange Skills</span>?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                    Join the decentralized skill economy. Connect your wallet and start 
                    exchanging skills with blockchain-backed trust.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button asChild size="lg" className="gap-2 px-8 py-6 text-base bg-gradient-to-r from-primary to-cyan-400 text-primary-foreground font-semibold rounded-xl btn-neon">
                        <Link to="/skills">
                          Start Exchange
                          <ArrowRight className="h-5 w-5" />
                        </Link>
                      </Button>
                    </motion.div>
                    <WalletButton size="lg" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <ScryptoFooter />
    </div>
  );
}
