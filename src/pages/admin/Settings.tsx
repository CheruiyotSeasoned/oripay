import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus } from "lucide-react";
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

  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [newCurrency, setNewCurrency] = useState<Currency>({ code: "", name: "", rate: 1, active: true });
  const [newCountry, setNewCountry] = useState<Country>({ code: "", name: "", active: true });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const currencySnap = await getDocs(collection(db, "currencies"));
      setCurrencies(currencySnap.docs.map(doc => doc.data() as Currency));

      const countrySnap = await getDocs(collection(db, "countries"));
      setCountries(countrySnap.docs.map(doc => doc.data() as Country));

      const settingsSnap = await getDoc(doc(db, "settings", "platform"));
      if (settingsSnap.exists()) setSettings(settingsSnap.data() as SettingsData);
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

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Tabs defaultValue="currencies" className="space-y-6">
        <TabsList>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="fees">Fees & Limits</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>

        {/* Currencies */}
        <TabsContent value="currencies">
          <Card>
            <CardHeader className="flex justify-between items-center">
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
                      <TableCell>{c.code}</TableCell>
                      <TableCell>{c.name}</TableCell>
                      <TableCell>{c.rate}</TableCell>
                      <TableCell>{c.active ? "Active" : "Inactive"}</TableCell>
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
            <CardHeader className="flex justify-between items-center">
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
                      <TableCell>{c.code}</TableCell>
                      <TableCell>{c.active ? "Active" : "Inactive"}</TableCell>
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
                  <Input type="number" value={settings.transactionFee} onChange={e => setSettings({ ...settings, transactionFee: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Minimum Transaction (KES)</Label>
                  <Input type="number" value={settings.minTransaction} onChange={e => setSettings({ ...settings, minTransaction: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Maximum Transaction (KES)</Label>
                  <Input type="number" value={settings.maxTransaction} onChange={e => setSettings({ ...settings, maxTransaction: parseFloat(e.target.value) })} />
                </div>
                <div>
                  <Label>Daily Limit (KES)</Label>
                  <Input type="number" value={settings.dailyLimit} onChange={e => setSettings({ ...settings, dailyLimit: parseFloat(e.target.value) })} />
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
                <Switch checked={settings.maintenanceMode} onCheckedChange={checked => setSettings({ ...settings, maintenanceMode: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Email Notifications</Label>
                <Switch checked={settings.emailNotifications} onCheckedChange={checked => setSettings({ ...settings, emailNotifications: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>SMS Notifications</Label>
                <Switch checked={settings.smsNotifications} onCheckedChange={checked => setSettings({ ...settings, smsNotifications: checked })} />
              </div>
              <div className="flex items-center justify-between">
                <Label>Auto KYC Approval</Label>
                <Switch checked={settings.autoKycApproval} onCheckedChange={checked => setSettings({ ...settings, autoKycApproval: checked })} />
              </div>
            </CardContent>

            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Support Email</Label>
                <Input value={settings.supportEmail} onChange={e => setSettings({ ...settings, supportEmail: e.target.value })} />
              </div>
              <div>
                <Label>Support Phone</Label>
                <Input value={settings.supportPhone} onChange={e => setSettings({ ...settings, supportPhone: e.target.value })} />
              </div>
              <div>
                <Label>Business Hours</Label>
                <Input value={settings.businessHours} onChange={e => setSettings({ ...settings, businessHours: e.target.value })} />
              </div>
              <Button onClick={saveSettings}>Save Changes</Button>
            </CardContent>
          </Card>
          </TabsContent>
        </Tabs>

      {/* Currency Modal */}
      <Dialog open={showCurrencyModal} onOpenChange={setShowCurrencyModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Currency</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Code" value={newCurrency.code} onChange={e => setNewCurrency({ ...newCurrency, code: e.target.value.toUpperCase() })} />
            <Input placeholder="Name" value={newCurrency.name} onChange={e => setNewCurrency({ ...newCurrency, name: e.target.value })} />
            <Input type="number" placeholder="Rate" value={newCurrency.rate} onChange={e => setNewCurrency({ ...newCurrency, rate: parseFloat(e.target.value) })} />
            <Switch checked={newCurrency.active} onCheckedChange={val => setNewCurrency({ ...newCurrency, active: val })} />
            <Button onClick={addCurrency}>Add Currency</Button>
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
            <Input placeholder="Code" value={newCountry.code} onChange={e => setNewCountry({ ...newCountry, code: e.target.value.toUpperCase() })} />
            <Input placeholder="Name" value={newCountry.name} onChange={e => setNewCountry({ ...newCountry, name: e.target.value })} />
            <Switch checked={newCountry.active} onCheckedChange={val => setNewCountry({ ...newCountry, active: val })} />
            <Button onClick={addCountry}>Add Country</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
