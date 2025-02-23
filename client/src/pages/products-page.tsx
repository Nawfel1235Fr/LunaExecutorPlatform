import { Navbar } from "@/components/layout/navbar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Products</h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={product.badge.variant}>
                        {product.badge.text}
                      </Badge>
                    </div>
                    <CardTitle>{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-2xl font-bold mb-4">{product.price}</p>
                    <ul className="space-y-2 mb-6 flex-1">
                      {product.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckIcon className="h-5 w-5 text-green-500 mr-2" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={product.button.variant}>
                      {product.button.text}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <ChatWidget />
    </div>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

const products = [
  {
    name: "Basic",
    price: "$9.99/mo",
    badge: { text: "Popular", variant: "secondary" as const },
    button: { text: "Get Started", variant: "outline" as const },
    features: [
      "Basic execution features",
      "5 concurrent tasks",
      "Community support",
      "1GB storage",
    ],
  },
  {
    name: "Pro",
    price: "$29.99/mo",
    badge: { text: "Recommended", variant: "default" as const },
    button: { text: "Get Pro", variant: "default" as const },
    features: [
      "Advanced execution features",
      "Unlimited concurrent tasks",
      "Priority support",
      "10GB storage",
      "Custom integrations",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    badge: { text: "Enterprise", variant: "secondary" as const },
    button: { text: "Contact Sales", variant: "outline" as const },
    features: [
      "All Pro features",
      "Dedicated support",
      "Custom solutions",
      "Unlimited storage",
      "SLA guarantee",
    ],
  },
];
