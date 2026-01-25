import { Link } from 'react-router-dom';
import { Hexagon, Twitter, Github, MessageCircle } from 'lucide-react';

export function ScryptoFooter() {
  return (
    <footer className="relative glass-card border-t border-border/30 mt-20">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary via-primary/80 to-accent flex items-center justify-center">
                  <Hexagon className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-display text-lg font-bold tracking-tight gradient-text">Scrypto</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground -mt-0.5">Skill Exchange</span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Trustless skill exchange powered by blockchain escrow. 
              Code enforces trust, not people.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground/90">Platform</h4>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <Link to="/skills" className="hover:text-primary transition-colors">Skills</Link>
              <Link to="/matches" className="hover:text-primary transition-colors">Find Matches</Link>
              <Link to="/sessions" className="hover:text-primary transition-colors">Sessions</Link>
              <Link to="/leaderboard" className="hover:text-primary transition-colors">Leaderboard</Link>
            </nav>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground/90">Resources</h4>
            <nav className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Documentation</a>
              <a href="#" className="hover:text-primary transition-colors">Smart Contracts</a>
              <a href="#" className="hover:text-primary transition-colors">API</a>
              <a href="#" className="hover:text-primary transition-colors">FAQ</a>
            </nav>
          </div>

          {/* Community */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-foreground/90">Community</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-lg glass-card flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Scrypto. Built for the decentralized future.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
