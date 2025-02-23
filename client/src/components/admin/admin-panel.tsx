import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Palette, Users, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const themeSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i, {
    message: "Must be a valid hex color",
  }),
  fontFamily: z.string().min(1),
  borderRadius: z.string(),
});

const siteSettingsSchema = z.object({
  siteName: z.string().min(1),
  description: z.string(),
  contactEmail: z.string().email(),
});

type ThemeSettings = z.infer<typeof themeSchema>;
type SiteSettings = z.infer<typeof siteSettingsSchema>;

export function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("theme");

  const themeForm = useForm<ThemeSettings>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      fontFamily: "Inter",
      borderRadius: "0.5rem",
    },
  });

  const siteSettingsForm = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "LunaExecutor",
      description: "Your gateway to seamless execution and powerful tools",
      contactEmail: "support@lunaexecutor.com",
    },
  });

  const onThemeSubmit = (data: ThemeSettings) => {
    toast({
      title: "Theme updated",
      description: "The site theme has been updated successfully.",
    });
    console.log("Theme settings:", data);
  };

  const onSiteSettingsSubmit = (data: SiteSettings) => {
    toast({
      title: "Settings updated",
      description: "The site settings have been updated successfully.",
    });
    console.log("Site settings:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Admin Panel</CardTitle>
          <CardDescription>
            Manage your site's appearance and settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 gap-4 mb-8">
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            <TabsContent value="theme">
              <Form {...themeForm}>
                <form
                  onSubmit={themeForm.handleSubmit(onThemeSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={themeForm.control}
                    name="primaryColor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Color</FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input {...field} type="color" className="w-20" />
                            <Input {...field} placeholder="#3b82f6" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={themeForm.control}
                    name="fontFamily"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Font Family</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a font" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={themeForm.control}
                    name="borderRadius"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Border Radius</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select border radius" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="0.25rem">Small</SelectItem>
                            <SelectItem value="0.5rem">Medium</SelectItem>
                            <SelectItem value="1rem">Large</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    <Paintbrush className="mr-2 h-4 w-4" />
                    Update Theme
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="settings">
              <Form {...siteSettingsForm}>
                <form
                  onSubmit={siteSettingsForm.handleSubmit(onSiteSettingsSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={siteSettingsForm.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={siteSettingsForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={siteSettingsForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="users">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Registered Users</h3>
                  <Button variant="outline">
                    <Users className="mr-2 h-4 w-4" />
                    Export Users
                  </Button>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-muted-foreground text-sm">
                    User management features will be implemented in a future update.
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}