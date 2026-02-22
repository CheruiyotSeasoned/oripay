// import { Link } from "react-router-dom";
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";
// import { FileText, ChevronRight } from "lucide-react";

// const sections = [
//   {
//     id: "acceptance",
//     title: "1. Acceptance of Terms",
//     content: `By accessing or using Oripay's platform, mobile application, or any related services (collectively, the "Services"), you agree to be bound by these Terms of Service ("Terms") and our Privacy Policy. If you do not agree to these Terms, please do not use our Services.

// These Terms constitute a legally binding agreement between you and Oripay Financial Services Ltd., a company incorporated under the laws of Kenya ("Oripay," "we," "us," or "our").`,
//   },
//   {
//     id: "eligibility",
//     title: "2. Eligibility",
//     content: `To use Oripay's Services, you must:

// - Be at least 18 years of age (or the age of majority in your jurisdiction).
// - Have the legal capacity to enter into binding contracts.
// - Not be a resident of a country subject to international sanctions.
// - Not have been previously suspended or removed from our platform.
// - Provide accurate, complete, and current information during registration.

// By using our Services, you represent and warrant that you meet all eligibility requirements.`,
//   },
//   {
//     id: "account",
//     title: "3. Account Registration & KYC",
//     content: `**Account Creation:** You must register for an account to use our money transfer services. You are responsible for maintaining the confidentiality of your account credentials.

// **KYC Verification:** As a regulated financial services provider, we are required by law to verify your identity. You agree to provide accurate identification documents and information as requested. Failure to complete KYC verification may result in restricted access to our Services.

// **Account Security:** You are responsible for all activities that occur under your account. Notify us immediately at security@oripay.com if you suspect unauthorized access.

// **One Account Per User:** You may only maintain one active account. Creating multiple accounts may result in suspension of all associated accounts.`,
//   },
//   {
//     id: "services",
//     title: "4. Services",
//     content: `**Money Transfers:** Oripay enables you to send money internationally, subject to applicable limits, exchange rates, and fees disclosed at the time of each transaction.

// **Exchange Rates:** Exchange rates are set by us and may differ from interbank rates. The rate applicable to your transaction will be displayed before you confirm the transfer.

// **Transaction Limits:** Transfers are subject to daily, weekly, and monthly limits based on your account verification level and applicable regulations.

// **Transaction Finality:** Once a transaction is initiated and funds are debited from your account, it may not be possible to cancel or reverse the transfer. Please review all details carefully before confirming.

// **Supported Corridors:** We currently support transfers between Kenya, China, and select other countries. Supported corridors may change without prior notice.`,
//   },
//   {
//     id: "fees",
//     title: "5. Fees & Charges",
//     content: `Oripay charges fees for its Services which will be clearly disclosed before you confirm any transaction. Fees may vary based on:

// - The send and receive countries (corridor).
// - The payment method (mobile money, bank transfer, etc.).
// - The transaction amount.
// - Promotions or special offers applicable at the time.

// By confirming a transaction, you agree to pay all applicable fees. Fees are non-refundable except in cases where Oripay fails to deliver the transfer due to our error.`,
//   },
//   {
//     id: "prohibited",
//     title: "6. Prohibited Activities",
//     content: `You agree not to use our Services for:

// - Money laundering, terrorist financing, or any other illegal activity.
// - Sending funds to sanctioned countries, entities, or individuals.
// - Fraud, identity theft, or impersonation.
// - Purchasing illegal goods or services.
// - Circumventing transaction limits or identity verification.
// - Any activity that violates applicable laws or regulations.

// Violation of this section may result in immediate account suspension, reporting to relevant authorities, and potential legal action.`,
//   },
//   {
//     id: "intellectual-property",
//     title: "7. Intellectual Property",
//     content: `All content, trademarks, logos, software, and intellectual property on the Oripay platform are owned by or licensed to Oripay Financial Services Ltd. You are granted a limited, non-exclusive, non-transferable license to access and use the platform for personal, non-commercial purposes.

// You may not copy, modify, distribute, sell, or lease any part of our Services or included software, nor may you reverse engineer or attempt to extract the source code of our software.`,
//   },
//   {
//     id: "liability",
//     title: "8. Limitation of Liability",
//     content: `To the maximum extent permitted by applicable law, Oripay and its officers, directors, employees, and agents shall not be liable for:

// - Indirect, incidental, special, consequential, or punitive damages.
// - Loss of profits, data, or goodwill.
// - Service interruptions or delays beyond our reasonable control.
// - Actions of third-party payment partners or financial institutions.

// Our total liability to you for any claim arising from or relating to these Terms or the Services shall not exceed the total fees paid by you to Oripay in the 12 months preceding the claim.`,
//   },
//   {
//     id: "termination",
//     title: "9. Termination",
//     content: `**By You:** You may close your account at any time by contacting support@oripay.com. Pending transactions will be processed or cancelled in accordance with our standard procedures.

// **By Oripay:** We reserve the right to suspend or terminate your account at any time if we reasonably believe you have violated these Terms, pose a compliance or fraud risk, or for any other reason at our discretion, with or without prior notice.

// **Effect of Termination:** Upon termination, your right to use the Services ceases. Sections of these Terms that by their nature should survive will survive termination.`,
//   },
//   {
//     id: "governing-law",
//     title: "10. Governing Law & Disputes",
//     content: `These Terms are governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law provisions.

// Any dispute arising from or in connection with these Terms shall first be attempted to be resolved through good-faith negotiation. If unresolved within 30 days, disputes shall be submitted to binding arbitration in Nairobi, Kenya, in accordance with the Nairobi Centre for International Arbitration (NCIA) rules.

// Nothing in this section prevents either party from seeking injunctive or other equitable relief in a court of competent jurisdiction.`,
//   },
//   {
//     id: "changes",
//     title: "11. Changes to Terms",
//     content: `We may modify these Terms at any time. We will provide at least 30 days' notice of material changes via email or in-app notification. Your continued use of the Services after the effective date of changes constitutes your acceptance of the updated Terms.

// We encourage you to review these Terms periodically. If you do not agree to the changes, please discontinue use of our Services and close your account.`,
//   },
//   {
//     id: "contact",
//     title: "12. Contact",
//     content: `For questions about these Terms, please contact us:

// **Email:** legal@oripay.com
// **Address:** Oripay Financial Services Ltd., Westlands, Nairobi, Kenya
// **Phone:** +254 700 000 000`,
//   },
// ];

// const TermsOfService = () => {
//   return (
//     <div className="min-h-screen bg-white dark:bg-gray-950">
//       <Navbar />

//       {/* Hero */}
//       <section className="bg-gradient-to-r from-blue-700 via-purple-600 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-white py-20 px-4">
//         <div className="max-w-4xl mx-auto text-center">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
//             <FileText className="h-8 w-8 text-white" />
//           </div>
//           <h1 className="text-4xl sm:text-5xl font-bold mb-4">Terms of Service</h1>
//           <p className="text-blue-100 text-lg max-w-2xl mx-auto">
//             Please read these terms carefully before using Oripay's money transfer services. They govern your use of our platform.
//           </p>
//           <p className="mt-4 text-sm text-blue-200">Last updated: January 15, 2025 &nbsp;·&nbsp; Effective: February 1, 2025</p>
//         </div>
//       </section>

//       {/* Breadcrumb */}
//       <div className="max-w-6xl mx-auto px-4 py-4">
//         <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
//           <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
//           <ChevronRight className="h-4 w-4" />
//           <span className="text-gray-900 dark:text-white font-medium">Terms of Service</span>
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

//         {/* Main */}
//         <main className="flex-1 min-w-0">
//           <div className="prose prose-gray dark:prose-invert max-w-none">
//             <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-10">
//               Welcome to Oripay. These Terms of Service govern your access to and use of our platform, mobile application, and related financial services. By using Oripay, you agree to these terms.
//             </p>

//             {sections.map((section) => (
//               <section key={section.id} id={section.id} className="mb-12 scroll-mt-8">
//                 <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
//                   {section.title}
//                 </h2>
//                 <div className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-3">
//                   {section.content.split('\n').map((line, i) => {
//                     if (line.startsWith('**') && line.endsWith('**')) {
//                       return <p key={i} className="font-semibold text-gray-800 dark:text-gray-100 mt-4">{line.replace(/\*\*/g, '')}</p>;
//                     }
//                     if (line.startsWith('- **')) {
//                       const parts = line.slice(2).split(':**');
//                       const bold = parts[0].replace(/\*\*/g, '');
//                       const rest = parts.slice(1).join(':**');
//                       return (
//                         <div key={i} className="flex gap-3 mt-2">
//                           <span className="text-blue-500 mt-1 shrink-0">•</span>
//                           <p><span className="font-semibold text-gray-800 dark:text-gray-100">{bold}:</span>{rest}</p>
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
//               <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Privacy Policy →</Link>
//               <Link to="/cookies" className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium">Cookie Policy →</Link>
//             </div>
//           </div>
//         </main>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default TermsOfService;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, ChevronRight, Loader2 } from "lucide-react";
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
          <span className="text-purple-500 mt-1 shrink-0">•</span>
          <p>{line.slice(2)}</p>
        </div>
      );
    return <p key={i}>{line}</p>;
  });

const TermsOfService = () => {
  const [policy, setPolicy] = useState<PolicyDocument | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, "policies", "terms"));
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
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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
            <FileText className="h-8 w-8 text-white" />
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
                  <a href={`#${s.id}`} className="text-sm text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors block py-1 pl-3 border-l-2 border-transparent hover:border-purple-500">
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

          <div className="mt-12 p-6 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-100 dark:border-purple-900">
            <p className="font-semibold text-gray-900 dark:text-white mb-3">Related Policies</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/privacy" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">Privacy Policy →</Link>
              <Link to="/cookies" className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium">Cookie Policy →</Link>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;