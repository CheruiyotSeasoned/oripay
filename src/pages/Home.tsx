import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Globe, Shield, Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

// Map icon names from CMS to lucide-react components
const iconMap: Record<string, React.ElementType> = {
  Globe,
  Shield,
  Clock,
  TrendingUp,
  CheckCircle2,
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Region {
  name: string;
  flag: string;
}

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

const Home = () => {
  const [homepage, setHomepage] = useState<HomepageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomepage = async () => {
      try {
        const docRef = doc(db, "homepageContent", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHomepage(docSnap.data() as HomepageContent);
        } else {
          console.warn("No homepage content found!");
        }
      } catch (err) {
        console.error("Error fetching homepage content:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepage();
  }, []);

  if (loading) return <p className="text-center py-20">Loading homepage content...</p>;
  if (!homepage) return <p className="text-center py-20">Homepage content not available.</p>;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left: Hero Text & CTA */}
          <div className="space-y-6">
            {/* Title & Subtitle */}
            <h1 className="text-5xl font-bold leading-tight text-white dark:text-white">
              {homepage.heroTitle}
            </h1>
            <h2 className="text-3xl font-semibold text-white dark:text-white">
              {homepage.heroSubtitle}
            </h2>
            <p className="text-xl text-blue-100 dark:text-blue-200">{homepage.heroCTA}</p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-4">
              <Link to="/register">
                <Button className="inline-flex items-center justify-center gap-2 h-10 bg-white text-blue-600 hover:bg-blue-50 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 px-8 py-3 text-lg font-semibold rounded-lg">
                  Get Started →
                </Button>
              </Link>
              <Link to="/services">
                <Button className="inline-flex items-center justify-center gap-2 h-10 bg-transparent border border-white hover:bg-white hover:text-blue-600 dark:border-gray-300 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white px-8 py-3 text-lg font-semibold rounded-lg">
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="flex items-center mt-8 space-x-8 text-sm">
              {homepage.features.slice(0, 2).map((feature, index) => {
                const Icon = iconMap[feature.icon] || Globe;
                return (
                  <div key={index} className="flex items-center gap-2 text-white dark:text-gray-200">
                    <Icon className="h-5 w-5" />
                    <span>{feature.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Send Money Card */}
          <div className="flex justify-center mt-12 lg:mt-0">
            <div className="relative w-full max-w-lg">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-white/10 dark:bg-gray-800/40 backdrop-blur-sm rounded-2xl transform scale-110 shadow-2xl"></div>

              {/* Card */}
              <div className="border relative bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-10 rounded-2xl shadow-lg w-full">
                <div className="text-center space-y-6">
                  <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">Send Money Now</h3>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-left">
                      <label className="text-sm text-gray-600 dark:text-gray-300">You Send</label>
                      <div className="text-2xl font-bold">100,000 KES</div>
                    </div>
                    <div className="text-right">
                      <label className="text-sm text-gray-600 dark:text-gray-300">From</label>
                      <div className="text-lg font-semibold">Kenya</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-left">
                      <label className="text-sm text-gray-600 dark:text-gray-300">They Receive</label>
                      <div className="text-2xl font-bold">4,850 CNY</div>
                    </div>
                    <div className="text-right">
                      <label className="text-sm text-gray-600 dark:text-gray-300">To</label>
                      <div className="text-lg font-semibold">China</div>
                    </div>
                  </div>

                  <Link to="/register" className="w-full">
                    <button className="inline-flex items-center justify-center gap-2 text-sm h-10 px-4 w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white py-3 rounded-lg font-semibold">
                      Continue
                    </button>
                  </Link>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>




      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose Oripay?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're revolutionizing cross-border payments with technology that puts you first
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {homepage.features.map((feature, index) => {
              const Icon = iconMap[feature.icon] || Globe;
              return (
                <Card
                  key={index}
                  className="p-6 hover:shadow-lg transition-smooth cursor-pointer hover:border-accent/50"
                >
                  <div className="w-12 h-12 rounded-lg gradient-accent flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl gradient-text font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Connecting Africa to the World
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Send and receive money across continents with ease
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {homepage.regions.map((region, index) => (
              <Card
                key={index}
                className="p-6 text-center hover:shadow-md transition-smooth hover:border-primary/50"
              >
                <div className="text-4xl mb-3">{region.flag}</div>
                <p className="font-medium text-sm">{region.name}</p>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground">And 100+ more countries worldwide</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <Card className="gradient-hero text-primary-foreground p-12 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{homepage.ctaTitle}</h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">{homepage.ctaSubtitle}</p>
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-8 group">
                {homepage.ctaButton || "Create Free Account"}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
