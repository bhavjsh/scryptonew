import { motion } from 'framer-motion';
import { Upload, Package, Palette, Calculator, ChevronRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const materials = [
  { id: 'pla', name: 'PLA', pricePerGram: 0.05 },
  { id: 'abs', name: 'ABS', pricePerGram: 0.06 },
  { id: 'petg', name: 'PETG', pricePerGram: 0.07 },
  { id: 'tpu', name: 'TPU (Flexible)', pricePerGram: 0.10 },
  { id: 'nylon', name: 'Nylon', pricePerGram: 0.12 },
  { id: 'resin', name: 'Resin (High Detail)', pricePerGram: 0.15 },
];

const colors = [
  { id: 'white', name: 'White', hex: '#ffffff' },
  { id: 'black', name: 'Black', hex: '#1a1a1a' },
  { id: 'red', name: 'Red', hex: '#ef4444' },
  { id: 'blue', name: 'Blue', hex: '#3b82f6' },
  { id: 'green', name: 'Green', hex: '#22c55e' },
  { id: 'yellow', name: 'Yellow', hex: '#eab308' },
  { id: 'cyan', name: 'Cyan', hex: '#00e5ff' },
  { id: 'magenta', name: 'Magenta', hex: '#ff00ff' },
];

export function OrdersSection() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [material, setMaterial] = useState('pla');
  const [color, setColor] = useState('cyan');
  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [estimatedWeight] = useState(50);

  const selectedMaterial = materials.find(m => m.id === material);
  const basePrice = (selectedMaterial?.pricePerGram || 0.05) * estimatedWeight;
  const totalPrice = basePrice * quantity;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!customerName || !customerEmail) {
      toast.error('Please fill in your name and email');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('custom_orders')
        .insert({
          customer_name: customerName,
          customer_email: customerEmail,
          material: selectedMaterial?.name || 'PLA',
          color: colors.find(c => c.id === color)?.name || 'Cyan',
          quantity,
          estimated_price: totalPrice,
          file_name: selectedFile?.name || null,
          status: 'pending',
        });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Order request submitted successfully!');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error('Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedFile(null);
    setMaterial('pla');
    setColor('cyan');
    setQuantity(1);
    setCustomerName('');
    setCustomerEmail('');
  };

  return (
    <section id="orders" className="py-24 relative bg-secondary/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Custom <span className="gradient-text-accent">3D Printing</span> Orders
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload your 3D model and get an instant quote. We support STL, OBJ, and other popular formats.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Order Form */}
          <motion.div
            className="bg-card rounded-2xl p-8 border border-border card-glow"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display font-bold text-2xl mb-4">Request Submitted!</h3>
                <p className="text-muted-foreground mb-6">
                  We'll review your order and send you a detailed quote within 24 hours.
                </p>
                <Button onClick={resetForm} variant="outline">
                  Submit Another Order
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* File Upload */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Upload 3D Model
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                      ${selectedFile ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <input
                      id="file-upload"
                      type="file"
                      accept=".stl,.obj,.3mf,.step,.stp"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Upload className={`w-12 h-12 mx-auto mb-4 ${selectedFile ? 'text-primary' : 'text-muted-foreground'}`} />
                    {selectedFile ? (
                      <div>
                        <p className="font-semibold text-primary">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-semibold">Drop your file here or click to upload</p>
                        <p className="text-sm text-muted-foreground mt-1">STL, OBJ, 3MF, STEP supported</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Material Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    <Package className="w-4 h-4 inline mr-2" />
                    Material
                  </Label>
                  <Select value={material} onValueChange={setMaterial}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((mat) => (
                        <SelectItem key={mat.id} value={mat.id}>
                          {mat.name} (${mat.pricePerGram}/g)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Color Selection */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    <Palette className="w-4 h-4 inline mr-2" />
                    Color
                  </Label>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setColor(c.id)}
                        className={`aspect-square rounded-lg border-2 transition-all ${
                          color === c.id 
                            ? 'border-primary scale-110 ring-2 ring-primary/50' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Quantity
                  </Label>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20 text-center"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="mb-2 block">Name *</Label>
                    <Input 
                      placeholder="Your name" 
                      className="bg-background" 
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label className="mb-2 block">Email *</Label>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-background"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  ) : (
                    <>
                      Submit Order Request
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>

          {/* Price Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="font-display font-bold text-2xl mb-6 flex items-center gap-2">
                <Calculator className="w-6 h-6 text-primary" />
                Price Estimate
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Material</span>
                  <span className="font-semibold">{selectedMaterial?.name}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Est. Weight</span>
                  <span className="font-semibold">{estimatedWeight}g</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Price per Unit</span>
                  <span className="font-semibold">${basePrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-3 border-b border-border">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="font-semibold">x{quantity}</span>
                </div>
                <div className="flex justify-between py-4 text-xl">
                  <span className="font-display font-bold">Total</span>
                  <span className="font-display font-bold gradient-text">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mt-4">
                * Final price may vary based on actual model dimensions and complexity. 
                We'll confirm the exact price after reviewing your model.
              </p>
            </div>

            {/* Process Steps */}
            <div className="bg-card rounded-2xl p-8 border border-border">
              <h3 className="font-display font-bold text-xl mb-6">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: '1', title: 'Upload Model', desc: 'Upload your 3D file in STL, OBJ, or other formats' },
                  { step: '2', title: 'Choose Options', desc: 'Select material, color, and quantity' },
                  { step: '3', title: 'Get Quote', desc: "We'll review and confirm final pricing" },
                  { step: '4', title: 'Print & Ship', desc: 'Your order is printed and delivered' },
                ].map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
