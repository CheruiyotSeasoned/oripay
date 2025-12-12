import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Upload, FileText, Camera, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const KYC = () => {
  const [formData, setFormData] = useState({
    idNumber: "",
    kraPin: "",
    dateOfBirth: "",
    address: "",
    city: "",
    country: "",
  });

  const [files, setFiles] = useState({
    idDocument: null as File | null,
    selfie: null as File | null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "idDocument" | "selfie") => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ ...files, [type]: e.target.files[0] });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.idDocument || !files.selfie) {
      toast({
        title: "Missing Documents",
        description: "Please upload both ID document and selfie.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const idDocBase64 = await fileToBase64(files.idDocument);
      const selfieBase64 = await fileToBase64(files.selfie);

      // Save KYC data directly to Firestore under the user's doc
      const userDocRef = doc(db, "users", auth.currentUser!.uid);
      await setDoc(
        userDocRef,
        {
          kyc: {
            ...formData,
            idDocument: idDocBase64,
            selfie: selfieBase64,
            submittedAt: serverTimestamp(),
            status: "pending",
          },
        },
        { merge: true }
      );

      toast({
        title: "KYC Submitted Successfully",
        description: "Your verification is under review. We'll notify you soon!",
      });
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast({
        title: "KYC Submission Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">KYC Verification</h1>
            <p className="text-muted-foreground">
              Complete your verification to start sending money globally
            </p>
          </div>

          <Card className="p-6 sm:p-8">
            <div className="flex items-start space-x-3 p-4 bg-accent/10 border border-accent/20 rounded-lg mb-6">
              <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Why KYC is Required</p>
                <p className="text-muted-foreground">
                  To comply with international regulations and ensure the security of your transactions,
                  we need to verify your identity.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">National ID Number *</Label>
                    <Input
                      id="idNumber"
                      name="idNumber"
                      type="text"
                      placeholder="12345678"
                      value={formData.idNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kraPin">KRA PIN *</Label>
                    <Input
                      id="kraPin"
                      name="kraPin"
                      type="text"
                      placeholder="A000000000X"
                      value={formData.kraPin}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      name="country"
                      type="text"
                      placeholder="Kenya"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      name="address"
                      type="text"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      placeholder="Nairobi"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Document Upload</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="idDocument">National ID / Passport *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth cursor-pointer">
                      <input
                        id="idDocument"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, "idDocument")}
                        className="hidden"
                      />
                      <label htmlFor="idDocument" className="cursor-pointer">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {files.idDocument ? files.idDocument.name : "Click to upload ID document"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG or PDF (max. 5MB)
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="selfie">Selfie with ID *</Label>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth cursor-pointer">
                      <input
                        id="selfie"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "selfie")}
                        className="hidden"
                      />
                      <label htmlFor="selfie" className="cursor-pointer">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm font-medium">
                          {files.selfie ? files.selfie.name : "Click to upload selfie"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Clear photo holding your ID next to your face
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary shadow-glow"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit for Verification"}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default KYC;
