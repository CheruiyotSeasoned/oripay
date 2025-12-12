import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";

import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

interface Director {
  firstName: string;
  lastName: string;
  idFile: File | null;
  kraFile: File | null;
}

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    businessType: "",
    companyName: "",
    email: "",
    phone: "",
    coiNumber: "",
    password: "",
    confirmPassword: "",
    coiFile: null as File | null,
    cr12File: null as File | null,
    companyKraFile: null as File | null,
  });

  const [directors, setDirectors] = useState<Director[]>([
    { firstName: "", lastName: "", idFile: null, kraFile: null },
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as any;
    if (name.endsWith("File")) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDirectorChange = (index: number, field: keyof Director, value: string | File | null) => {
    const updated = [...directors];
    updated[index][field] = value as any;
    setDirectors(updated);
  };

  const addDirector = () => {
    setDirectors([...directors, { firstName: "", lastName: "", idFile: null, kraFile: null }]);
  };

  // --- Helper to convert File to Base64 ---
  const fileToBase64 = (file: File | null) => {
    return new Promise<string | null>((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: directors[0].firstName });

      // Convert files to Base64
      const coiBase64 = await fileToBase64(formData.coiFile);
      const cr12Base64 = await fileToBase64(formData.cr12File);
      const companyKraBase64 = await fileToBase64(formData.companyKraFile);

      const directorsWithBase64 = await Promise.all(
        directors.map(async (d) => ({
          firstName: d.firstName,
          lastName: d.lastName,
          idFileBase64: await fileToBase64(d.idFile),
          kraFileBase64: await fileToBase64(d.kraFile),
        }))
      );

      // Save to Firestore
      await setDoc(doc(db, "users", user.uid), {
        businessType: formData.businessType,
        companyName: formData.companyName,
        email: formData.email,
        phone: formData.phone,
        coiNumber: formData.coiNumber,
        password: formData.password, // consider hashing or remove storing plaintext
        role: "user",
        kycCompleted: false,
        directors: directorsWithBase64,
        files: { coiBase64, cr12Base64, companyKraBase64 },
        createdAt: serverTimestamp(),
      });

      toast({ title: "Registration Successful", description: "Please complete your KYC process." });
      navigate("/kyc");
    } catch (error: any) {
      console.error(error);
      toast({ title: "Registration Failed", description: error.message || "Something went wrong.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <Card className="p-6 sm:p-8 space-y-6">
            <h1 className="text-3xl font-bold mb-4">Create Your Account</h1>

            {/* Company Info */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Company Information</h2>
              <Input name="businessType" placeholder="Business Type" value={formData.businessType} onChange={handleChange} required />
              <Input name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
              <Input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
              <Input name="phone" type="tel" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
              <Input name="coiNumber" placeholder="COI Number" value={formData.coiNumber} onChange={handleChange} required />
            </section>

            {/* Company Documents */}
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Company Documents</h2>
              <Input name="coiFile" type="file" onChange={handleChange} required />
              <Input name="cr12File" type="file" onChange={handleChange} required />
              <Input name="companyKraFile" type="file" onChange={handleChange} required />
            </section>

            {/* Directors */}
            {directors.map((director, idx) => (
              <div key={idx} className="border p-4 rounded-lg space-y-3">
                <h3 className="font-medium">Director {idx + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input value={director.firstName} onChange={(e) => handleDirectorChange(idx, "firstName", e.target.value)} required />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={director.lastName} onChange={(e) => handleDirectorChange(idx, "lastName", e.target.value)} required />
                  </div>
                  <div>
                    <Label>ID Document</Label>
                    <Input type="file" onChange={(e) => handleDirectorChange(idx, "idFile", e.target.files?.[0] || null)} required />
                  </div>
                  <div>
                    <Label>KRA PIN Certificate</Label>
                    <Input type="file" onChange={(e) => handleDirectorChange(idx, "kraFile", e.target.files?.[0] || null)} required />
                  </div>
                </div>
              </div>
            ))}


            {/* Password */}
            <section className="space-y-4">
              <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
              <Input name="confirmPassword" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required />
            </section>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <input type="checkbox" required className="mt-1 rounded border-input" />
              <span className="text-sm text-muted-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </span>
            </div>

            <Button type="submit" className="w-full gradient-primary shadow-glow" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
