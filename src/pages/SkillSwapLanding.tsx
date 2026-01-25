import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Users, Code, RefreshCw, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WalletButton } from '@/components/wallet/WalletButton';

const features = [
  {
    icon: Shield,
    title: 'Trustless Escrow',
    description: 'Smart contracts hold payments securely until work is verified and confirmed by both parties.',
  },
  {
    icon: Zap,
    title: 'Instant Payments',
    description: 'No waiting for bank transfers. Receive ETH directly to your wallet upon completion.',
  },
  {
    icon: Users,
    title: 'Global Access',
    description: 'Connect with skilled professionals and clients worldwide without borders or intermediaries.',
  },
  {
    icon: Code,
    title: 'Web3 Native',
    description: 'Built for the decentralized future. Your reputation and history live on-chain.',
  },
];

const steps = [
  {
    number: '01',
    title: 'Connect Wallet',
    description: 'Link your MetaMask or any EVM-compatible wallet to get started.',
  },
  {
    number: '02',
    title: 'Create or Accept Offers',
    description: 'List your skills with a price in ETH, or browse and accept available offers.',
  },
  {
    number: '03',
    title: 'Complete Work',
    description: 'Deliver quality work. The provider marks completion when done.',
  },
  {
    number: '04',
    title: 'Confirm & Get Paid',
    description: 'Buyer confirms completion. Smart contract releases payment instantly.',
  },
];

export function SkillSwapLanding() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="relative z-10 container mx-auto px-4 pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
            >
              <RefreshCw className="h-4 w-4 text-primary animate-spin-slow" />
              <span className="text-sm text-primary font-medium">Decentralized Skill Exchange</span>
            </motion.div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="text-foreground">Trade Skills.</span>
              <br />
              <span className="gradient-text text-glow">Earn Crypto.</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              A trustless marketplace for exchanging skills and services. 
              Create offers, accept jobs, and get paid in ETH — all secured by smart contracts.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <WalletButton size="lg" />
              <Button variant="outline" size="lg" asChild>
                <Link to="/marketplace" className="gap-2">
                  Browse Marketplace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-16 max-w-lg mx-auto"
            >
              {[
                { value: '100+', label: 'Active Offers' },
                { value: '50 ETH', label: 'Total Volume' },
                { value: '99%', label: 'Success Rate' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Why <span className="gradient-text">Skills Marketplace</span>?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A new paradigm for freelance work — transparent, borderless, and trustless.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full card-glow bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to start trading skills on the blockchain.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="text-5xl font-display font-bold text-primary/20 mb-4">
                  {step.number}
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-accent/20 border border-primary/20 p-12 text-center"
          >
            <div className="absolute inset-0 grid-pattern opacity-30" />
            <div className="relative z-10">
              <Wallet className="h-12 w-12 text-primary mx-auto mb-6" />
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Ready to Start Trading Skills?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Connect your wallet and join the decentralized economy. 
                Create your first offer or browse available skills now.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <WalletButton size="lg" />
                <Button variant="outline" size="lg" asChild>
                  <Link to="/create-offer" className="gap-2">
                    Create Offer
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <span className="font-display font-bold">SKILLS MARKETPLACE</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Skills Marketplace. Powered by Ethereum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
