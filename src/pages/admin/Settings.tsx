import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Shield, FileText, Cookie, Save, RefreshCw, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { db } from "@/lib/firebase";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";

interface Currency {
  code: string;
  name: string;
  rate: number;
  active: boolean;
}

interface Country {
  code: string;
  name: string;
  active: boolean;
}

interface SettingsData {
  transactionFee: number;
  minTransaction: number;
  maxTransaction: number;
  dailyLimit: number;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoKycApproval: boolean;
  supportEmail: string;
  supportPhone: string;
  businessHours: string;
}

interface PolicySection {
  id: string;
  title: string;
  content: string;
}

interface PolicyDocument {
  title: string;
  subtitle: string;
  lastUpdated: string;
  effectiveDate: string;
  sections: PolicySection[];
}

interface PoliciesData {
  privacy: PolicyDocument;
  terms: PolicyDocument;
  cookies: PolicyDocument;
}

const defaultPrivacySections: PolicySection[] = [
  { id: "information-we-collect", title: "1. Information We Collect", content: "We collect information you provide directly to us, such as when you create an account, initiate a transaction, or contact us for support. This includes personal identification, contact information, financial information, device & usage data, and communications." },
  { id: "how-we-use", title: "2. How We Use Your Information", content: "Oripay uses the information we collect to process transactions, verify identity, communicate with you, improve our platform, prevent fraud, and ensure legal compliance." },
  { id: "sharing", title: "3. Information Sharing", content: "We do not sell your personal information. We may share your data with payment partners, regulatory authorities, service providers, and in corporate transactions." },
  { id: "data-security", title: "4. Data Security", content: "We implement industry-standard security measures including TLS 1.3 encryption in transit, AES-256 at rest, strict role-based access controls, two-factor authentication, and regular security audits." },
  { id: "data-retention", title: "5. Data Retention", content: "We retain your personal information for as long as your account is active or as needed to provide services, typically 7 years under Kenyan financial regulations." },
  { id: "your-rights", title: "6. Your Rights", content: "You have rights to access, correct, delete, and port your data. You may also object to certain processing and withdraw consent. Contact privacy@oripay.com to exercise these rights." },
  { id: "cookies", title: "7. Cookies", content: "We use cookies and similar tracking technologies to enhance your experience. Please refer to our Cookie Policy for full details." },
  { id: "changes", title: "8. Changes to This Policy", content: "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice at least 30 days before changes take effect." },
  { id: "contact", title: "9. Contact Us", content: "Email: privacy@oripay.com\nAddress: Oripay Financial Services Ltd., Westlands, Nairobi, Kenya\nPhone: +254 700 000 000" },
];

const defaultTermsSections: PolicySection[] = [
  { id: "acceptance", title: "1. Acceptance of Terms", content: "By accessing or using Oripay's platform, mobile application, or any related services, you agree to be bound by these Terms of Service and our Privacy Policy." },
  { id: "eligibility", title: "2. Eligibility", content: "To use Oripay's Services, you must be at least 18 years of age, have legal capacity to enter contracts, not be from a sanctioned country, and provide accurate information." },
  { id: "account", title: "3. Account Registration & KYC", content: "You must register for an account and complete KYC verification to use our money transfer services. You are responsible for maintaining the confidentiality of your account credentials." },
  { id: "services", title: "4. Services", content: "Oripay enables international money transfers subject to applicable limits, exchange rates, and fees disclosed at the time of each transaction." },
  { id: "fees", title: "5. Fees & Charges", content: "Oripay charges fees for its Services which will be clearly disclosed before you confirm any transaction. Fees vary based on corridor, payment method, amount, and applicable promotions." },
  { id: "prohibited", title: "6. Prohibited Activities", content: "You agree not to use our Services for money laundering, terrorist financing, fraud, purchasing illegal goods, circumventing limits, or any other illegal activity." },
  { id: "intellectual-property", title: "7. Intellectual Property", content: "All content, trademarks, logos, and intellectual property on the Oripay platform are owned by or licensed to Oripay Financial Services Ltd." },
  { id: "liability", title: "8. Limitation of Liability", content: "To the maximum extent permitted by law, Oripay shall not be liable for indirect, incidental, or consequential damages. Total liability shall not exceed fees paid in the preceding 12 months." },
  { id: "termination", title: "9. Termination", content: "Either party may terminate the account. We reserve the right to suspend accounts for Terms violations, compliance risks, or fraud." },
  { id: "governing-law", title: "10. Governing Law & Disputes", content: "These Terms are governed by the laws of Kenya. Disputes shall be resolved through arbitration in Nairobi under NCIA rules." },
  { id: "changes", title: "11. Changes to Terms", content: "We may modify these Terms at any time with at least 30 days' notice for material changes." },
  { id: "contact", title: "12. Contact", content: "Email: legal@oripay.com\nAddress: Oripay Financial Services Ltd., Westlands, Nairobi, Kenya" },
];

const defaultCookieSections: PolicySection[] = [
  { id: "what-are-cookies", title: "1. What Are Cookies?", content: "Cookies are small text files placed on your device when you visit a website. They are used to make websites work efficiently and provide a better user experience." },
  { id: "how-we-use", title: "2. How We Use Cookies", content: "Oripay uses cookies to keep you securely logged in, remember your preferences, understand platform usage, detect fraud, and measure marketing effectiveness." },
  { id: "third-party", title: "3. Third-Party Cookies", content: "Some cookies are set by third-party services including Google Analytics, Mixpanel, and Facebook Pixel (with consent). These parties have their own privacy policies." },
  { id: "managing", title: "4. Managing Your Cookie Preferences", content: "You can manage cookie preferences via our cookie banner, your browser settings, or the preference center on our Cookie Policy page." },
  { id: "changes", title: "5. Updates to This Policy", content: "We may update this Cookie Policy from time to time. Changes will be reflected on this page with an updated effective date." },
  { id: "contact", title: "6. Contact Us", content: "Email: privacy@oripay.com\nAddress: Oripay Financial Services Ltd., Westlands, Nairobi, Kenya" },
];

const defaultPolicies: PoliciesData = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "Your privacy matters to us. This policy explains how Oripay collects, uses, and protects your personal information.",
    lastUpdated: "January 15, 2025",
    effectiveDate: "February 1, 2025",
    sections: defaultPrivacySections,
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Please read these terms carefully before using Oripay's money transfer services.",
    lastUpdated: "January 15, 2025",
    effectiveDate: "February 1, 2025",
    sections: defaultTermsSections,
  },
  cookies: {
    title: "Cookie Policy",
    subtitle: "We use cookies to improve your experience. Here's everything you need to know about our cookies.",
    lastUpdated: "January 15, 2025",
    effectiveDate: "February 1, 2025",
    sections: defaultCookieSections,
  },
};

// ─── Policy Editor Sub-Component ──────────────────────────────────────────────
function PolicyEditor({
  policyKey,
  icon: Icon,
  iconColor,
  policy,
  onChange,
  onSave,
  saving,
}: {
  policyKey: string;
  icon: React.ElementType;
  iconColor: string;
  policy: PolicyDocument;
  onChange: (updated: PolicyDocument) => void;
  onSave: () => void;
  saving: boolean;
}) {
  const [previewSection, setPreviewSection] = useState<string | null>(null);

  const updateSection = (index: number, field: keyof PolicySection, value: string) => {
    const updated = [...policy.sections];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...policy, sections: updated });
  };

  const addSection = () => {
    const newSection: PolicySection = {
      id: `section-${Date.now()}`,
      title: `${policy.sections.length + 1}. New Section`,
      content: "",
    };
    onChange({ ...policy, sections: [...policy.sections, newSection] });
  };

  const removeSection = (index: number) => {
    const updated = policy.sections.filter((_, i) => i !== index);
    onChange({ ...policy, sections: updated });
  };

  return (
    <div className="space-y-6">
      {/* Header meta card */}
      <Card className="border-l-4" style={{ borderLeftColor: iconColor }}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${iconColor}15` }}>
              <Icon className="h-5 w-5" style={{ color: iconColor }} />
            </div>
            <div>
              <CardTitle className="text-base">{policy.title} — Page Header</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Shown in the hero section of the public page</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Page Title</Label>
              <Input
                value={policy.title}
                onChange={(e) => onChange({ ...policy, title: e.target.value })}
                placeholder="e.g. Privacy Policy"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Last Updated Date</Label>
              <Input
                value={policy.lastUpdated}
                onChange={(e) => onChange({ ...policy, lastUpdated: e.target.value })}
                placeholder="e.g. January 15, 2025"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Hero Subtitle</Label>
              <Textarea
                value={policy.subtitle}
                onChange={(e) => onChange({ ...policy, subtitle: e.target.value })}
                placeholder="Short description shown under the title"
                rows={2}
                className="resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Effective Date</Label>
              <Input
                value={policy.effectiveDate}
                onChange={(e) => onChange({ ...policy, effectiveDate: e.target.value })}
                placeholder="e.g. February 1, 2025"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sections */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm">Policy Sections</h3>
            <p className="text-xs text-muted-foreground">{policy.sections.length} sections</p>
          </div>
          <Button variant="outline" size="sm" onClick={addSection} className="gap-1.5 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" /> Add Section
          </Button>
        </div>

        {policy.sections.map((section, index) => (
          <Card key={section.id} className="group transition-shadow hover:shadow-md">
            <CardContent className="pt-4 pb-4 space-y-3">
              <div className="flex items-start gap-3">
                {/* Section number badge */}
                <span className="mt-2 flex-shrink-0 w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                  {index + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={section.title}
                      onChange={(e) => updateSection(index, "title", e.target.value)}
                      placeholder="Section title"
                      className="font-medium text-sm h-8"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setPreviewSection(previewSection === section.id ? null : section.id)}
                      title="Preview section"
                    >
                      {previewSection === section.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeSection(index)}
                      title="Remove section"
                    >
                      ×
                    </Button>
                  </div>

                  {previewSection === section.id ? (
                    <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground whitespace-pre-line leading-relaxed border">
                      {section.content || <span className="italic opacity-60">No content yet</span>}
                    </div>
                  ) : (
                    <Textarea
                      value={section.content}
                      onChange={(e) => updateSection(index, "content", e.target.value)}
                      placeholder="Section content..."
                      rows={4}
                      className="resize-y text-sm leading-relaxed"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between pt-2 border-t">
        <p className="text-xs text-muted-foreground">
          Changes are saved to Firestore and reflected immediately on the public page.
        </p>
        <Button onClick={onSave} disabled={saving} className="gap-2 min-w-[140px]">
          {saving ? (
            <><RefreshCw className="h-4 w-4 animate-spin" /> Saving…</>
          ) : (
            <><Save className="h-4 w-4" /> Save Policy</>
          )}
        </Button>
      </div>
    </div>
  );
}

// ─── Main Settings Component ───────────────────────────────────────────────────
export default function Settings() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [countries, setCountries] = useState<Country[]>([]);
  const [settings, setSettings] = useState<SettingsData>({
    transactionFee: 2.5,
    minTransaction: 100,
    maxTransaction: 1000000,
    dailyLimit: 500000,
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true,
    autoKycApproval: false,
    supportEmail: "support@oripayexchange.com",
    supportPhone: "+254 700 000000",
    businessHours: "Mon-Fri: 8AM - 6PM EAT",
  });

  const [policies, setPolicies] = useState<PoliciesData>(defaultPolicies);
  const [savingPolicy, setSavingPolicy] = useState<Record<string, boolean>>({});
  const [savedPolicy, setSavedPolicy] = useState<Record<string, boolean>>({});

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState<Currency>({ code: "", name: "", rate: 1, active: true });
  const [newCountry, setNewCountry] = useState<Country>({ code: "", name: "", active: true });
  const [loading, setLoading] = useState(false);
  const [activePolicyTab, setActivePolicyTab] = useState<"privacy" | "terms" | "cookies">("privacy");

  const fetchData = async () => {
    setLoading(true);
    try {
      const currencySnap = await getDocs(collection(db, "currencies"));
      setCurrencies(currencySnap.docs.map((d) => d.data() as Currency));

      const countrySnap = await getDocs(collection(db, "countries"));
      setCountries(countrySnap.docs.map((d) => d.data() as Country));

      const settingsSnap = await getDoc(doc(db, "settings", "platform"));
      if (settingsSnap.exists()) setSettings(settingsSnap.data() as SettingsData);

      // Fetch policies
      const privacySnap = await getDoc(doc(db, "policies", "privacy"));
      const termsSnap = await getDoc(doc(db, "policies", "terms"));
      const cookiesSnap = await getDoc(doc(db, "policies", "cookies"));

      setPolicies({
        privacy: privacySnap.exists() ? (privacySnap.data() as PolicyDocument) : defaultPolicies.privacy,
        terms: termsSnap.exists() ? (termsSnap.data() as PolicyDocument) : defaultPolicies.terms,
        cookies: cookiesSnap.exists() ? (cookiesSnap.data() as PolicyDocument) : defaultPolicies.cookies,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const savePolicy = async (key: "privacy" | "terms" | "cookies") => {
    setSavingPolicy((prev) => ({ ...prev, [key]: true }));
    setSavedPolicy((prev) => ({ ...prev, [key]: false }));
    try {
      await setDoc(doc(db, "policies", key), policies[key]);
      toast.success(`${policies[key].title} saved successfully`);
      setSavedPolicy((prev) => ({ ...prev, [key]: true }));
      setTimeout(() => setSavedPolicy((prev) => ({ ...prev, [key]: false })), 3000);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to save ${policies[key].title}`);
    } finally {
      setSavingPolicy((prev) => ({ ...prev, [key]: false }));
    }
  };

  const updatePolicy = (key: "privacy" | "terms" | "cookies", updated: PolicyDocument) => {
    setPolicies((prev) => ({ ...prev, [key]: updated }));
  };

  const addCurrency = async () => {
    if (!newCurrency.code || !newCurrency.name) return toast.error("Fill all fields");
    try {
      await setDoc(doc(db, "currencies", newCurrency.code), newCurrency);
      toast.success("Currency added");
      setShowCurrencyModal(false);
      setNewCurrency({ code: "", name: "", rate: 1, active: true });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add currency");
    }
  };

  const addCountry = async () => {
    if (!newCountry.code || !newCountry.name) return toast.error("Fill all fields");
    try {
      await setDoc(doc(db, "countries", newCountry.code), newCountry);
      toast.success("Country added");
      setShowCountryModal(false);
      setNewCountry({ code: "", name: "", active: true });
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to add country");
    }
  };

  const toggleCurrencyActive = async (currency: Currency) => {
    try {
      await setDoc(doc(db, "currencies", currency.code), { ...currency, active: !currency.active });
      toast.success("Currency updated");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update currency");
    }
  };

  const toggleCountryActive = async (country: Country) => {
    try {
      await setDoc(doc(db, "countries", country.code), { ...country, active: !country.active });
      toast.success("Country updated");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update country");
    }
  };

  const saveSettings = async () => {
    try {
      await setDoc(doc(db, "settings", "platform"), settings);
      toast.success("Settings saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    }
  };

  const policyTabs: { key: "privacy" | "terms" | "cookies"; label: string; icon: React.ElementType; color: string }[] = [
    { key: "privacy", label: "Privacy Policy", icon: Shield, color: "#3b82f6" },
    { key: "terms", label: "Terms of Service", icon: FileText, color: "#8b5cf6" },
    { key: "cookies", label: "Cookie Policy", icon: Cookie, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="currencies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="fees">Fees & Limits</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="policies" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" /> Policies
          </TabsTrigger>
        </TabsList>

        {/* Currencies */}
        <TabsContent value="currencies">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Supported Currencies</CardTitle>
              <Button className="gap-2" onClick={() => setShowCurrencyModal(true)}>
                <Plus className="h-4 w-4" /> Add Currency
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currencies.map((c) => (
                    <TableRow key={c.code}>
                      <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.rate}</TableCell>
                      <TableCell>
                        <Badge variant={c.active ? "default" : "secondary"}>
                          {c.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => toggleCurrencyActive(c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Countries */}
        <TabsContent value="countries">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle>Supported Countries</CardTitle>
              <Button className="gap-2" onClick={() => setShowCountryModal(true)}>
                <Plus className="h-4 w-4" /> Add Country
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {countries.map((c) => (
                    <TableRow key={c.code}>
                      <TableCell>{c.name}</TableCell>
                      <TableCell className="font-mono">{c.code}</TableCell>
                      <TableCell>
                        <Badge variant={c.active ? "default" : "secondary"}>
                          {c.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => toggleCountryActive(c)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fees & Limits */}
        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Fees & Limits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transaction Fee (%)</Label>
                  <Input type="number" value={settings.transactionFee} onChange={(e) => setSettings({ ...settings, transactionFee: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Minimum Transaction (KES)</Label>
                  <Input type="number" value={settings.minTransaction} onChange={(e) => setSettings({ ...settings, minTransaction: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Maximum Transaction (KES)</Label>
                  <Input type="number" value={settings.maxTransaction} onChange={(e) => setSettings({ ...settings, maxTransaction: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Daily Limit (KES)</Label>
                  <Input type="number" value={settings.dailyLimit} onChange={(e) => setSettings({ ...settings, dailyLimit: parseFloat(e.target.value) })} />
                </div>
              </div>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label>Maintenance Mode</Label>
                <Switch checked={settings.maintenanceMode} onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch checked={settings.emailNotifications} onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch checked={settings.smsNotifications} onCheckedChange={(checked) => setSettings({ ...settings, smsNotifications: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto KYC Approval</Label>
                <Switch checked={settings.autoKycApproval} onCheckedChange={(checked) => setSettings({ ...settings, autoKycApproval: checked })} />
              </div>
            </CardContent>

            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Support Email</Label>
                <Input value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} />
              </div>
              <div>
                <Label>Support Phone</Label>
                <Input value={settings.supportPhone} onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} />
              </div>
              <div>
                <Label>Business Hours</Label>
                <Input value={settings.businessHours} onChange={(e) => setSettings({ ...settings, businessHours: e.target.value })} />
              </div>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── POLICIES TAB ─────────────────────────────────────────────────── */}
        <TabsContent value="policies">
          <div className="space-y-6">

            {/* Info banner */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-sm">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="text-blue-700 dark:text-blue-300">
                <span className="font-semibold">Policy CMS:</span> Changes made here are saved to Firestore under the <code className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">policies</code> collection and reflected immediately on the public-facing policy pages. Each policy is stored as a separate document: <code className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">policies/privacy</code>, <code className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">policies/terms</code>, <code className="text-xs bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">policies/cookies</code>.
              </div>
            </div>

            {/* Policy selector cards */}
            <div className="grid grid-cols-3 gap-4">
              {policyTabs.map(({ key, label, icon: Icon, color }) => (
                <button
                  key={key}
                  onClick={() => setActivePolicyTab(key)}
                  className={`text-left p-4 rounded-xl border-2 transition-all ${
                    activePolicyTab === key
                      ? "border-current shadow-sm"
                      : "border-transparent bg-muted/40 hover:bg-muted/60"
                  }`}
                  style={activePolicyTab === key ? { borderColor: color, backgroundColor: `${color}08` } : {}}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
                      <Icon className="h-4.5 w-4.5" style={{ color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {policies[key].sections.length} sections
                      </p>
                    </div>
                  </div>
                  {savedPolicy[key] && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" /> Saved
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Active policy editor */}
            {policyTabs.map(({ key, icon, color }) =>
              activePolicyTab === key ? (
                <PolicyEditor
                  key={key}
                  policyKey={key}
                  icon={icon}
                  iconColor={color}
                  policy={policies[key]}
                  onChange={(updated) => updatePolicy(key, updated)}
                  onSave={() => savePolicy(key)}
                  saving={savingPolicy[key] || false}
                />
              ) : null
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Currency Modal */}
      <Dialog open={showCurrencyModal} onOpenChange={setShowCurrencyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Code (e.g. USD)" value={newCurrency.code} onChange={(e) => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })} />
            <Input placeholder="Name (e.g. US Dollar)" value={newCurrency.name} onChange={(e) => setNewCurrency({ ...newCurrency, name: e.target.value })} />
            <Input type="number" placeholder="Rate (vs KES)" value={newCurrency.rate} onChange={(e) => setNewCurrency({ ...newCurrency, rate: parseFloat(e.target.value) })} />
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={newCurrency.active} onCheckedChange={(val) => setNewCurrency({ ...newCurrency, active: val })} />
            </div>
            <Button onClick={addCurrency} className="w-full">Add Currency</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Country Modal */}
      <Dialog open={showCountryModal} onOpenChange={setShowCountryModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Country</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Code (e.g. KE)" value={newCountry.code} onChange={(e) => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })} />
            <Input placeholder="Name (e.g. Kenya)" value={newCountry.name} onChange={(e) => setNewCountry({ ...newCountry, name: e.target.value })} />
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch checked={newCountry.active} onCheckedChange={(val) => setNewCountry({ ...newCountry, active: val })} />
            </div>
            <Button onClick={addCountry} className="w-full">Add Country</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}