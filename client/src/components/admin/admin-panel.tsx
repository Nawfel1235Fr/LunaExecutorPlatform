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
import { Palette, Users, Settings, FileText, Plus, Pencil, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Product, insertProductSchema } from "@shared/schema";

type ContentFormData = z.infer<typeof insertProductSchema>;

export function AdminPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("content");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: ContentFormData) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, price: String(data.price) }),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product created successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, price: String(data.price) }),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ContentFormData>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      features: [],
      badge: "",
      badgeVariant: "",
      buttonText: "Télécharger",
      buttonVariant: "bg-blue-500 hover:bg-blue-600",
      version: "",
      downloadUrl: "",
    },
  });

  const onSubmit = (data: ContentFormData) => {
    if (editingProduct) {
      updateProductMutation.mutate({
        id: editingProduct.id,
        data: {
          ...data,
          features: data.features.filter(Boolean),
        },
      });
    } else {
      createProductMutation.mutate({
        ...data,
        features: data.features.filter(Boolean),
      });
    }
    form.reset();
    setEditingProduct(null);
  };

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

  const themeForm = useForm<z.infer<typeof themeSchema>>({
    resolver: zodResolver(themeSchema),
    defaultValues: {
      primaryColor: "#3b82f6",
      fontFamily: "Inter",
      borderRadius: "0.5rem",
    },
  });

  const siteSettingsForm = useForm<z.infer<typeof siteSettingsSchema>>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      siteName: "LunaExecutor",
      description: "Your gateway to seamless execution and powerful tools",
      contactEmail: "support@lunaexecutor.com",
    },
  });

  const onThemeSubmit = (data: z.infer<typeof themeSchema>) => {
    toast({
      title: "Theme updated",
      description: "The site theme has been updated successfully.",
    });
  };

  const onSiteSettingsSubmit = (data: z.infer<typeof siteSettingsSchema>) => {
    toast({
      title: "Settings updated",
      description: "The site settings have been updated successfully.",
    });
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
            Manage your site's content and settings
          </CardDescription>
        </CardHeader>
        <CardContent className="max-h-[70vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <Button variant="outline" onClick={() => window.location.href = '/'}>
              Retour à l'accueil
            </Button>
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 gap-4 mb-8">
              <TabsTrigger value="content" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Content
              </TabsTrigger>
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

            <TabsContent value="content">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Products & Downloads</h3>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="animate-glow-primary">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? "Edit Product" : "Add New Product"}
                        </DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nom</FormLabel>
                                <FormControl>
                                  <Input {...field} className="hover:glow-primary focus:glow-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
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
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Prix</FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      type="number"
                                      step="0.01"
                                      className="hover:glow-primary focus:glow-primary"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="version"
                              render={({ field }) => (
                                <FormItem>
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
                            control={form.control}
                            name="downloadUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL de téléchargement</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" className="hover:glow-primary focus:glow-primary" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="badge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Badge</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="ex: Nouveau" className="hover:glow-primary focus:glow-primary" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="badgeVariant"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Style du badge</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="ex: bg-green-500 text-white" className="hover:glow-primary focus:glow-primary" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="buttonText"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Texte du bouton</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="ex: Télécharger" className="hover:glow-primary focus:glow-primary" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="buttonVariant"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Style du bouton</FormLabel>
                                  <FormControl>
                                    <Input {...field} placeholder="ex: bg-blue-500 hover:bg-blue-600" className="hover:glow-primary focus:glow-primary" />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="features"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Fonctionnalités (une par ligne)</FormLabel>
                                <FormControl>
                                  <Textarea
                                    {...field}
                                    value={field.value?.join("\n")}
                                    onChange={(e) =>
                                      field.onChange(e.target.value.split("\n"))
                                    }
                                    className="hover:glow-primary focus:glow-primary"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="w-full animate-glow-primary"
                            disabled={
                              createProductMutation.isPending ||
                              updateProductMutation.isPending
                            }
                          >
                            {editingProduct ? "Mettre à jour le produit" : "Ajouter le produit"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow hover:glow-primary">
                        <CardHeader>
                          <div className="flex justify-between">
                            <CardTitle>{product.name}</CardTitle>
                            <div className="space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingProduct(product);
                                  form.reset({
                                    name: product.name,
                                    description: product.description,
                                    price: Number(product.price),
                                    features: product.features || [],
                                    badge: product.badge || "",
                                    badgeVariant: product.badgeVariant || "",
                                    buttonText: product.buttonText || "Télécharger",
                                    buttonVariant: product.buttonVariant || "bg-blue-500 hover:bg-blue-600",
                                    version: product.version || "",
                                    downloadUrl: product.downloadUrl || "",

                                  });
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  if (confirm("Are you sure you want to delete this product?")) {
                                    deleteProductMutation.mutate(product.id);
                                  }
                                }}
                                className="text-red-500 hover:text-red-600"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <path d="M3 6h18" />
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                </svg>
                              </Button>
                            </div>
                          </div>
                          <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-2xl font-bold mb-2">${product.price}</p>
                          <div className="space-y-2">
                            {product.features?.map((feature, index) => (
                              <div key={index} className="flex items-center">
                                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                <span>{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

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