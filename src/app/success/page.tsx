'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Calendar, FileText, ArrowLeft, Mail, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SuccessPage() {
  const [submittedBrief, setSubmittedBrief] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('last_submitted_brief');
        if (saved) {
          setSubmittedBrief(JSON.parse(saved));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const businessName = submittedBrief?.business_name || 'your company';

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50/50 dark:bg-zinc-950 items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-xl text-center flex flex-col items-center gap-6"
      >
        {/* Animated Checkmark */}
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-full border border-emerald-100 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-16 w-16" />
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
          Brief Submitted Successfully!
        </h1>

        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Thank you for completing the briefing wizard for <span className="font-semibold text-zinc-800 dark:text-zinc-200">{businessName}</span>. 
          Your information is now securely uploaded.
        </p>

        {/* Timeline Next Steps */}
        <Card className="w-full rounded-2xl border border-zinc-200/60 shadow-sm overflow-hidden text-left bg-white dark:bg-zinc-900 mt-2">
          <CardContent className="p-6 flex flex-col gap-5">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">What happens next?</h3>
            
            <div className="flex gap-4">
              <div className="p-2 h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">AI Requirement Analysis</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                  Our system is currently analyzing your brief. We generate recommendations on pages, CMS needs, budget feasibility, and technical risks.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2 h-8 w-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">Agency Review</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                  An agency solution architect will audit your brief and match the AI suggestions against real-world timelines.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="p-2 h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-xs text-zinc-800 dark:text-zinc-200">Proposal & Consultation</h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-normal">
                  We will contact you via WhatsApp or Email within 24 hours to schedule a walkthrough and present our quotation.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-center mt-4">
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto h-11 px-6 rounded-full border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Return Home
            </Button>
          </Link>
          <a href="mailto:hello@acme.com" className="w-full sm:w-auto">
            <Button className="w-full h-11 px-6 rounded-full bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold text-xs">
              <Mail className="mr-1.5 h-4 w-4" /> Contact Support
            </Button>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
