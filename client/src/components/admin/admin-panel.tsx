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
import { Palette, Users, Settings, FileText, Plus, Pencil, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


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

const contentSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  price: z.string().optional(),
  imageUrl: z.string().url().optional(),
  version: z.string().optional(),
  downloadUrl: z.string().url().optional(),
});

type ThemeSettings = z.infer<typeof themeSchema>;
type SiteSettings = z.infer<typeof siteSettingsSchema>;
type ContentFormData = z.infer<typeof contentSchema>;

export function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("theme");
  const [editingItem, setEditingItem] = useState<ContentFormData | null>(null);

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

  const contentForm = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      imageUrl: "",
      version: "",
      downloadUrl: "",
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

  const onContentSubmit = (data: ContentFormData) => {
    toast({
      title: "Content updated",
      description: "The content has been updated successfully.",
    });
    console.log("Content data:", data);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
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
            <TabsList className="grid grid-cols-4 gap-4 mb-8">
              <TabsTrigger value="theme" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
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
                    <Palette className="mr-2 h-4 w-4" />
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

            <TabsContent value="content">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Products & Downloads</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Add New Content</DialogTitle>
                      </DialogHeader>
                      <Form {...contentForm}>
                        <form onSubmit={contentForm.handleSubmit(onContentSubmit)} className="space-y-4">
                          <FormField
                            control={contentForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                  <Input {...field} className="hover:glow-primary focus:glow-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={contentForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea {...field} className="hover:glow-primary focus:glow-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={contentForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                  <div className="flex gap-2">
                                    <Input {...field} className="hover:glow-primary focus:glow-primary" />
                                    <Button variant="outline" size="icon">
                                      <ImageIcon className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-4">
                            <FormField
                              control={contentForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Price</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="hover:glow-primary focus:glow-primary" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={contentForm.control}
                              name="version"
                              render={({ field }) => (
                                <FormItem className="flex-1">
                                  <FormLabel>Version</FormLabel>
                                  <FormControl>
                                    <Input {...field} className="hover:glow-primary focus:glow-primary" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={contentForm.control}
                            name="downloadUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Download URL</FormLabel>
                                <FormControl>
                                  <Input {...field} className="hover:glow-primary focus:glow-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button type="submit" className="w-full animate-glow-primary">Save Content</Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-lg transition-shadow hover:glow-primary">
                    <CardHeader>
                      <div className="flex justify-between">
                        <CardTitle>Basic Package</CardTitle>
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                      <CardDescription>Essential features for small teams</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold mb-2">$9.99/mo</p>
                      <p className="text-sm text-muted-foreground">Version: 1.0.0</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
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