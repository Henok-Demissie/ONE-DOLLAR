import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for One Dollar Project.',
};

export default function TermsPage() {
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
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Terms of Service</h1>
            <p className="text-xs text-gray-500">Last updated: November 2026</p>
          </div>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">1. Acceptance of Terms</h2>
            <p>
              By accessing or using One Dollar Project, you agree to these Terms of Service and our
              Donation Policy. If you do not agree, please discontinue use of the site.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">2. Voluntary Contributions — No Equity or Returns</h2>
            <p>
              All contributions made through the donation flow are strictly voluntary personal gifts
              to support the creator&apos;s work and journey. Donations do not represent an
              investment, security, loan, or purchase of equity, tokens, profit-sharing, or financial
              returns of any kind.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">3. Cryptocurrency Risks</h2>
            <p>
              Cryptocurrency transfers are irreversible and subject to network fees, confirmation
              delays, and market volatility. You are solely responsible for verifying the destination
              wallet address and selecting the matching blockchain network (BNB Smart Chain BEP-20)
              before sending funds. Sending assets on an unsupported network may result in permanent loss of funds.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">4. Freelance &amp; Consulting Services</h2>
            <p>
              Submitting a request via the Hire Me form constitutes an inquiry only and does not
              form a binding contract until a separate written agreement or statement of work is
              mutually executed.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-[#0DCB3D]">5. Limitation of Liability</h2>
            <p>
              This platform is provided &ldquo;as is&rdquo; without warranties of any kind. To the
              maximum extent permitted by law, One Dollar Project and its creator shall not be liable
              for any indirect, incidental, or consequential damages arising from site usage or
              blockchain network failures.
            </p>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
