import Link from 'next/link';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card } from '@/components/ui/Card';

export const metadata = {
  title: 'Donation Policy',
  description: 'Voluntary Donation Policy for One Dollar Project.',
};

export default function DonationPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 md:px-6 max-w-4xl py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 mb-6"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <Card className="p-8 md:p-12 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Donation Policy</h1>
            <p className="text-xs text-gray-500">Last updated: November 2026</p>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-400 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200 leading-relaxed">
              <strong>Important Notice:</strong> All donations are 100% voluntary, non-refundable,
              and carry no expectation of equity, goods, services, or financial return.
            </p>
          </div>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-amber-400">1. Nature of Contributions</h2>
            <p>
              Donations made on One Dollar Project are personal, voluntary gifts supporting the
              creator&apos;s ongoing software engineering, AI research, and product development
              journey. Contributors do not receive ownership, shares, voting rights, or guaranteed
              deliverables in return for donations.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-amber-400">2. Non-Refundable Policy</h2>
            <p>
              Because contributions are sent directly via irreversible cryptocurrency networks
              (BTC, ETH, USDT-TRC20, USDT-ERC20, BNB), all completed donations are final and
              non-refundable. Please double-check the exact wallet address, network, and amount
              before confirming any transfer.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-amber-400">3. Verification &amp; Supporters Wall</h2>
            <p>
              After sending crypto, donors may submit their transaction hash (TxID) for faster
              verification. Donations remain in &ldquo;pending&rdquo; status until confirmed on the
              blockchain and verified by an administrator. Verified non-anonymous donations appear on
              the public Supporters Wall.
            </p>
          </section>

          <section className="space-y-3 text-sm text-gray-300 leading-relaxed">
            <h2 className="text-lg font-bold text-amber-400">4. Tax Deductibility</h2>
            <p>
              One Dollar Project is not a registered 501(c)(3) charity or tax-exempt nonprofit
              organization. Donations are generally not tax-deductible; consult a qualified tax
              advisor in your jurisdiction if needed.
            </p>
          </section>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
