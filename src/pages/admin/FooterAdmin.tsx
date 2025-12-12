'use client';

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface QuickLink {
  label: string;
  url: string;
}

const FooterAdmin = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");

  const [socials, setSocials] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
  });

  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);
  const [services, setServices] = useState<string[]>([]);
  const [contact, setContact] = useState({
    location: "",
    phone: "",
    email: "",
  });

  // Load footer data
  useEffect(() => {
    const loadFooter = async () => {
      const footerRef = doc(db, "footer", "main");
      const footerSnap = await getDoc(footerRef);
      if (footerSnap.exists()) {
        const data = footerSnap.data();
        setCompanyName(data.companyName || "");
        setDescription(data.description || "");
        setSocials(data.socials || socials);
        setQuickLinks(data.quickLinks || []);
        setServices(data.services || []);
        setContact(data.contact || contact);
      }
      setLoading(false);
    };

    loadFooter();
  }, []);

  const saveFooter = async () => {
    setSaving(true);
    try {
      const ref = doc(db, "footer", "main");
      await setDoc(ref, {
        companyName,
        description,
        socials,
        quickLinks,
        services,
        contact,
      });
      alert("Footer updated successfully!");
    } catch (err: any) {
      console.error(err);
      alert("Error saving footer: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="container mx-auto max-w-3xl py-10">
      <h1 className="text-2xl font-bold mb-6">Footer Settings</h1>

      {/* Company Info */}
      <div className="space-y-4 mb-8">
        <Input
          placeholder="Company Name"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Textarea
          placeholder="Short Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>

      {/* Social Links */}
      <h2 className="font-semibold text-lg mb-2">Social Links</h2>
      <div className="grid grid-cols-1 gap-3 mb-6">
        {Object.keys(socials).map((key) => (
          <Input
            key={key}
            placeholder={`${key} URL`}
            value={(socials as any)[key]}
            onChange={(e) => setSocials({ ...socials, [key]: e.target.value })}
          />
        ))}
      </div>

      {/* Quick Links */}
      <h2 className="font-semibold text-lg mb-2">Quick Links</h2>
      {quickLinks.map((link, index) => (
        <div key={index} className="grid grid-cols-2 gap-3 mb-2">
          <Input
            placeholder="Label"
            value={link.label}
            onChange={(e) => {
              const clone = [...quickLinks];
              clone[index].label = e.target.value;
              setQuickLinks(clone);
            }}
          />
          <Input
            placeholder="URL"
            value={link.url}
            onChange={(e) => {
              const clone = [...quickLinks];
              clone[index].url = e.target.value;
              setQuickLinks(clone);
            }}
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setQuickLinks([...quickLinks, { label: "", url: "" }])}
      >
        + Add Link
      </Button>

      {/* Services */}
      <h2 className="font-semibold text-lg mt-6 mb-2">Services</h2>
      {services.map((srv, index) => (
        <Input
          key={index}
          className="mb-2"
          value={srv}
          onChange={(e) => {
            const clone = [...services];
            clone[index] = e.target.value;
            setServices(clone);
          }}
        />
      ))}
      <Button
        size="sm"
        variant="outline"
        onClick={() => setServices([...services, ""])}
      >
        + Add Service
      </Button>

      {/* Contact */}
      <h2 className="font-semibold text-lg mt-6 mb-2">Contact</h2>
      <div className="space-y-3 mb-6">
        <Input
          placeholder="Location"
          value={contact.location}
          onChange={(e) => setContact({ ...contact, location: e.target.value })}
        />
        <Input
          placeholder="Phone"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        />
        <Input
          placeholder="Email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
        />
      </div>

      <Button className="w-full" onClick={saveFooter} disabled={saving}>
        {saving ? "Saving..." : "Save Footer"}
      </Button>
    </div>
  );
};

export default FooterAdmin;
