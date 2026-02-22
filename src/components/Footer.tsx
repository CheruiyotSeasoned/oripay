'use client';

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Smartphone, Apple } from "lucide-react";

interface Contact {
  email: string;
  phone: string;
  location: string;
  whatsapp: string;
}

interface Socials {
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
}

interface AppLinks {
  playStore: string;
  appStore: string;
}

interface QuickLink {
  name: string;
  path: string;
}

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const defaultQuickLinks: QuickLink[] = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "About Us", path: "/about" },];

const Footer = () => {
  const [companyName, setCompanyName] = useState("Oripay Exchange");
  const [description, setDescription] = useState("");
  const [contact, setContact] = useState<Contact>({ email: "", phone: "", location: "", whatsapp: "" });
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>(defaultQuickLinks);
  const [services, setServices] = useState<string[]>([]);
  const [socials, setSocials] = useState<Socials>({ facebook: "", twitter: "", instagram: "", linkedin: "" });
  const [appLinks, setAppLinks] = useState<AppLinks>({ playStore: "", appStore: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFooter = async () => {
      try {
        console.log("[Footer] ▶ Fetching footer/main from Firestore...");
        const ref = doc(db, "footer", "main");
        const snap = await getDoc(ref);

        if (!active) return;

        if (!snap.exists()) {
          console.warn("[Footer] ⚠ No footer/main document found — using all defaults");
          setLoading(false);
          return;
        }

        const data = snap.data();
        console.log("[Footer] ✅ Raw Firestore data:", JSON.stringify(data, null, 2));

        // Company
        setCompanyName(data.companyName || "Oripay Exchange");
        setDescription(data.description || "");

        // Contact
        console.log("[Footer] contact field:", data.contact);
        setContact(data.contact || { email: "", phone: "", location: "", whatsapp: "" });

        // Socials
        console.log("[Footer] socials field:", data.socials);
        setSocials(data.socials || { facebook: "", twitter: "", instagram: "", linkedin: "" });

        // App links
        console.log("[Footer] appLinks field:", data.appLinks);
        setAppLinks(data.appLinks || { playStore: "", appStore: "" });

        // Services
        console.log("[Footer] services field:", data.services);
        setServices(Array.isArray(data.services) ? data.services : []);

        // Quick links — most detailed debug
        console.log("[Footer] quickLinks raw value:", data.quickLinks);
        console.log("[Footer] quickLinks typeof:", typeof data.quickLinks);
        console.log("[Footer] quickLinks isArray:", Array.isArray(data.quickLinks));

        if (!data.quickLinks) {
          console.warn("[Footer] ⚠ quickLinks field is missing from Firestore doc — using defaults");
          setQuickLinks(defaultQuickLinks);
        } else if (!Array.isArray(data.quickLinks)) {
          console.warn("[Footer] ⚠ quickLinks is not an array (got:", typeof data.quickLinks, ") — using defaults");
          setQuickLinks(defaultQuickLinks);
        } else if (data.quickLinks.length === 0) {
          console.warn("[Footer] ⚠ quickLinks array is empty — using defaults");
          setQuickLinks(defaultQuickLinks);
        } else {
          // Normalize: Firestore uses {label, url} but component expects {name, path}
          const normalized: QuickLink[] = data.quickLinks.map((link: any, i: number) => {
            const name = link.name || link.label || `Link ${i + 1}`;
            const path = link.path || link.url || "/";
            console.log(`[Footer]   [${i}] raw keys: ${Object.keys(link).join(", ")} → name="${name}" path="${path}"`);
            return { name, path };
          });
          // Merge: put Firestore links first, then append defaults not already present
          const firestorePaths = new Set(normalized.map((l) => l.path));
          const merged = [
            ...normalized,
            ...defaultQuickLinks.filter((d) => !firestorePaths.has(d.path)),
          ];
          console.log("[Footer] ✅ quickLinks final (Firestore + defaults):", merged.length, "items");
          setQuickLinks(merged);
        }

      } catch (err) {
        console.error("[Footer] ❌ Error loading footer:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFooter();
    return () => { active = false; };
  }, []);

  const currentYear = new Date().getFullYear();
  const whatsappNumber = contact.whatsapp || contact.phone;
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}` : null;

  if (loading) return null;

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Company Info — spans 2 cols */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <span className="text-primary-foreground font-bold text-xl">{companyName.charAt(0)}</span>
              </div>
              <span className="text-lg font-bold">{companyName}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-5 leading-relaxed max-w-xs">{description}</p>

            {/* Social icons */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {socials.facebook && (
                <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-blue-600 hover:text-white flex items-center justify-center text-muted-foreground transition-colors">
                  <Facebook className="h-4 w-4" />
                </a>
              )}
              {socials.twitter && (
                <a href={socials.twitter} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-sky-500 hover:text-white flex items-center justify-center text-muted-foreground transition-colors">
                  <Twitter className="h-4 w-4" />
                </a>
              )}
              {socials.instagram && (
                <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-pink-600 hover:text-white flex items-center justify-center text-muted-foreground transition-colors">
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-blue-700 hover:text-white flex items-center justify-center text-muted-foreground transition-colors">
                  <Linkedin className="h-4 w-4" />
                </a>
              )}
              {whatsappUrl && (
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg bg-muted hover:bg-green-500 hover:text-white flex items-center justify-center text-muted-foreground transition-colors">
                  <WhatsAppIcon className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* App download buttons */}
            {(appLinks.playStore || appLinks.appStore) && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Download Our App</p>
                <div className="flex flex-wrap gap-2">
                  {appLinks.playStore && (
                    <a
                      href={appLinks.playStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted hover:border-foreground/20 transition-all group"
                    >
                      <Smartphone className="h-5 w-5 text-green-500 group-hover:scale-110 transition-transform shrink-0" />
                      <div className="text-left">
                        <p className="text-[10px] text-muted-foreground leading-none">Get it on</p>
                        <p className="text-xs font-semibold leading-snug">Google Play</p>
                      </div>
                    </a>
                  )}
                  {appLinks.appStore && (
                    <a
                      href={appLinks.appStore}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border border-border bg-muted/40 hover:bg-muted hover:border-foreground/20 transition-all group"
                    >
                      <Apple className="h-5 w-5 text-blue-400 group-hover:scale-110 transition-transform shrink-0" />
                      <div className="text-left">
                        <p className="text-[10px] text-muted-foreground leading-none">Download on the</p>
                        <p className="text-xs font-semibold leading-snug">App Store</p>
                      </div>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Quick Links</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 group"
                  >
                    <span className="text-accent opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all text-xs">›</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Our Services</h3>
            <ul className="space-y-2.5">
              {services.map((service, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-center gap-1.5 group">
                  <span className="text-accent opacity-0 group-hover:opacity-100 transition-opacity text-xs">›</span>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Contact Us</h3>
            <ul className="space-y-3">
              {contact.location && (
                <li className="flex items-start gap-2.5 text-sm">
                  <MapPin className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{contact.location}</span>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                  <a href={`tel:${contact.phone}`} className="text-muted-foreground hover:text-foreground transition-colors">
                    {contact.phone}
                  </a>
                </li>
              )}
              {contact.email && (
                <li className="flex items-center gap-2.5 text-sm">
                  <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                  <a href={`mailto:${contact.email}`} className="text-muted-foreground hover:text-foreground transition-colors break-all">
                    {contact.email}
                  </a>
                </li>
              )}
              {whatsappUrl && (
                <li className="mt-4">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-medium transition-all"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    Chat on WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} {companyName}. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
              <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
              <Link to="/cookies" className="text-muted-foreground hover:text-foreground transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;