import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { SkillSwapNavbar } from '@/components/layout/SkillSwapNavbar';
import { useWeb3 } from '@/contexts/Web3Context';
import { createSkillOffer } from '@/lib/contract';

const offerSchema = z.object({
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Price must be a positive number',
    }),
});

type OfferFormData = z.infer<typeof offerSchema>;

export function CreateOffer() {
  const navigate = useNavigate();
  const { signer, isConnected, account, formatAddress } = useWeb3();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      title: '',
      description: '',
      price: '',
    },
  });

  const onSubmit = async (data: OfferFormData) => {
    if (!isConnected || !signer) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading('Waiting for MetaMask confirmation...');

    try {
      const tx = await createSkillOffer(signer, data.title, data.description, data.price);
      toast.loading('Transaction submitted. Waiting for confirmation...', { id: toastId });
      
      const receipt = await tx.wait();
      
      if (receipt?.status === 1) {
        toast.success('Skill offer created successfully!', {
          id: toastId,
          description: `TX: ${tx.hash.slice(0, 10)}...${tx.hash.slice(-8)}`,
          action: {
            label: 'View',
            onClick: () => window.open(`https://testnet.monadexplorer.com/tx/${tx.hash}`, '_blank'),
          },
        });
        navigate('/marketplace');
      } else {
        toast.error('Transaction failed', { id: toastId });
      }
    } catch (error: any) {
      console.error('Create offer error:', error);
      if (error.code === 4001) {
        toast.error('Transaction rejected by user', { id: toastId });
      } else {
        toast.error(error.message || 'Failed to create offer', { id: toastId });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SkillSwapNavbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="card-glow bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="font-display text-2xl">
                    Create Skill Offer
                  </CardTitle>
                </div>
                <CardDescription>
                  List your skill on the marketplace. Set your price in ETH and wait for someone to accept.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      Please connect your wallet to create an offer
                    </p>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Connected Wallet Info */}
                      <div className="p-3 rounded-lg bg-muted/50 border border-border/50">
                        <p className="text-sm text-muted-foreground">
                          Creating as: <span className="text-foreground font-mono">{formatAddress(account!)}</span>
                        </p>
                      </div>

                      {/* Title */}
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skill Title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Smart Contract Development"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              A clear, concise title for your skill
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Description */}
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Describe what you'll deliver, your experience, and any requirements..."
                                className="min-h-32 resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Be specific about deliverables and timeline
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Price */}
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (ETH)</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.001"
                                  min="0"
                                  placeholder="0.5"
                                  {...field}
                                />
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                  ETH
                                </span>
                              </div>
                            </FormControl>
                            <FormDescription>
                              Set your price in Ether. This will be held in escrow.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Submit Button */}
                      <Button
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Creating Offer...
                          </>
                        ) : (
                          'Create Offer'
                        )}
                      </Button>

                      {/* Info Notice */}
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <p className="text-xs text-muted-foreground text-center">
                          Your offer will be listed on the marketplace once created.
                        </p>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default CreateOffer;
