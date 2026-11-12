import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for One Dollar Project.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 max-w-4xl py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[#0DCB3D] hover:underline mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Card className="p-8 md:p-12 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Privacy Policy</h1>
            <p className="text-xs text-gray-500">Last updated: November 2026</p>
          </div>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">1. Information We Collect</h2>
            <p>
              When you make a voluntary donation or submit a hire request on One Dollar Project,
              we only collect information you explicitly provide: your name (or alias), email
              address (optional for donations, required for hire inquiries), support message,
              selected payment currency/network, and submitted blockchain transaction hash.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">2. Anonymous Donations</h2>
            <p>
              If you enable the &ldquo;Donate anonymously&rdquo; toggle during checkout, your name
              is withheld from the public Supporters Wall and displayed as Anonymous or excluded from
              public listings.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">3. How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-gray-400">
              <li>To verify cryptocurrency transactions and update campaign progress metrics.</li>
              <li>To send optional donation confirmation emails when an email address is provided.</li>
              <li>To respond to project and consulting inquiries submitted via the Hire Me form.</li>
              <li>To prevent spam, duplicate transaction submissions, and abuse via basic IP rate limiting.</li>
            </ul>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">4. Data Sharing &amp; Storage</h2>
            <p>
              We never sell, rent, or trade your personal information. Data is stored securely in
              Supabase (PostgreSQL) with restricted administrative access. Public blockchain
              transactions are inherently public on their respective ledgers.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">5. Your Rights</h2>
            <p>
              You may request removal of your name or message from the public Supporters Wall or
              deletion of your contact details at any time by reaching out via the contact email
              listed on this platform.
            </p>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
