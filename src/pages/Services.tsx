'use client';

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// Import ALL lucide icons once (safe in browser)
import * as LucideIcons from "lucide-react";

// ------------ FIXED TYPES BASED ON YOUR FIRESTORE DATA -----------

interface Feature {
  id: string;
  title: string;
}

interface Service {
  id: string;
  name: string;         // Firestore has name, not title
  description: string;
  icon: string;
  features: Feature[];  // array of objects { id, title }
  active: boolean;
}

// ---------------------------------------------------------------

const Services = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const snap = await getDocs(collection(db, "services"));

        const data = snap.docs.map(doc => {
          const raw = doc.data();

          return {
            id: doc.id,
            name: raw.name || "",
            description: raw.description || "",
            icon: raw.icon || "CreditCard",
            features: Array.isArray(raw.features) ? raw.features : [],
            active: raw.active ?? true
          } as Service;
        });

        setServices(data.filter(s => s.active));
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        Loading services...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive financial services designed to connect you with the world.
            Fast, secure, and always transparent.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {services.map((service) => {
              const IconComponent =
                (LucideIcons as any)[service.icon] || LucideIcons.CreditCard;

              return (
                <Card
                  key={service.id}
                  className="p-8 hover:shadow-xl transition-smooth hover:border-accent/50"
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-6 shadow-glow">
                    <IconComponent className="h-7 w-7 text-primary-foreground" />
                  </div>

                  <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                  <p className="text-muted-foreground mb-6">{service.description}</p>

                  {/* ----- FIXED FEATURES RENDERING ----- */}
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature) => (
                      <li key={feature.id} className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                        <span className="text-sm">{feature.title}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/register">
                    <Button className="w-full" variant="outline">
                      Get Started
                    </Button>
                  </Link>
                </Card>
              );
            })}

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[ 
              {
                step: "01",
                title: "Sign Up",
                description: "Create your free account and complete quick KYC verification",
              },
              {
                step: "02",
                title: "Add Funds",
                description: "Deposit money using mobile money, bank transfer, or card",
              },
              {
                step: "03",
                title: "Send Money",
                description: "Choose your recipient and send money instantly worldwide",
              },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full gradient-accent mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-accent-foreground">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Experience Seamless Transfers?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join Oripay today and enjoy fast, secure, and affordable money transfers
          </p>
          <Link to="/register">
            <Button size="lg" className="gradient-primary shadow-glow text-lg px-8">
              Open Your Account Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
