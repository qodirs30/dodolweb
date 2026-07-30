'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/services/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const { login, user, loading, isAdmin } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && user && isAdmin) {
      router.push('/admin');
    }
  }, [user, loading, isAdmin, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      await login(email, password);
      router.push('/admin');
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.message || 'Authentication failed. Please check your credentials.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center p-6">
      <Card className="w-full max-w-md rounded-2xl border border-zinc-200/60 shadow-lg bg-white dark:bg-zinc-900 overflow-hidden">
        <CardHeader className="space-y-2 text-center pb-4 pt-8">
          <div className="mx-auto h-10 w-10 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 flex items-center justify-center font-bold text-lg mb-2">
            Ω
          </div>
          <CardTitle className="text-xl font-bold tracking-tight">Admin Portal</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Sign in to access your agency dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-zinc-700">Email Address</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@agency.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-zinc-200 focus-visible:ring-zinc-400 focus-visible:border-zinc-400"
                  required
                />
                <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-zinc-700">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-11 rounded-lg border-zinc-200 focus-visible:ring-zinc-400 focus-visible:border-zinc-400"
                  required
                />
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
              </div>
            </div>

            {errorMsg && (
              <Alert variant="destructive" className="rounded-xl p-3">
                <AlertDescription className="text-xs font-medium leading-relaxed">
                  {errorMsg}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full h-11 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 font-semibold text-sm transition-all flex items-center justify-center gap-1.5 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Log In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
