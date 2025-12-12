'use client';

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AboutAdmin() {
    const { user, loading: authLoading } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // ---------------------------
    //      ALL ABOUT CONTENT
    // ---------------------------
    const [heroTitle, setHeroTitle] = useState("");
    const [heroSubtitle, setHeroSubtitle] = useState("");

    const [stats, setStats] = useState<{ label: string; value: string; icon: string }[]>([]);
    const [story, setStory] = useState<string[]>([]);
    const [values, setValues] = useState<{ title: string; description: string }[]>([]);

    const [missionTitle, setMissionTitle] = useState("");
    const [missionText, setMissionText] = useState("");

    const [visionTitle, setVisionTitle] = useState("");
    const [visionText, setVisionText] = useState("");

    // ---------------------------
    //   FIRESTORE LOADING
    // ---------------------------
useEffect(() => {
  if (authLoading) return;
  if (!user) {
    setLoading(false);
    return;
  }

  let active = true;

  const load = async () => {
    try {
      const ref = doc(db, "about", "main");

      let snap;
      try {
        snap = await getDoc(ref);
      } catch (err: any) {
        if (err.name === "AbortError") {
          console.log("Firestore getDoc aborted");
          return; // exit early
        } else {
          throw err; // rethrow other errors
        }
      }

      if (!active) return;

      if (snap.exists()) {
        const d = snap.data();
        setHeroTitle(d.heroTitle || "");
        setHeroSubtitle(d.heroSubtitle || "");
        setStats(d.stats || []);
        setStory(d.story || []);
        setValues(d.values || []);
        setMissionTitle(d.missionTitle || "");
        setMissionText(d.missionText || "");
        setVisionTitle(d.visionTitle || "");
        setVisionText(d.visionText || "");
      }
    } catch (err) {
      console.error("LOAD ERROR:", err);
    } finally {
      if (active) setLoading(false);
    }
  };

  load();

  return () => {
    active = false; // prevent state updates after unmount
  };
}, [authLoading, user]);

    // ---------------------------
    //     SAVE CONTENT
    // ---------------------------
    const save = async () => {
        setSaving(true);
        try {
            console.log("Current UID:", user?.uid); // <--- check UID here
            const ref = doc(db, "about", "main");
            await setDoc(ref, {
                heroTitle,
                heroSubtitle,
                stats,
                story,
                values,
                missionTitle,
                missionText,
                visionTitle,
                visionText,
            });
            alert("About page updated!");
        } catch (err: any) {
            console.error("SAVE ERROR:", err);
            alert("Error: " + err.message);
        } finally {
            setSaving(false);
        }
    };


    // ---------------------------
    //     ADMIN PERMISSIONS
    // ---------------------------
    if (authLoading) return <p className="p-10 text-center">Checking login...</p>;
    if (!user) return <p className="p-10 text-center">You are not authorized.</p>;
    if (loading) return <p className="p-10 text-center">Loading...</p>;

    // ---------------------------
    //     FULL ADMIN UI
    // ---------------------------
    return (
        <div className="container mx-auto max-w-3xl py-10 space-y-10">
            <h1 className="text-3xl font-bold">About Page Admin</h1>

            {/* HERO SECTION */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
                <Input
                    placeholder="Main Title"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    className="mb-3"
                />
                <Textarea
                    placeholder="Subtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                />
            </section>

            {/* STATS SECTION */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Stats</h2>
                {stats.map((s, i) => (
                    <div key={i} className="grid grid-cols-3 gap-3 mb-2">
                        <Input
                            placeholder="Label"
                            value={s.label}
                            onChange={(e) => {
                                const clone = [...stats];
                                clone[i].label = e.target.value;
                                setStats(clone);
                            }}
                        />
                        <Input
                            placeholder="Value"
                            value={s.value}
                            onChange={(e) => {
                                const clone = [...stats];
                                clone[i].value = e.target.value;
                                setStats(clone);
                            }}
                        />
                        <Input
                            placeholder="Icon (lucide name)"
                            value={s.icon}
                            onChange={(e) => {
                                const clone = [...stats];
                                clone[i].icon = e.target.value;
                                setStats(clone);
                            }}
                        />
                    </div>
                ))}
                <Button onClick={() => setStats([...stats, { label: "", value: "", icon: "" }])}>
                    + Add Stat
                </Button>
            </section>

            {/* STORY SECTION */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Our Story</h2>
                {story.map((p, i) => (
                    <Textarea
                        key={i}
                        className="mb-3"
                        value={p}
                        onChange={(e) => {
                            const clone = [...story];
                            clone[i] = e.target.value;
                            setStory(clone);
                        }}
                    />
                ))}
                <Button onClick={() => setStory([...story, ""])}>+ Add Paragraph</Button>
            </section>

            {/* CORE VALUES */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Core Values</h2>
                {values.map((v, i) => (
                    <div key={i} className="space-y-2 mb-4">
                        <Input
                            placeholder="Value Title"
                            value={v.title}
                            onChange={(e) => {
                                const clone = [...values];
                                clone[i].title = e.target.value;
                                setValues(clone);
                            }}
                        />
                        <Textarea
                            placeholder="Value Description"
                            value={v.description}
                            onChange={(e) => {
                                const clone = [...values];
                                clone[i].description = e.target.value;
                                setValues(clone);
                            }}
                        />
                    </div>
                ))}
                <Button onClick={() => setValues([...values, { title: "", description: "" }])}>
                    + Add Value
                </Button>
            </section>

            {/* MISSION & VISION */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Mission & Vision</h2>

                <Input
                    placeholder="Mission Title"
                    value={missionTitle}
                    onChange={(e) => setMissionTitle(e.target.value)}
                    className="mb-3"
                />
                <Textarea
                    placeholder="Mission Text"
                    value={missionText}
                    onChange={(e) => setMissionText(e.target.value)}
                    className="mb-6"
                />

                <Input
                    placeholder="Vision Title"
                    value={visionTitle}
                    onChange={(e) => setVisionTitle(e.target.value)}
                    className="mb-3"
                />
                <Textarea
                    placeholder="Vision Text"
                    value={visionText}
                    onChange={(e) => setVisionText(e.target.value)}
                />
            </section>

            <Button className="w-full" onClick={save} disabled={saving}>
                {saving ? "Saving..." : "Save About Page"}
            </Button>
        </div>
    );
}
