// import { Link } from "react-router-dom";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { Shield, ChevronRight } from "lucide-react";

// const sections = [
//   {
//     id: "information-we-collect",
//     title: "1. Information We Collect",
//     content: `We collect information you provide directly to us, such as when you create an account, initiate a transaction, or contact us for support. This includes:

// **Personal Identification:** Full name, date of birth, nationality, and government-issued ID details required for KYC (Know Your Customer) compliance.

// **Contact Information:** Email address, phone number, and residential address.

// **Financial Information:** Bank account details, mobile money wallet numbers, and transaction history necessary to process your payments.

// **Device & Usage Data:** IP address, browser type, operating system, pages visited, and interaction patterns to improve our service and detect fraud.

// **Communications:** Records of your correspondence with our support team.`,
//   },
//   {
//     id: "how-we-use",
//     title: "2. How We Use Your Information",
//     content: `Oripay uses the information we collect to:

// - **Process Transactions:** Execute your money transfers accurately and securely.
// - **Verify Identity:** Comply with Anti-Money Laundering (AML) and KYC regulations across all jurisdictions we operate in.
// - **Communicate With You:** Send transaction confirmations, receipts, security alerts, and service updates.
// - **Improve Our Platform:** Analyze usage patterns to enhance performance, reliability, and user experience.
// - **Prevent Fraud:** Monitor transactions for suspicious activity and protect you and our platform.
// - **Legal Compliance:** Meet regulatory obligations imposed by financial authorities in Kenya, China, and other operating regions.`,
//   },
//   {
//     id: "sharing",
//     title: "3. Information Sharing",
//     content: `We do not sell your personal information. We may share your data with:

// **Payment Partners:** Banks, mobile money operators, and correspondent financial institutions required to complete your transfer.

// **Regulatory Authorities:** Government bodies and financial regulators as required by law (e.g., CBK, PBOC).

// **Service Providers:** Trusted third-party vendors who assist us with infrastructure, fraud detection, and customer support — all bound by confidentiality agreements.

// **Corporate Transactions:** In the event of a merger, acquisition, or asset sale, your information may be transferred to the successor entity.

// We will notify you before your personal information is transferred and becomes subject to a different privacy policy.`,
//   },
//   {
//     id: "data-security",
//     title: "4. Data Security",
//     content: `We implement industry-standard security measures to protect your information:

// - **Encryption:** All data is encrypted in transit using TLS 1.3 and at rest using AES-256.
// - **Access Controls:** Strict role-based access ensures only authorized personnel can access sensitive data.
// - **Two-Factor Authentication:** Available and encouraged for all user accounts.
// - **Regular Audits:** We conduct periodic security assessments and penetration testing.

// While we strive to protect your personal information, no method of transmission over the Internet is 100% secure. We encourage you to use a strong, unique password and enable 2FA on your account.`,
//   },
//   {
//     id: "data-retention",
//     title: "5. Data Retention",
//     content: `We retain your personal information for as long as your account is active or as needed to provide services. We also retain and use your information as necessary to:

// - Comply with legal obligations (financial records are typically retained for 7 years under Kenyan law).
// - Resolve disputes and enforce our agreements.
// - Fulfill regulatory reporting requirements.

// You may request deletion of your account and associated data, subject to our legal retention obligations.`,
//   },
//   {
//     id: "your-rights",
//     title: "6. Your Rights",
//     content: `Depending on your jurisdiction, you may have the right to:

// - **Access:** Request a copy of the personal data we hold about you.
// - **Correction:** Request correction of inaccurate or incomplete data.
// - **Deletion:** Request deletion of your personal data, subject to legal obligations.
// - **Portability:** Receive your data in a structured, machine-readable format.
// - **Objection:** Object to certain types of processing, including direct marketing.
// - **Withdrawal of Consent:** Where processing is based on consent, you may withdraw it at any time.

// To exercise any of these rights, contact us at **privacy@oripay.com**.`,
//   },
//   {
//     id: "cookies",
//     title: "7. Cookies",
//     content: `We use cookies and similar tracking technologies to enhance your experience. Please refer to our Cookie Policy for full details on what cookies we use, why, and how to manage your preferences.`,
//   },
//   {
//     id: "changes",
//     title: "8. Changes to This Policy",
//     content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on our platform at least 30 days before the changes take effect. Your continued use of Oripay after the effective date constitutes acceptance of the updated policy.`,
//   },
//   {
//     id: "contact",
//     title: "9. Contact Us",
//     content: `If you have questions or concerns about this Privacy Policy or our data practices, please contact our Data Protection Officer:

// **Email:** privacy@oripay.com
// **Address:** Oripay Financial Services Ltd., Westlands, Nairobi, Kenya
// **Phone:** +254 700 000 000`,
//   },
// ];

// const PrivacyPolicy = () => {
//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950">
//       <Navbar />

//       {/* Hero */}
//       <section className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
//             <Shield className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4">Privacy Policy</h1>
//           <p className="text-blue-100 text-lg max-w-2xl mx-auto">
//             Your privacy matters to us. This policy explains how Oripay collects, uses, and protects your personal information.
//           </p>
//           <p className="mt-4 text-sm text-blue-200">Last updated: January 15, 2025 &nbsp;·&nbsp; Effective: February 1, 2025</p>
//         </div>
//       </section>

//       {/* Breadcrumb */}
//       <div className="max-w-6xl mx-auto px-4 py-4">
//         <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//           <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
//           <ChevronRight className="h-4 w-4" />
//           <span className="text-gray-900 dark:text-white font-medium">Privacy Policy</span>
//         </nav>
//       </div>

//       {/* Content */}
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
//             </ul>
//           </div>
//         </aside>

//         {/* Main content */}
//         <main className="flex-1 min-w-0">
//           <div className="prose prose-gray dark:prose-invert max-w-none">
//             <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
//               Oripay Financial Services Ltd. ("Oripay," "we," "us," or "our") is committed to protecting your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you use our money transfer platform and related services.
//             </p>

//             {sections.map((section) => (
//               <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
//                   {section.title}
//                 </h2>
//                 <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line space-y-3">
//                   {section.content.split('\n').map((line, i) => {
//                     if (line.startsWith('**') && line.endsWith('**')) {
//                       return <p key={i} className="font-semibold text-gray-800 dark:text-gray-100 mt-4">{line.replace(/\*\*/g, '')}</p>;
//                     }
//                     if (line.startsWith('- **')) {
//                       const [bold, ...rest] = line.slice(2).split(':**');
//                       return (
//                         <div key={i} className="flex gap-3 mt-2">
//                           <span className="text-blue-500 mt-1 shrink-0">•</span>
//                           <p><span className="font-semibold text-gray-800 dark:text-gray-100">{bold.replace(/\*\*/g, '')}:</span>{rest.join(':**')}</p>
//                         </div>
//                       );
//                     }
//                     if (line.startsWith('- ')) {
//                       return (
//                         <div key={i} className="flex gap-3 mt-1">
//                           <span className="text-blue-500 mt-1 shrink-0">•</span>
//                           <p>{line.slice(2)}</p>
//                         </div>
//                       );
//                     }
//                     if (line.trim() === '') return null;
//                     return <p key={i}>{line}</p>;
//                   })}
//                 </div>
//               </section>
//             ))}
//           </div>

//           {/* Related links */}
//           <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900">
//             <p className="font-semibold text-gray-900 dark:text-white mb-3">Related Policies</p>
//             <div className="flex flex-wrap gap-4">
//               <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Terms of Service →</Link>
//               <Link to="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Cookie Policy →</Link>
//             </div>
//           </div>
//         </main>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default PrivacyPolicy;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Shield, ChevronRight, Loader2 } from "lucide-react";
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
          <span className="text-blue-500 mt-1 shrink-0">•</span>
          <p>{line.slice(2)}</p>
        </div>
      );
    return <p key={i}>{line}</p>;
  });

const PrivacyPolicy = () => {
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "policies", "privacy"));
        if (snap.exists()) setPolicy(snap.data() as PolicyDocument);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
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
            <Shield className="h-8 w-8 text-white" />
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
                  <a href={`#${s.id}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-blue-500">
                    {s.title}
                  </a>
                </li>
              ))}
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

          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900">
            <p className="font-semibold text-gray-900 dark:text-white mb-3">Related Policies</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Terms of Service →</Link>
              <Link to="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Cookie Policy →</Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;