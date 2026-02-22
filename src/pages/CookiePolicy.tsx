// import { Link } from "react-router-dom";
// import { useState } from "react";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Cookie, ChevronRight, ToggleLeft, ToggleRight } from "lucide-react";

// const cookieTypes = [
//   {
//     id: "essential",
//     name: "Essential Cookies",
//     required: true,
//     description: "These cookies are necessary for the platform to function and cannot be disabled. They are usually set in response to actions you take such as logging in, making a payment, or filling in forms.",
//     examples: [
//       { name: "session_id", purpose: "Maintains your login session securely.", duration: "Session" },
//       { name: "csrf_token", purpose: "Protects against cross-site request forgery attacks.", duration: "Session" },
//       { name: "auth_token", purpose: "Authenticates your identity after login.", duration: "30 days" },
//     ],
//   },
//   {
//     id: "functional",
//     name: "Functional Cookies",
//     required: false,
//     description: "These cookies enable enhanced functionality and personalization, such as remembering your preferred language, currency, or recently used corridors.",
//     examples: [
//       { name: "user_lang", purpose: "Stores your preferred language setting.", duration: "1 year" },
//       { name: "user_currency", purpose: "Remembers your preferred display currency.", duration: "1 year" },
//       { name: "dark_mode", purpose: "Remembers your theme preference.", duration: "1 year" },
//     ],
//   },
//   {
//     id: "analytics",
//     name: "Analytics Cookies",
//     required: false,
//     description: "These cookies help us understand how visitors interact with our platform by collecting and reporting information anonymously. This helps us improve performance and user experience.",
//     examples: [
//       { name: "_ga", purpose: "Google Analytics — distinguishes unique users.", duration: "2 years" },
//       { name: "_gid", purpose: "Google Analytics — stores page view data.", duration: "24 hours" },
//       { name: "mixpanel_id", purpose: "Tracks feature usage and user flows.", duration: "1 year" },
//     ],
//   },
//   {
//     id: "marketing",
//     name: "Marketing Cookies",
//     required: false,
//     description: "These cookies track your browsing activity to help us deliver more relevant advertisements. We do not sell this data to third parties.",
//     examples: [
//       { name: "_fbp", purpose: "Facebook Pixel — tracks conversions from ads.", duration: "3 months" },
//       { name: "gads", purpose: "Google Ads — measures ad effectiveness.", duration: "13 months" },
//     ],
//   },
// ];

// const sections = [
//   {
//     id: "what-are-cookies",
//     title: "1. What Are Cookies?",
//     content: `Cookies are small text files placed on your device (computer, smartphone, or tablet) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give site owners useful information about how their platform is used.

// Cookies set by the website owner (in this case, Oripay) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies may be used for advertising, analytics, or other purposes.`,
//   },
//   {
//     id: "how-we-use",
//     title: "2. How We Use Cookies",
//     content: `Oripay uses cookies to:

// - Keep you securely logged in to your account.
// - Remember your preferences and settings.
// - Understand how you use our platform so we can improve it.
// - Detect and prevent fraud and security threats.
// - Measure the effectiveness of our marketing campaigns (with your consent).`,
//   },
//   {
//     id: "third-party",
//     title: "3. Third-Party Cookies",
//     content: `Some cookies on our platform are set by third-party services we use. These include:

// **Google Analytics:** Used to analyze website traffic and usage patterns. Data is anonymized and aggregated. See Google's privacy policy at policies.google.com.

// **Mixpanel:** Used for product analytics to understand feature adoption. Data is used solely to improve our product.

// **Facebook Pixel (optional):** Used to measure the effectiveness of our advertising campaigns, with your consent.

// These third parties have their own privacy policies governing their use of information. We encourage you to review their policies.`,
//   },
//   {
//     id: "managing",
//     title: "4. Managing Your Cookie Preferences",
//     content: `You have the right to accept or reject non-essential cookies. You can manage your preferences:

// **Via Our Cookie Banner:** When you first visit Oripay, you will be presented with a cookie consent banner allowing you to accept or customize your preferences.

// **Via Your Browser:** Most browsers allow you to refuse or delete cookies through their settings. Note that disabling cookies may affect the functionality of our platform.

// **Via the Preference Center Below:** Use the toggles in the preference center on this page to update your choices at any time.

// Please note that Essential Cookies cannot be disabled as they are necessary for the platform to operate.`,
//   },
//   {
//     id: "changes",
//     title: "5. Updates to This Policy",
//     content: `We may update this Cookie Policy from time to time. Changes will be reflected on this page with an updated effective date. Where required, we will obtain your consent for any new cookies.`,
//   },
//   {
//     id: "contact",
//     title: "6. Contact Us",
//     content: `For questions about our use of cookies, contact us at:

// **Email:** privacy@oripay.com
// **Address:** Oripay Financial Services Ltd., Westlands, Nairobi, Kenya`,
//   },
// ];

// const CookiePolicy = () => {
//   const [preferences, setPreferences] = useState<Record<string, boolean>>({
//     functional: true,
//     analytics: false,
//     marketing: false,
//   });
//   const [saved, setSaved] = useState(false);

//   const toggle = (id: string) => {
//     setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
//     setSaved(false);
//   };

//   const savePreferences = () => {
//     setSaved(true);
//   };

//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950">
//       <Navbar />

//       {/* Hero */}
//       <section className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
//             <Cookie className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4">Cookie Policy</h1>
//           <p className="text-blue-100 text-lg max-w-2xl mx-auto">
//             We use cookies to improve your experience. Here's everything you need to know about the cookies we use and how to manage them.
//           </p>
//           <p className="mt-4 text-sm text-blue-200">Last updated: January 15, 2025 &nbsp;·&nbsp; Effective: February 1, 2025</p>
//         </div>
//       </section>

//       {/* Breadcrumb */}
//       <div className="max-w-6xl mx-auto px-4 py-4">
//         <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//           <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
//           <ChevronRight className="h-4 w-4" />
//           <span className="text-gray-900 dark:text-white font-medium">Cookie Policy</span>
//         </nav>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12">

//         {/* Sidebar TOC */}
//         <aside className="hidden lg:block w-64 shrink-0">
//           <div className="sticky top-8 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
//             <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Contents</p>
//             <ul className="space-y-2">
//               {sections.map((s) => (
//                 <li key={s.id}>
//                   <a
//                     href={`#${s.id}`}
//                     className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-blue-500"
//                   >
//                     {s.title}
//                   </a>
//                 </li>
//               ))}
//               <li>
//                 <a href="#types" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-blue-500">
//                   Cookie Types & Details
//                 </a>
//               </li>
//               <li>
//                 <a href="#preferences" className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-blue-500">
//                   Your Preferences
//                 </a>
//               </li>
//             </ul>
//           </div>
//         </aside>

//         {/* Main */}
//         <main className="flex-1 min-w-0">
//           <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
//             This Cookie Policy explains how Oripay Financial Services Ltd. uses cookies and similar tracking technologies when you use our platform. It also explains your choices regarding cookies.
//           </p>

//           {/* Policy sections */}
//           {sections.map((section) => (
//             <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
//               <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
//                 {section.title}
//               </h2>
//               <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
//                 {section.content.split('\n').map((line, i) => {
//                   if (line.startsWith('**') && line.endsWith('**')) {
//                     return <p key={i} className="font-semibold text-gray-800 dark:text-gray-100 mt-4">{line.replace(/\*\*/g, '')}</p>;
//                   }
//                   if (line.startsWith('**')) {
//                     const [bold, ...rest] = line.split(':**');
//                     return <p key={i}><span className="font-semibold text-gray-800 dark:text-gray-100">{bold.replace(/\*\*/g, '')}:</span>{rest.join(':**')}</p>;
//                   }
//                   if (line.startsWith('- ')) {
//                     return (
//                       <div key={i} className="flex gap-3 mt-1">
//                         <span className="text-blue-500 mt-1 shrink-0">•</span>
//                         <p>{line.slice(2)}</p>
//                       </div>
//                     );
//                   }
//                   if (line.trim() === '') return null;
//                   return <p key={i}>{line}</p>;
//                 })}
//               </div>
//             </section>
//           ))}

//           {/* Cookie types table */}
//           <section id="types" className="mb-12 scroll-mt-8">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
//               Cookie Types & Details
//             </h2>
//             <div className="space-y-8">
//               {cookieTypes.map((type) => (
//                 <div key={type.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
//                   <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 flex items-center justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-900 dark:text-white">{type.name}</h3>
//                       <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{type.description}</p>
//                     </div>
//                     {type.required && (
//                       <span className="ml-4 shrink-0 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
//                         Always Active
//                       </span>
//                     )}
//                   </div>
//                   <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                       <thead>
//                         <tr className="border-t border-gray-200 dark:border-gray-700">
//                           <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Cookie Name</th>
//                           <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Purpose</th>
//                           <th className="text-left px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Duration</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {type.examples.map((cookie, i) => (
//                           <tr key={i} className="border-t border-gray-100 dark:border-gray-800">
//                             <td className="px-6 py-3 font-mono text-blue-600 dark:text-blue-400">{cookie.name}</td>
//                             <td className="px-6 py-3 text-gray-600 dark:text-gray-300">{cookie.purpose}</td>
//                             <td className="px-6 py-3 text-gray-500 dark:text-gray-400">{cookie.duration}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* Preference center */}
//           <section id="preferences" className="mb-12 scroll-mt-8">
//             <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
//               Your Preferences
//             </h2>
//             <p className="text-gray-600 dark:text-gray-300 mb-6">
//               Manage your cookie preferences below. Essential cookies are always enabled as they are required for the platform to function.
//             </p>
//             <div className="space-y-4">
//               {cookieTypes.map((type) => (
//                 <div
//                   key={type.id}
//                   className="flex items-center justify-between p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
//                 >
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white">{type.name}</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 max-w-md">
//                       {type.required ? "Required for the platform to function." : type.description.split('.')[0] + "."}
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => !type.required && toggle(type.id)}
//                     disabled={type.required}
//                     className={`ml-4 shrink-0 transition-colors ${type.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
//                     aria-label={`Toggle ${type.name}`}
//                   >
//                     {type.required || preferences[type.id] ? (
//                       <ToggleRight className="h-8 w-8 text-blue-600 dark:text-blue-400" />
//                     ) : (
//                       <ToggleLeft className="h-8 w-8 text-gray-400" />
//                     )}
//                   </button>
//                 </div>
//               ))}
//             </div>
//             <div className="mt-6 flex items-center gap-4">
//               <button
//                 onClick={savePreferences}
//                 className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
//               >
//                 Save Preferences
//               </button>
//               {saved && (
//                 <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Preferences saved</span>
//               )}
//             </div>
//           </section>

//           {/* Related links */}
//           <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900">
//             <p className="font-semibold text-gray-900 dark:text-white mb-3">Related Policies</p>
//             <div className="flex flex-wrap gap-4">
//               <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Privacy Policy →</Link>
//               <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Terms of Service →</Link>
//             </div>
//           </div>
//         </main>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default CookiePolicy;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Cookie, ChevronRight, Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

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

const renderContent = (content: string) =>
  content.split("\n").map((line, i) => {
    if (!line.trim()) return null;
    if (line.startsWith("- "))
      return (
        <div key={i} className="flex gap-3 mt-1">
          <span className="text-amber-500 mt-1 shrink-0">•</span>
          <p>{line.slice(2)}</p>
        </div>
      );
    return <p key={i}>{line}</p>;
  });

const cookiePreferences = [
  { id: "essential", name: "Essential Cookies", required: true, description: "Required for the platform to function." },
  { id: "functional", name: "Functional Cookies", required: false, description: "Enables personalization and preference memory." },
  { id: "analytics", name: "Analytics Cookies", required: false, description: "Helps us understand how you use our platform." },
  { id: "marketing", name: "Marketing Cookies", required: false, description: "Used to measure advertising effectiveness." },
];

const CookiePolicy = () => {
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState<Record<string, boolean>>({
    functional: true,
    analytics: false,
    marketing: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "policies", "cookies"));
        if (snap.exists()) setPolicy(snap.data() as PolicyDocument);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggle = (id: string) => {
    setPreferences((prev) => ({ ...prev, [id]: !prev[id] }));
    setSaved(false);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
      </div>
    );

  if (!policy)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Policy content not available.
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      <section className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <Cookie className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{policy.title}</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">{policy.subtitle}</p>
          <p className="mt-4 text-sm text-blue-200">
            Last updated: {policy.lastUpdated} &nbsp;·&nbsp; Effective: {policy.effectiveDate}
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 dark:text-white font-medium">{policy.title}</span>
        </nav>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24 flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-8 bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-4">Contents</p>
            <ul className="space-y-2">
              {policy.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-amber-500">
                    {s.title}
                  </a>
                </li>
              ))}
              <li>
                <a href="#preferences" className="text-sm text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-amber-500">
                  Your Preferences
                </a>
              </li>
            </ul>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          {policy.sections.map((section) => (
            <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                {section.title}
              </h2>
              <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
                {renderContent(section.content)}
              </div>
            </section>
          ))}

          {/* Preference Centre */}
          <section id="preferences" className="mb-12 scroll-mt-8">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
              Your Preferences
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Manage your cookie preferences below. Essential cookies are always enabled.
            </p>
            <div className="space-y-4">
              {cookiePreferences.map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{pref.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{pref.description}</p>
                  </div>
                  <button
                    onClick={() => !pref.required && toggle(pref.id)}
                    disabled={pref.required}
                    className={`ml-4 shrink-0 transition-colors ${pref.required ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    {pref.required || preferences[pref.id] ? (
                      <ToggleRight className="h-8 w-8 text-amber-500 dark:text-amber-400" />
                    ) : (
                      <ToggleLeft className="h-8 w-8 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center gap-4">
              <button onClick={() => setSaved(true)} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors">
                Save Preferences
              </button>
              {saved && <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Preferences saved</span>}
            </div>
          </section>

          <div className="mt-12 p-6 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-100 dark:border-amber-900">
            <p className="font-semibold text-gray-900 dark:text-white mb-3">Related Policies</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium">Privacy Policy →</Link>
              <Link to="/terms" className="text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium">Terms of Service →</Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default CookiePolicy;