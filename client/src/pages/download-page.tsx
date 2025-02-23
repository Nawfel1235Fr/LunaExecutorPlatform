import { Navbar } from "@/components/layout/navbar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function DownloadPage() {
  const { toast } = useToast();
  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const handleDownload = (product: Product) => {
    if (!product.downloadUrl) {
      toast({
        title: "Téléchargement non disponible",
        description: "Le lien de téléchargement n'est pas encore disponible pour ce produit.",
        variant: "destructive",
      });
      return;
    }

    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a');
    link.href = product.downloadUrl;
    link.download = `${product.name}-${product.version}.exe`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Téléchargement démarré",
      description: `${product.name} va commencer à se télécharger.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Télécharger LunaExecutor</h1>

          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow hover:glow-primary"
                >
                  {product.badge && (
                    <span className={`px-2 py-1 rounded text-xs mb-4 ${product.badgeVariant || 'bg-blue-500 text-white'}`}>
                      {product.badge}
                    </span>
                  )}
                  <h2 className="text-xl font-semibold mb-2">
                    {product.name}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    Version {product.version}
                  </p>
                  <div className="flex-grow space-y-2 mb-4">
                    {product.features?.map((feature, i) => (
                      <p key={i} className="text-sm">• {feature}</p>
                    ))}
                  </div>
                  <Button 
                    className={`w-full ${product.buttonVariant || 'bg-blue-500 hover:bg-blue-600'}`}
                    onClick={() => handleDownload(product)}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {product.buttonText || 'Télécharger'}
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Configuration Requise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {requirements.map((req, index) => (
                <motion.div
                  key={req.platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <h3 className="font-medium mb-2">{req.platform}</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {req.specs.map((spec, i) => (
                      <li key={i}>{spec}</li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </main>

      <ChatWidget />
    </div>
  );
}

const requirements = [
  {
    platform: "Windows",
    specs: [
      "Windows 10 ou plus récent",
      "4GB RAM minimum",
      "2GB d'espace disque libre",
      "Intel Core i3 ou équivalent",
    ],
  },
  {
    platform: "macOS",
    specs: [
      "macOS 11 ou plus récent",
      "4GB RAM minimum",
      "2GB d'espace disque libre",
      "Apple M1 ou processeur Intel",
    ],
  },
  {
    platform: "Linux",
    specs: [
      "Ubuntu 20.04 ou équivalent",
      "4GB RAM minimum",
      "2GB d'espace disque libre",
      "Intel Core i3 ou équivalent",
    ],
  },
];