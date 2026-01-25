/**
 * SkillsPage - Wizard-style skill selection page
 * Step 1: Skills You Know (what you can teach)
 * Step 2: Skills to Learn (what you want to learn)
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Sparkles, 
  Loader2,
  Code2,
  Atom,
  FileCode,
  Blocks,
  Server,
  Globe,
  Link,
  Search,
  Brain,
  BarChart3,
  Shield,
  Wrench,
  Gamepad2,
  Smartphone,
  Palette,
  PenTool,
  Image,
  Pencil,
  Theater,
  Box,
  Film,
  Camera,
  Music,
  Guitar,
  Piano,
  Headphones,
  Mic2,
  Coins,
  TrendingUp,
  SearchCheck,
  FileText,
  Megaphone,
  FileEdit,
  MessageSquare,
  BookOpen,
  ClipboardList,
  Languages,
  Package,
  Rocket,
  Banknote,
  LineChart,
  LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ScryptoNavbar } from '@/components/layout/ScryptoNavbar';
import { ScryptoFooter } from '@/components/layout/ScryptoFooter';
import { WalletButton } from '@/components/wallet/WalletButton';
import { useWeb3 } from '@/contexts/Web3Context';
import { useSkills } from '@/hooks/useSkills';
import { cn } from '@/lib/utils';

// Skill icon mapping - Lucide icons for professional look
const SKILL_ICONS: Record<string, LucideIcon> = {
  'Solidity': Blocks,
  'React': Atom,
  'Python': FileCode,
  'TypeScript': Code2,
  'Rust': Wrench,
  'Node.js': Server,
  'JavaScript': FileCode,
  'Web3': Globe,
  'Blockchain Development': Link,
  'Smart Contract Auditing': Search,
  'Machine Learning': Brain,
  'Data Analysis': BarChart3,
  'Cybersecurity': Shield,
  'DevOps': Wrench,
  'Game Development': Gamepad2,
  'Mobile Development': Smartphone,
  'UI/UX Design': Palette,
  'Figma': PenTool,
  'Adobe Photoshop': Image,
  'Graphic Design': Pencil,
  'Illustration': Theater,
  '3D Modeling': Box,
  'Video Editing': Film,
  'Photography': Camera,
  'Music Production': Music,
  'Guitar': Guitar,
  'Piano': Piano,
  'DJ/Mixing': Headphones,
  'Singing': Mic2,
  'DeFi': Coins,
  'Trading': TrendingUp,
  'SEO': SearchCheck,
  'Content Writing': FileText,
  'Social Media Marketing': Megaphone,
  'Technical Writing': FileEdit,
  'Copywriting': MessageSquare,
  'Storytelling': BookOpen,
  'Grant Writing': ClipboardList,
  'Spanish': Languages,
  'French': Languages,
  'Mandarin': Languages,
  'Japanese': Languages,
  'German': Languages,
  'Korean': Languages,
  'Product Management': Package,
  'Startup Strategy': Rocket,
  'Fundraising': Banknote,
  'Business Analytics': LineChart,
};

// Default icon for skills not in the mapping
const DefaultSkillIcon = BookOpen;

// Category order for display
const CATEGORY_ORDER = [
  'Development',
  'Design',
  'Marketing',
  'Business',
  'Languages',
  'Music',
  'Finance',
  'Writing',
  'Data',
  'Creative',
  'Media',
];

interface SkillWithCollateral {
  id: string;
  name: string;
  category: string;
  collateral_amount: number;
  created_at: string;
}

export function SkillsPage() {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();
  const {
    skills,
    userSkills,
    wantedSkills,
    loading,
    addUserSkill,
    removeUserSkill,
    addWantedSkill,
    removeWantedSkill,
  } = useSkills();

  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('Development');
  const [actionLoading, setActionLoading] = useState(false);

  // Get unique categories from skills
  const categories = useMemo(() => {
    const cats = [...new Set(skills.map(s => s.category))];
    return CATEGORY_ORDER.filter(c => cats.includes(c));
  }, [skills]);

  // Set default category when skills load
  useEffect(() => {
    if (categories.length > 0 && !categories.includes(selectedCategory)) {
      setSelectedCategory(categories[0]);
    }
  }, [categories, selectedCategory]);

  // Filter skills by selected category
  const filteredSkills = useMemo(() => {
    return skills.filter(s => s.category === selectedCategory) as SkillWithCollateral[];
  }, [skills, selectedCategory]);

  // Get selected skill IDs based on step
  const selectedSkillIds = step === 1
    ? userSkills.map(s => s.skill_id)
    : wantedSkills.map(s => s.skill_id);

  // Handle skill toggle
  const handleSkillToggle = async (skillId: string) => {
    setActionLoading(true);
    const isSelected = selectedSkillIds.includes(skillId);

    if (step === 1) {
      if (isSelected) {
        const { error } = await removeUserSkill(skillId);
        if (error) toast.error(error);
      } else {
        const { error } = await addUserSkill(skillId);
        if (error) toast.error(error);
      }
    } else {
      if (isSelected) {
        const { error } = await removeWantedSkill(skillId);
        if (error) toast.error(error);
      } else {
        const { error } = await addWantedSkill(skillId);
        if (error) toast.error(error);
      }
    }
    setActionLoading(false);
  };

  // Check if can proceed
  const canProceed = step === 1 ? userSkills.length > 0 : wantedSkills.length > 0;

  // Handle navigation
  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      navigate('/matches');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
    } else {
      navigate('/profile');
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <ScryptoNavbar />
        <main className="container mx-auto px-4 pt-24 pb-16 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-muted-foreground mb-6">
              Connect your wallet to set up your skills
            </p>
            <WalletButton />
          </div>
        </main>
        <ScryptoFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScryptoNavbar />

      <main className="container mx-auto px-4 pt-24 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 1 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-primary/20 text-primary"
              )}>
                {step > 1 ? <Check className="h-4 w-4" /> : '1'}
              </div>
              <span className={cn(
                "font-medium",
                step === 1 ? "text-foreground" : "text-muted-foreground"
              )}>
                Skills You Know
              </span>
            </div>

            <div className="w-16 h-px bg-border" />

            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                step === 2 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                2
              </div>
              <span className={cn(
                "font-medium",
                step === 2 ? "text-primary" : "text-muted-foreground"
              )}>
                Skills to Learn
              </span>
            </div>
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: step === 1 ? 20 : -20 }}
                transition={{ duration: 0.2 }}
              >
                {/* Header card */}
                <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 p-6 mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold mb-1">
                        {step === 1 ? 'What skills can you teach?' : 'What do you want to learn?'}
                      </h1>
                      <p className="text-muted-foreground">
                        {step === 1 
                          ? 'Select the skills you can share with others' 
                          : 'Choose skills you want to learn from peers'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map(category => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className="rounded-full"
                    >
                      {category}
                    </Button>
                  ))}
                </div>

                {/* Skills grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                      {filteredSkills.map(skill => {
                        const isSelected = selectedSkillIds.includes(skill.id);
                        const IconComponent = SKILL_ICONS[skill.name] || DefaultSkillIcon;

                        return (
                          <button
                            key={skill.id}
                            onClick={() => handleSkillToggle(skill.id)}
                            disabled={actionLoading}
                            className={cn(
                              "relative p-4 rounded-xl border-2 text-left transition-all hover:shadow-md backdrop-blur-sm",
                              isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border/50 bg-card/40 hover:border-primary/50 hover:bg-card/60"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="h-3 w-3 text-primary-foreground" />
                              </div>
                            )}
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                              <IconComponent className="h-5 w-5 text-primary" />
                            </div>
                            <div className="font-medium text-sm">{skill.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {skill.collateral_amount} ETH
                            </div>
                          </button>
                        );
                      })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>

                  <Button onClick={handleNext} disabled={!canProceed}>
                    {step === 2 ? 'Find Matches' : 'Next'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </main>

      <ScryptoFooter />
    </div>
  );
}

export default SkillsPage;
