import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, Search, RefreshCw, Users } from 'lucide-react';
import { ScryptoNavbar } from '@/components/layout/ScryptoNavbar';
import { ScryptoFooter } from '@/components/layout/ScryptoFooter';
import { MatchCard } from '@/components/skills/MatchCard';
import { WalletButton } from '@/components/wallet/WalletButton';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMatching } from '@/hooks/useMatching';
import { useSkills } from '@/hooks/useSkills';
import { useWeb3 } from '@/contexts/Web3Context';
import { PotentialMatch } from '@/types/scrypto';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface UserProfile {
  id: string;
  wallet_address: string;
  full_name: string | null;
  bio: string | null;
  reputation?: {
    reputation_score: number;
    successful_sessions: number;
    total_sessions: number;
  };
  skills?: { name: string; category: string }[];
  wantedSkills?: { name: string; category: string }[];
}

export function FindMatchesPage() {
  const { isConnected, account } = useWeb3();
  const { userSkills, wantedSkills, loading: skillsLoading } = useSkills();
  const { potentialMatches, loading, findMatches, createMatch } = useMatching();
  const [actionLoading, setActionLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);

  // Fetch all users who joined the platform
  useEffect(() => {
    const fetchAllUsers = async () => {
      setUsersLoading(true);
      try {
        // Get all user profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('user_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          return;
        }

        // Get all reputations
        const { data: reputations } = await supabase
          .from('user_reputation')
          .select('*');

        // Get all user skills with skill details
        const { data: userSkillsData } = await supabase
          .from('user_skills')
          .select('wallet_address, skill:skills(name, category)');

        // Get all wanted skills with skill details
        const { data: wantedSkillsData } = await supabase
          .from('user_wanted_skills')
          .select('wallet_address, skill:skills(name, category)');

        // Build user profiles with reputation and skills
        const usersWithDetails: UserProfile[] = (profiles || []).map(profile => {
          const reputation = reputations?.find(r => r.wallet_address === profile.wallet_address);
          const skills = userSkillsData
            ?.filter(s => s.wallet_address === profile.wallet_address)
            .map(s => s.skill as { name: string; category: string })
            .filter(Boolean) || [];
          const wanted = wantedSkillsData
            ?.filter(s => s.wallet_address === profile.wallet_address)
            .map(s => s.skill as { name: string; category: string })
            .filter(Boolean) || [];

          return {
            ...profile,
            reputation: reputation ? {
              reputation_score: reputation.reputation_score,
              successful_sessions: reputation.successful_sessions,
              total_sessions: reputation.total_sessions
            } : undefined,
            skills,
            wantedSkills: wanted
          };
        });

        // Filter out current user
        const filteredUsers = account 
          ? usersWithDetails.filter(u => u.wallet_address.toLowerCase() !== account.toLowerCase())
          : usersWithDetails;

        setAllUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchAllUsers();
  }, [account]);

  useEffect(() => {
    if (isConnected && userSkills.length > 0 && wantedSkills.length > 0) {
      findMatches();
    }
  }, [isConnected, userSkills.length, wantedSkills.length, findMatches]);

  const handleConnect = async (match: PotentialMatch) => {
    setActionLoading(true);
    
    // Find my skill that they want
    const mySkill = userSkills.find(s => s.skill_id === match.theyWant.id);
    if (!mySkill) {
      toast.error('Could not find matching skill');
      setActionLoading(false);
      return;
    }

    const { error } = await createMatch(
      match.wallet_address,
      mySkill.skill_id,
      match.theyTeach.id
    );

    if (error) {
      toast.error(error);
    } else {
      toast.success('Match request sent!');
      findMatches();
    }
    
    setActionLoading(false);
  };

  const hasSkills = userSkills.length > 0 && wantedSkills.length > 0;
  const truncateAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScryptoNavbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">
                  Find <span className="gradient-text">Matches</span>
                </h1>
                <p className="text-muted-foreground">
                  Discover users with complementary skills for exchange.
                </p>
              </div>
              {isConnected && hasSkills && (
                <Button onClick={findMatches} disabled={loading} variant="outline">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              )}
            </div>

            {/* Potential Matches Section */}
            {isConnected && hasSkills && potentialMatches.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-primary">⚡</span> Your Potential Matches
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {potentialMatches.map((match) => (
                    <MatchCard
                      key={`${match.wallet_address}-${match.theyTeach.id}-${match.theyWant.id}`}
                      match={match}
                      onConnect={handleConnect}
                      loading={actionLoading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Users Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                All Community Members ({allUsers.length})
              </h2>
              
              {usersLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : allUsers.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Users Yet</h3>
                  <p className="text-muted-foreground">
                    Be the first to join the community!
                  </p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {allUsers.map((user, index) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="glass-card border-white/10 hover:border-primary/50 transition-all duration-300 overflow-hidden group">
                        <CardContent className="p-6">
                          {/* User Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-lg font-bold">
                                {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {user.full_name || 'Anonymous'}
                                </h3>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {truncateAddress(user.wallet_address)}
                                </p>
                              </div>
                            </div>
                            {user.reputation && (
                              <Badge variant="secondary" className="bg-primary/20 text-primary">
                                ⭐ {user.reputation.reputation_score}
                              </Badge>
                            )}
                          </div>

                          {/* Bio */}
                          {user.bio && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                              {user.bio}
                            </p>
                          )}

                          {/* Skills */}
                          {user.skills && user.skills.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-muted-foreground mb-2">Can teach:</p>
                              <div className="flex flex-wrap gap-1">
                                {user.skills.slice(0, 3).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-green-500/10 border-green-500/30 text-green-400">
                                    {skill.name}
                                  </Badge>
                                ))}
                                {user.skills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.skills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Wanted Skills */}
                          {user.wantedSkills && user.wantedSkills.length > 0 && (
                            <div>
                              <p className="text-xs text-muted-foreground mb-2">Wants to learn:</p>
                              <div className="flex flex-wrap gap-1">
                                {user.wantedSkills.slice(0, 3).map((skill, i) => (
                                  <Badge key={i} variant="outline" className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-400">
                                    {skill.name}
                                  </Badge>
                                ))}
                                {user.wantedSkills.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{user.wantedSkills.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Stats */}
                          {user.reputation && (
                            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-muted-foreground">
                              <span>{user.reputation.successful_sessions} successful sessions</span>
                              <span>{user.reputation.total_sessions} total</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Connect Wallet Prompt */}
            {!isConnected && (
              <div className="mt-12 text-center py-8 glass-card rounded-xl border border-white/10">
                <AlertCircle className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Connect your wallet to find matching users and start skill exchanges.
                </p>
                <WalletButton />
              </div>
            )}

            {/* No Skills Prompt */}
            {isConnected && !skillsLoading && !hasSkills && (
              <div className="mt-12 text-center py-8 glass-card rounded-xl border border-white/10">
                <Search className="h-10 w-10 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Set Up Your Skills</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Add skills you can teach and skills you want to learn to find perfect matches.
                </p>
                <Button asChild>
                  <Link to="/profile">Set Up Skills</Link>
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <ScryptoFooter />
    </div>
  );
}

export default FindMatchesPage;
