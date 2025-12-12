'use client';

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

interface Contact {
  email: string;
  phone: string;
  location: string;
}

interface Socials {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

const Footer = () => {
  const [companyName, setCompanyName] = useState("Oripay Exchange");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState<Contact>({ email: "", phone: "", location: "" });
  const [quickLinks, setQuickLinks] = useState<Array<{ name: string; path: string }>>([]);
  const [services, setServices] = useState<string[]>([]);
  const [socials, setSocials] = useState<Socials>({ facebook: "", twitter: "", instagram: "", linkedin: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFooter = async () => {
      try {
        const ref = doc(db, "footer", "main");
        const snap = await getDoc(ref);

        if (!active) return;

        if (snap.exists()) {
          const data = snap.data();
          setCompanyName(data.companyName || "Oripay Exchange");
          setDescription(data.description || "");
          setContact(data.contact || { email: "", phone: "", location: "" });
          setQuickLinks(data.quickLinks || [
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: "About Us", path: "/about" },
            { name: "Login", path: "/login" },
          ]);
          setServices(data.services || []);
          setSocials(data.socials || { facebook: "", twitter: "", instagram: "", linkedin: "" });
        }
      } catch (err) {
        console.error("Error loading footer:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFooter();

    return () => {
      active = false;
    };
  }, []);

  const currentYear = new Date().getFullYear();

  if (loading) return <p className="p-10 text-center">Loading footer...</p>;

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-xl">{companyName.charAt(0)}</span>
              </div>
              <span className="text-lg font-bold">{companyName}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="flex space-x-3">
              {socials.facebook && <a href={socials.facebook} target="_blank" className="text-muted-foreground hover:text-accent transition-smooth"><Facebook className="h-5 w-5" /></a>}
              {socials.twitter && <a href={socials.twitter} target="_blank" className="text-muted-foreground hover:text-accent transition-smooth"><Twitter className="h-5 w-5" /></a>}
              {socials.instagram && <a href={socials.instagram} target="_blank" className="text-muted-foreground hover:text-accent transition-smooth"><Instagram className="h-5 w-5" /></a>}
              {socials.linkedin && <a href={socials.linkedin} target="_blank" className="text-muted-foreground hover:text-accent transition-smooth"><Linkedin className="h-5 w-5" /></a>}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link to={link.path} className="text-muted-foreground hover:text-foreground transition-smooth">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {services.map((service, idx) => (
                <li key={idx}>{service}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              {contact.location && <li className="flex items-start space-x-2"><MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" /><span className="text-muted-foreground">{contact.location}</span></li>}
              {contact.phone && <li className="flex items-start space-x-2"><Phone className="h-4 w-4 text-accent mt-1 flex-shrink-0" /><span className="text-muted-foreground">{contact.phone}</span></li>}
              {contact.email && <li className="flex items-start space-x-2"><Mail className="h-4 w-4 text-accent mt-1 flex-shrink-0" /><span className="text-muted-foreground">{contact.email}</span></li>}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">© {currentYear} {companyName}. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Privacy Policy</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Terms of Service</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-smooth">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
