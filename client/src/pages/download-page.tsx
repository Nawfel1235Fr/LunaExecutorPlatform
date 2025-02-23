import { Navbar } from "@/components/layout/navbar";
import { ChatWidget } from "@/components/chat/chat-widget";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Download, Monitor, Apple, Terminal } from "lucide-react";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Download LunaExecutor</h1>

          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {downloads.map((download, index) => (
                <motion.div
                  key={download.platform}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-lg border bg-card"
                >
                  <download.icon className="h-12 w-12 mb-4 text-blue-500" />
                  <h2 className="text-xl font-semibold mb-2">
                    {download.platform}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {download.version}
                  </p>
                  <Button className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </motion.div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Requirements</h2>
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

const downloads = [
  {
    platform: "Windows",
    version: "v1.0.0",
    icon: Monitor,
  },
  {
    platform: "macOS",
    version: "v1.0.0",
    icon: Apple,
  },
  {
    platform: "Linux",
    version: "v1.0.0",
    icon: Terminal,
  },
];

const requirements = [
  {
    platform: "Windows",
    specs: [
      "Windows 10 or later",
      "4GB RAM minimum",
      "2GB free disk space",
      "Intel Core i3 or equivalent",
    ],
  },
  {
    platform: "macOS",
    specs: [
      "macOS 11 or later",
      "4GB RAM minimum",
      "2GB free disk space",
      "Apple M1 or Intel processor",
    ],
  },
  {
    platform: "Linux",
    specs: [
      "Ubuntu 20.04 or equivalent",
      "4GB RAM minimum",
      "2GB free disk space",
      "Intel Core i3 or equivalent",
    ],
  },
];