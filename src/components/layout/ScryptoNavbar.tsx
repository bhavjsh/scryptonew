import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Hexagon, Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { WalletButton } from '@/components/wallet/WalletButton';
import { cn } from '@/lib/utils';

export function ScryptoNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/skills', label: 'Skills' },
    { href: '/matches', label: 'Matches' },
    { href: '/sessions', label: 'Sessions' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/profile', label: 'Profile' },
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/30 backdrop-blur-2xl border-b border-white/5"
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-cyan-400 to-blue-500 flex items-center justify-center">
                <Hexagon className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Scrypto</span>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-0.5">Skill Exchange</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 text-sm transition-colors relative group',
                  location.pathname === link.href
                    ? 'text-cyan-400'
                    : 'text-white/60 hover:text-white'
                )}
              >
                {link.label}
                <span className={cn(
                  'absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-300',
                  location.pathname === link.href ? 'w-3/4' : 'w-0 group-hover:w-3/4'
                )} />
              </Link>
            ))}
          </nav>

          {/* Network & Wallet */}
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs">
              <div className="relative">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-400 animate-ping opacity-50" />
              </div>
              <Zap className="h-3 w-3 text-cyan-400" />
              <span className="text-white/60 font-mono">Monad Testnet</span>
            </div>
            <WalletButton size="sm" />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 bg-white/5 border border-white/10 rounded-lg text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-border/30"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 text-sm rounded-lg transition-colors',
                    location.pathname === link.href
                      ? 'text-cyan-400 bg-cyan-400/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-xs w-fit">
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  <Zap className="h-3 w-3 text-cyan-400" />
                  <span className="text-white/60 font-mono">Monad Testnet</span>
                </div>
                <WalletButton />
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
