'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, ShieldCheck, Zap, Sparkles, Files, HelpCircle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (item: string) => {
    setOpenFaq(openFaq === item ? null : item);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full glass dark:dark-glass border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" className="h-8 w-8 object-contain rounded-lg" alt="Logo" />
            <span className="font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              qRSEngine
            </span>
          </Link>
          <Link href="/start">
            <Button size="sm" className="rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
              Start Brief <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-20 md:py-32 max-w-4xl text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 text-xs font-semibold mb-6 border border-blue-100 dark:border-blue-900/50">
          <Sparkles className="h-3.5 w-3.5" /> AI-Assisted Project Briefing
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Website Project Brief
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-6 leading-relaxed max-w-2xl">
          Help us understand your business and project goals. The more complete your answers are, the better solution we can build.
        </p>

        <div className="flex items-center gap-4 mt-8 text-sm text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-zinc-400" />
            <span>Takes 10–15 Minutes</span>
          </div>
          <span className="text-zinc-300">•</span>
          <div className="flex items-center gap-1">
            <ShieldCheck className="h-4 w-4 text-zinc-400" />
            <span>Progress Autosaved</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto justify-center">
          <Link href="/start">
            <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200">
              Start Project Brief <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <a href="#how-it-works">
            <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-full border-zinc-200 dark:border-zinc-800">
              How It Works
            </Button>
          </a>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white dark:bg-zinc-900 border-y border-zinc-200/40 dark:border-zinc-800/40">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16 text-zinc-900 dark:text-zinc-50">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center p-6 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 premium-shadow">
              <div className="h-10 w-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="font-semibold text-lg">Fill Project Brief</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Complete a guided, step-by-step form detailing your business, requirements, branding, and assets.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center p-6 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 premium-shadow">
              <div className="h-10 w-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="font-semibold text-lg">AI Analyzes Brief</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Our Gemini AI instantly processes your input, estimates complexity, pages, features, and outlines potential risks.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center p-6 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-2xl border border-zinc-100 dark:border-zinc-800/60 premium-shadow">
              <div className="h-10 w-10 rounded-full bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="font-semibold text-lg">Proposal Generation</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                The agency reviews the structured data and contacts you with a precise quotation and timeline to kick off.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-16 text-zinc-900 dark:text-zinc-50">
            Why Use This Brief?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex gap-4 p-5 rounded-2xl border border-zinc-200/50 bg-white/50 dark:bg-zinc-900/30 dark:border-zinc-800/50 premium-shadow">
              <div className="p-2.5 h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Save Client Time</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">
                  No hours spent typing long descriptions on WhatsApp. Click and fill structured inputs.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-zinc-200/50 bg-white/50 dark:bg-zinc-900/30 dark:border-zinc-800/50 premium-shadow">
              <div className="p-2.5 h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Better Estimation</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">
                  Detailed questions prevent surprise scopes, leading to a much more accurate timeline.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-zinc-200/50 bg-white/50 dark:bg-zinc-900/30 dark:border-zinc-800/50 premium-shadow">
              <div className="p-2.5 h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Less Misunderstanding</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">
                  Visual selections make styling, typography, and functional expectations perfectly clear.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-zinc-200/50 bg-white/50 dark:bg-zinc-900/30 dark:border-zinc-800/50 premium-shadow">
              <div className="p-2.5 h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Faster Proposal</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">
                  Structured briefs are processed directly by our managers, reducing quoting times to hours.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border border-zinc-200/50 bg-white/50 dark:bg-zinc-900/30 dark:border-zinc-800/50 premium-shadow">
              <div className="p-2.5 h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Files className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Organized Assets</h4>
                <p className="text-xs text-muted-foreground mt-1 leading-normal">
                  Upload logos, branding guides, and references in one single place. No expired chat media.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-zinc-900 border-t border-zinc-200/40 dark:border-zinc-800/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex items-center justify-center gap-2 mb-4 text-zinc-500">
            <HelpCircle className="h-5 w-5 text-zinc-400" />
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-center text-sm text-muted-foreground mb-12">
            Everything you need to know about our project briefing process.
          </p>

          <div className="w-full divide-y divide-zinc-200/50 dark:divide-zinc-800/50">
            {/* FAQ 1 */}
            <div className="py-4">
              <button
                onClick={() => toggleFaq('faq-1')}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                <span>What is a Website Project Brief?</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200", openFaq === 'faq-1' && "rotate-180")} />
              </button>
              {openFaq === 'faq-1' && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  It is an interactive guide designed to collect specific business details, visual preferences, files, and functional specifications. It replaces unstructured chats so that we can immediately understand your project scope and deliver an accurate proposal.
                </p>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="py-4">
              <button
                onClick={() => toggleFaq('faq-2')}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                <span>How long does it take to complete?</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200", openFaq === 'faq-2' && "rotate-180")} />
              </button>
              {openFaq === 'faq-2' && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  It typically takes about 10 to 15 minutes, depending on the complexity of your requirements and whether you already have assets (like logos or guides) ready to upload.
                </p>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="py-4">
              <button
                onClick={() => toggleFaq('faq-3')}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                <span>Can I save my progress and continue later?</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200", openFaq === 'faq-3' && "rotate-180")} />
              </button>
              {openFaq === 'faq-3' && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Yes! Every change is saved automatically in your browser's local storage. If you accidentally close the tab or wish to finish it later, simply open the page on the same browser and your inputs will be fully restored.
                </p>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="py-4">
              <button
                onClick={() => toggleFaq('faq-4')}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                <span>What happens after I submit?</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200", openFaq === 'faq-4' && "rotate-180")} />
              </button>
              {openFaq === 'faq-4' && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Your submitted details are securely stored. Our built-in Google Gemini AI analyzes the details to recommend site pages, tech integrations, and timeline details. An agency project manager will then review the findings and reach out to you with a formal quote.
                </p>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="py-4">
              <button
                onClick={() => toggleFaq('faq-5')}
                className="flex w-full items-center justify-between text-left text-sm font-semibold text-zinc-900 dark:text-zinc-50 hover:underline"
              >
                <span>Is my uploaded data safe?</span>
                <ChevronDown className={cn("h-4 w-4 text-zinc-500 transition-transform duration-200", openFaq === 'faq-5' && "rotate-180")} />
              </button>
              {openFaq === 'faq-5' && (
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  Absolutely. All information, documents, and assets submitted through this tool are uploaded directly to our secure Firebase Cloud Storage and kept strictly confidential.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-zinc-50 dark:bg-zinc-950 border-t border-zinc-200/50 dark:border-zinc-900/60">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} qRSEngine. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin" className="hover:text-zinc-800 dark:hover:text-zinc-200 font-semibold">
              Admin Workspace Login
            </Link>
            <span className="text-zinc-300">|</span>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-200">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-800 dark:hover:text-zinc-200">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
