import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Eye, QrCode, Sparkles, Heart, Camera, Share2 } from 'lucide-react';
import { MemorialForm } from '@/components/memorial/MemorialForm';
import { MemorialCard, MemorialData } from '@/components/memorial/MemorialCard';

const Index = () => {
  const [showForm, setShowForm] = useState(false);
  const [sampleMemorial] = useState<MemorialData>({
    id: 'sample',
    name: 'Naomi N.',
    birthDate: '1945-03-15',
    deathDate: '2024-01-10',
    photo: '/lovable-uploads/97f52ec1-ca70-49d3-9242-069944655158.png',
    memoryText: 'A beautiful soul who brought joy and warmth to everyone she met. Her legacy of love and compassion will live on forever in our hearts.',
    cardType: 'female'
  });

  const handleCreateMemorial = (data: Partial<MemorialData>) => {
    console.log('Creating memorial:', data);
    // Here you would typically save to your backend
    setShowForm(false);
    // For now, just show a success message
    alert('Memorial card created successfully!');
  };

  const features = [
    {
      icon: <Camera className="w-8 h-8 text-primary" />,
      title: "AR Hologram",
      description: "Experience loved ones in 3D holographic form with AR technology"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary" />,
      title: "AI Memory Assistant",
      description: "Get AI-powered suggestions for beautiful memorial messages"
    },
    {
      icon: <QrCode className="w-8 h-8 text-primary" />,
      title: "QR Code Access",
      description: "Easy scanning for instant access to digital memorials"
    },
    {
      icon: <Heart className="w-8 h-8 text-primary" />,
      title: "Heavenly Gates",
      description: "Beautiful spiritual gates with heavenly light effects"
    },
    {
      icon: <Share2 className="w-8 h-8 text-primary" />,
      title: "NFC & GPS",
      description: "Location tagging and NFC chip integration for physical memorials"
    }
  ];

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-ethereal">
        <MemorialForm 
          onSubmit={handleCreateMemorial}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-ethereal">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, hsl(var(--primary)) 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-primary mb-6 tracking-tight">
              Gate of Memory
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Create beautiful digital memorials with AR holograms, AI-powered memories, 
              and heavenly spiritual experiences for your loved ones.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-heavenly text-lg px-8 py-4"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Memorial
              </Button>
              
              <Link to="/memorial/naomi-n">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4"
                >
                  <Eye className="w-5 h-5 mr-2" />
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Sample Memorial Card */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Experience Digital Memorials
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how our memorial cards bring memories to life with AR technology and spiritual beauty
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex justify-center"
          >
            <MemorialCard memorial={sampleMemorial} showAR={false} />
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              Heavenly Features
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                >
                  <Card className="p-6 text-center h-full border-primary/20 bg-card/50 backdrop-blur hover:shadow-soft transition-all duration-300">
                    <div className="flex justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Card className="max-w-2xl mx-auto p-8 bg-gradient-memorial border-primary/30 shadow-heavenly">
              <h2 className="text-3xl font-bold text-primary mb-4">
                Honor Their Memory
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Create a lasting digital tribute that celebrates life, preserves memories, 
                and provides comfort through beautiful spiritual experiences.
              </p>
              <Button 
                size="lg"
                onClick={() => setShowForm(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-4"
              >
                Start Creating
              </Button>
            </Card>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default Index;
