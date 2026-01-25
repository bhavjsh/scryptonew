/**
 * ProfilePage Component
 * 
 * Allows users to view and edit their profile including:
 * - Full Name (editable)
 * - Wallet Address (read-only, from wallet)
 * - Skills they know (editable via skill selectors)
 * - Skills they want to learn (editable via skill selectors)
 * - Short bio (editable)
 * 
 * All data is persisted to the database and linked to wallet address.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Wallet, 
  Edit3, 
  Save, 
  X, 
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScryptoNavbar } from '@/components/layout/ScryptoNavbar';
import { ScryptoFooter } from '@/components/layout/ScryptoFooter';
import { WalletButton } from '@/components/wallet/WalletButton';
import { useWeb3 } from '@/contexts/Web3Context';
import { useProfile } from '@/hooks/useProfile';
import { useSkills } from '@/hooks/useSkills';

export function ProfilePage() {
  const navigate = useNavigate();
  const { isConnected, account, formatAddress } = useWeb3();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { 
    userSkills, 
    wantedSkills, 
    loading: skillsLoading,
  } = useSkills();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  // Sync form state with profile data when loaded
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
    }
  }, [profile]);

  // Handle profile save
  const handleSave = async () => {
    setSaving(true);
    const { error } = await updateProfile({
      full_name: fullName.trim() || null,
      bio: bio.trim() || null
    });

    if (error) {
      toast.error('Failed to save profile', { description: error });
    } else {
      toast.success('Profile saved successfully');
      setIsEditing(false);
    }
    setSaving(false);
  };

  // Handle cancel editing
  const handleCancel = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setBio(profile.bio || '');
    }
    setIsEditing(false);
  };

  // Check if user has completed skill setup (required for matching)
  const hasSkillsSetup = userSkills.length > 0 && wantedSkills.length > 0;

  const loading = profileLoading || skillsLoading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <ScryptoNavbar />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Profile</h1>
              <p className="text-muted-foreground">
                Manage your identity and skills for exchanges
              </p>
            </div>
            {isConnected && !isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Not connected state */}
          {!isConnected && (
            <Card className="border-border bg-card/50">
              <CardContent className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">
                  Connect your wallet to create and manage your Scrypto profile.
                </p>
                <WalletButton />
              </CardContent>
            </Card>
          )}

          {/* Loading state */}
          {isConnected && loading && (
            <Card className="border-border bg-card/50">
              <CardContent className="p-8 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                <p className="text-muted-foreground">Loading your profile...</p>
              </CardContent>
            </Card>
          )}

          {/* Profile content */}
          {isConnected && !loading && (
            <div className="space-y-6">
              {/* Basic Info Card */}
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Your identity linked to your wallet address
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Wallet Address (read-only) */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Wallet Address
                    </label>
                    <div className="flex items-center gap-2 p-3 rounded-md bg-muted/50 border border-border">
                      <Wallet className="h-4 w-4 text-muted-foreground" />
                      <code className="text-sm font-mono">
                        {account ? formatAddress(account) : 'Not connected'}
                      </code>
                      <Badge variant="outline" className="ml-auto text-xs">
                        Read-only
                      </Badge>
                    </div>
                  </div>

                  {/* Full Name */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Display Name
                    </label>
                    {isEditing ? (
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Enter your display name"
                        className="bg-background"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-muted/50 border border-border">
                        {profile?.full_name || (
                          <span className="text-muted-foreground italic">Not set</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-sm font-medium text-muted-foreground mb-1 block">
                      Bio
                    </label>
                    {isEditing ? (
                      <Textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell others about yourself and your expertise..."
                        className="bg-background min-h-[100px]"
                      />
                    ) : (
                      <div className="p-3 rounded-md bg-muted/50 border border-border min-h-[80px]">
                        {profile?.bio || (
                          <span className="text-muted-foreground italic">No bio yet</span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Save/Cancel buttons when editing */}
                  {isEditing && (
                    <div className="flex gap-2 pt-2">
                      <Button onClick={handleSave} disabled={saving}>
                        {saving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                      <Button variant="outline" onClick={handleCancel} disabled={saving}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Skills Summary Card */}
              <Card className="border-border bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    My Skills
                  </CardTitle>
                  <CardDescription>
                    Skills you can teach and want to learn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Skills I Can Teach</p>
                    <div className="flex flex-wrap gap-2">
                      {userSkills.length > 0 ? userSkills.map(s => (
                        <Badge key={s.id} variant="secondary">
                          {s.skill?.name}
                        </Badge>
                      )) : (
                        <span className="text-sm text-muted-foreground italic">No skills set</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Skills I Want to Learn</p>
                    <div className="flex flex-wrap gap-2">
                      {wantedSkills.length > 0 ? wantedSkills.map(s => (
                        <Badge key={s.id} variant="outline">
                          {s.skill?.name}
                        </Badge>
                      )) : (
                        <span className="text-sm text-muted-foreground italic">No learning goals set</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => navigate('/skills')}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Manage Skills
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Navigation to Find Matches */}
              <Card className={`border-border ${hasSkillsSetup ? 'bg-primary/10 border-primary/30' : 'bg-card/50'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {hasSkillsSetup ? 'Ready to Find Matches!' : 'Complete Your Skills Setup'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {hasSkillsSetup 
                          ? 'Your skills are saved. Find users with complementary skills to exchange.'
                          : 'Add at least one skill you can teach and one you want to learn to find matches.'
                        }
                      </p>
                    </div>
                    <Button
                      disabled={!hasSkillsSetup}
                      onClick={() => navigate('/matches')}
                    >
                      Find Matches
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>

      <ScryptoFooter />
    </div>
  );
}

export default ProfilePage;
