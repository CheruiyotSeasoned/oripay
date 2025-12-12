'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, addDoc } from "firebase/firestore";

// Types
interface Feature { id: string; title: string; description?: string; icon?: string }
interface Service { id: string; name: string; description: string; features: Feature[]; icon: string; active: boolean }
interface Announcement { id: string; title: string; content: string; active: boolean }
interface Region { id: string; name: string; flag: string }
interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroCTA: string;
  features: Feature[];
  regions: Region[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export default function ContentManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [homepage, setHomepage] = useState<HomepageContent>({
    heroTitle: "",
    heroSubtitle: "",
    heroCTA: "",
    features: [],
    regions: [],
    ctaTitle: "",
    ctaSubtitle: "",
    ctaButton: ""
  });
  const [loading, setLoading] = useState(true);

  // Service dialog state
  const [newService, setNewService] = useState<Service>({ id: "", name: "", description: "", features: [], icon: "", active: true });
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Announcement dialog state
  const [newAnnouncement, setNewAnnouncement] = useState<Announcement>({ id: "", title: "", content: "", active: true });
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Services
        const servicesSnap = await getDocs(collection(db, "services"));
        setServices(servicesSnap.docs.map(doc => {
          const data = doc.data() as Service;
          return { id: doc.id, ...data, features: data.features || [] };
        }));

        // Announcements
        const annSnap = await getDocs(collection(db, "announcements"));
        setAnnouncements(annSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement)));

        // Homepage
        const homepageRef = doc(db, "homepageContent", "main");
        const homepageSnap = await getDoc(homepageRef);
        if (homepageSnap.exists()) {
          const data = homepageSnap.data() as HomepageContent;
          setHomepage({
            heroTitle: data.heroTitle || "",
            heroSubtitle: data.heroSubtitle || "",
            heroCTA: data.heroCTA || "",
            features: data.features || [],
            regions: data.regions || [],
            ctaTitle: data.ctaTitle || "",
            ctaSubtitle: data.ctaSubtitle || "",
            ctaButton: data.ctaButton || ""
          });
        }

      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <p className="text-center py-8">Loading...</p>;

  // ---------------- Services ----------------
  const addService = async () => {
    if (!newService.name || !newService.description) return toast.error("Name & description required");
    const docRef = await addDoc(collection(db, "services"), newService);
    setServices([...services, { ...newService, id: docRef.id }]);
    setNewService({ id: "", name: "", description: "", features: [], icon: "", active: true });
    toast.success("Service added");
  };

  const updateService = async (service: Service) => {
    const { id, ...data } = service;
    await updateDoc(doc(db, "services", id), data);
    setServices(services.map(s => s.id === id ? service : s));
    toast.success("Service updated");
    setEditingService(null);
  };

  const deleteService = async (id: string) => {
    await deleteDoc(doc(db, "services", id));
    setServices(services.filter(s => s.id !== id));
    toast.success("Service deleted");
  };

  const addFeature = (serviceId: string) => {
    setServices(services.map(s => s.id === serviceId
      ? { ...s, features: [...(s.features || []), { id: crypto.randomUUID(), title: "" }] }
      : s
    ));
  };

  const updateFeature = (serviceId: string, featureId: string, title: string) => {
    setServices(services.map(s => s.id === serviceId
      ? { ...s, features: s.features.map(f => f.id === featureId ? { ...f, title } : f) }
      : s
    ));
  };

  const deleteFeature = (serviceId: string, featureId: string) => {
    setServices(services.map(s => s.id === serviceId
      ? { ...s, features: s.features.filter(f => f.id !== featureId) }
      : s
    ));
  };

  // ---------------- Announcements ----------------
  const addAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.content) return toast.error("Title & content required");
    const docRef = await addDoc(collection(db, "announcements"), newAnnouncement);
    setAnnouncements([...announcements, { ...newAnnouncement, id: docRef.id }]);
    setNewAnnouncement({ id: "", title: "", content: "", active: true });
    toast.success("Announcement added");
  };

  const updateAnnouncement = async (announcement: Announcement) => {
    const { id, ...data } = announcement;
    await updateDoc(doc(db, "announcements", id), data);
    setAnnouncements(announcements.map(a => a.id === id ? announcement : a));
    toast.success("Announcement updated");
    setEditingAnnouncement(null);
  };

  const deleteAnnouncement = async (id: string) => {
    await deleteDoc(doc(db, "announcements", id));
    setAnnouncements(announcements.filter(a => a.id !== id));
    toast.success("Announcement deleted");
  };

  // ---------------- Homepage ----------------
  const saveHomepage = async () => {
    const homepageRef = doc(db, "homepageContent", "main");
    await setDoc(homepageRef, homepage);
    toast.success("Homepage updated");
  };

  const addHomepageFeature = () => {
    setHomepage({ ...homepage, features: [...homepage.features, { id: crypto.randomUUID(), title: "", description: "", icon: "" }] });
  };
  const updateHomepageFeature = (id: string, key: "title" | "description" | "icon", value: string) => {
    setHomepage({ ...homepage, features: homepage.features.map(f => f.id === id ? { ...f, [key]: value } : f) });
  };
  const deleteHomepageFeature = (id: string) => {
    setHomepage({ ...homepage, features: homepage.features.filter(f => f.id !== id) });
  };

  const addRegion = () => {
    setHomepage({ ...homepage, regions: [...homepage.regions, { id: crypto.randomUUID(), name: "", flag: "" }] });
  };
  const updateRegion = (id: string, key: "name" | "flag", value: string) => {
    setHomepage({ ...homepage, regions: homepage.regions.map(r => r.id === id ? { ...r, [key]: value } : r) });
  };
  const deleteRegion = (id: string) => {
    setHomepage({ ...homepage, regions: homepage.regions.filter(r => r.id !== id) });
  };

  return (
    <div className="space-y-8 p-6">
      <h1 className="text-3xl font-bold">Content Management</h1>
      <p className="text-muted-foreground">Manage services, announcements, and homepage content</p>

      <Tabs defaultValue="services" className="space-y-6">
        <TabsList>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Services</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4" /> Add Service</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto space-y-4">
                  <DialogHeader><DialogTitle>Add Service</DialogTitle></DialogHeader>
                  <Label>Name</Label>
                  <Input value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
                  <Label>Description</Label>
                  <Textarea value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
                  <Label>Icon</Label>
                  <Input value={newService.icon} onChange={e => setNewService({ ...newService, icon: e.target.value })} />
                  <h3 className="font-bold mt-2">Features</h3>
                  {(newService.features || []).map(f => (
                    <div key={f.id} className="flex gap-2 mb-2">
                      <Input placeholder="Feature title" value={f.title}
                        onChange={e => setNewService({ ...newService, features: (newService.features || []).map(fe => fe.id === f.id ? { ...fe, title: e.target.value } : fe) })} />
                      <Button variant="destructive" onClick={() => setNewService({ ...newService, features: (newService.features || []).filter(fe => fe.id !== f.id) })}>Delete</Button>
                    </div>
                  ))}
                  <Button onClick={() => setNewService({ ...newService, features: [...(newService.features || []), { id: crypto.randomUUID(), title: "" }] })} className="mb-2"><Plus className="h-4 w-4" /> Add Feature</Button>
                  <Button onClick={addService} className="w-full mt-2">Save Service</Button>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Icon</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(services || []).map(s => (
                    <TableRow key={s.id}>
                      <TableCell>{s.name}</TableCell>
                      <TableCell>{s.description}</TableCell>
                      <TableCell>
                        <ul className="space-y-1">{(s.features || []).map(f => <li key={f.id}>• {f.title}</li>)}</ul>
                      </TableCell>
                      <TableCell>{s.icon}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingService(s)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteService(s.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements">
          <Card>
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Announcements</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2"><Plus className="h-4 w-4" /> Add Announcement</Button>
                </DialogTrigger>
                <DialogContent className="max-h-[80vh] overflow-y-auto space-y-4">
                  <DialogHeader><DialogTitle>Add Announcement</DialogTitle></DialogHeader>
                  <Label>Title</Label>
                  <Input value={newAnnouncement.title} onChange={e => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })} />
                  <Label>Content</Label>
                  <Textarea value={newAnnouncement.content} onChange={e => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })} />
                  <Button onClick={addAnnouncement} className="w-full mt-2">Save Announcement</Button>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(announcements || []).map(a => ( // optional chaining
                    <TableRow key={a.id}>
                      <TableCell>{a.title}</TableCell>
                      <TableCell>{a.content}</TableCell>
                      <TableCell>{a.active ? "Active" : "Inactive"}</TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setEditingAnnouncement(a)}><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteAnnouncement(a.id)}><Trash2 className="h-4 w-4" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Homepage Tab */}
        <TabsContent value="homepage">
          <Card>
            <CardHeader><CardTitle>Homepage Content</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Label>Hero Title</Label>
              <Input value={homepage.heroTitle} onChange={e => setHomepage({ ...homepage, heroTitle: e.target.value })} />
              <Label>Hero Subtitle</Label>
              <Textarea value={homepage.heroSubtitle} onChange={e => setHomepage({ ...homepage, heroSubtitle: e.target.value })} />
              <Label>Hero CTA</Label>
              <Input value={homepage.heroCTA} onChange={e => setHomepage({ ...homepage, heroCTA: e.target.value })} />

              <h3 className="font-bold mt-2">Features</h3>
              {(homepage.features || []).map(f => (
                <div key={f.id} className="flex gap-2 mb-2">
                  <Input placeholder="Title" value={f.title} onChange={e => updateHomepageFeature(f.id, "title", e.target.value)} />
                  <Input placeholder="Description" value={f.description} onChange={e => updateHomepageFeature(f.id, "description", e.target.value)} />
                  <Input placeholder="Icon" value={f.icon} onChange={e => updateHomepageFeature(f.id, "icon", e.target.value)} />
                  <Button variant="destructive" onClick={() => deleteHomepageFeature(f.id)}>Delete</Button>
                </div>
              ))}
              <Button onClick={addHomepageFeature}><Plus className="h-4 w-4" /> Add Feature</Button>

              <h3 className="font-bold mt-2">Regions</h3>
              {(homepage.regions || []).map(r => (
                <div key={r.id} className="flex gap-2 mb-2">
                  <Input placeholder="Name" value={r.name} onChange={e => updateRegion(r.id, "name", e.target.value)} />
                  <Input placeholder="Flag" value={r.flag} onChange={e => updateRegion(r.id, "flag", e.target.value)} />
                  <Button variant="destructive" onClick={() => deleteRegion(r.id)}>Delete</Button>
                </div>
              ))}
              <Button onClick={addRegion}><Plus className="h-4 w-4" /> Add Region</Button>

              <Label>CTA Title</Label>
              <Input value={homepage.ctaTitle} onChange={e => setHomepage({ ...homepage, ctaTitle: e.target.value })} />
              <Label>CTA Subtitle</Label>
              <Input value={homepage.ctaSubtitle} onChange={e => setHomepage({ ...homepage, ctaSubtitle: e.target.value })} />
              <Label>CTA Button</Label>
              <Input value={homepage.ctaButton} onChange={e => setHomepage({ ...homepage, ctaButton: e.target.value })} />
              <Button onClick={saveHomepage} className="mt-2 w-full">Save Homepage</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
