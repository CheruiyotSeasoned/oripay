'use client';

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card } from "@/components/ui/card";
import { Target, Users, Award, TrendingUp } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Map icon strings from Firestore to lucide-react components
const ICON_MAP: Record<string, any> = {
  Target,
  Users,
  Award,
  TrendingUp,
};

interface Stat {
  label: string;
  value: string;
  icon: string;
}

interface Value {
  title: string;
  description: string;
}

const About = () => {
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [stats, setStats] = useState<Stat[]>([]);
  const [story, setStory] = useState<string[]>([]);
  const [values, setValues] = useState<Value[]>([]);
  const [missionTitle, setMissionTitle] = useState("");
  const [missionText, setMissionText] = useState("");
  const [visionTitle, setVisionTitle] = useState("");
  const [visionText, setVisionText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadAbout = async () => {
      try {
        const ref = doc(db, "about", "main");
        const snap = await getDoc(ref);

        if (!active) return;

        if (snap.exists()) {
          const data = snap.data();

          setHeroTitle(data.heroTitle || "");
          setHeroSubtitle(data.heroSubtitle || "");

          setStats(data.stats || []);
          setStory(data.story || []);
          setValues(data.values || []);

          setMissionTitle(data.missionTitle || "");
          setMissionText(data.missionText || "");
          setVisionTitle(data.visionTitle || "");
          setVisionText(data.visionText || "");
        }
      } catch (err) {
        console.error("Error loading About page:", err);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAbout();

    return () => {
      active = false;
    };
  }, []);

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">{heroTitle}</h1>
          <p className="text-lg text-muted-foreground">{heroSubtitle}</p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = ICON_MAP[stat.icon] || Target;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-smooth">
                  <div className="w-12 h-12 rounded-lg gradient-accent mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-muted-foreground">
            {story.map((paragraph, idx) => (
              <p key={idx} className="text-lg">{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-smooth">
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8">
              <div className="w-12 h-12 rounded-lg gradient-primary mb-6 flex items-center justify-center">
                <Target className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{missionTitle}</h3>
              <p className="text-muted-foreground">{missionText}</p>
            </Card>

            <Card className="p-8">
              <div className="w-12 h-12 rounded-lg gradient-accent mb-6 flex items-center justify-center">
                <Award className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{visionTitle}</h3>
              <p className="text-muted-foreground">{visionText}</p>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
