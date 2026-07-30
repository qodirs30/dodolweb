'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectService, ProjectDocument } from '@/services/project/ProjectService';
import { PROJECT_STATUS_CONFIGS, ProjectStatus } from '@/constants/project-status';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  PlusCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export default function AdminDashboardOverview() {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await ProjectService.getProjects();
        setProjects(list);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Failed to retrieve projects.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Calculate dynamic stats
  const total = projects.length;
  const countByStatus = (status: ProjectStatus) => projects.filter((p) => p.status === status).length;

  const stats = [
    {
      label: 'Submitted Briefs',
      value: countByStatus('submitted'),
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20',
      description: 'New client submissions',
    },
    {
      label: 'Under Review',
      value: countByStatus('review') + countByStatus('quotation'),
      icon: Clock,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
      description: 'Analysis and proposals',
    },
    {
      label: 'Active Development',
      value: countByStatus('development') + countByStatus('approved') + countByStatus('revision'),
      icon: Layers,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
      description: 'Websites in progress',
    },
    {
      label: 'Completed Projects',
      value: countByStatus('completed'),
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
      description: 'Successfully launched',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <Skeleton className="h-8 w-64 bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="h-4 w-96 mt-2 bg-zinc-200 dark:bg-zinc-800" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="col-span-2 h-[450px] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
          <Skeleton className="col-span-1 h-[450px] rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>
    );
  }

  const latestProjects = projects.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Agency Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
          Monitor incoming project briefs, analyze workloads, and track production.
        </p>
      </div>

      {error && (
        <AlertCircle className="h-5 w-5 text-red-500" /> // Alert design could be loaded here
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
              <CardContent className="p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">{stat.label}</span>
                  <div className={`p-2.5 rounded-xl shrink-0 ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 tabular-nums">
                    {stat.value}
                  </h3>
                  <p className="text-[10px] text-muted-foreground mt-1 leading-normal">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dashboard Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Submissions Panel */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-zinc-400" /> Recent Submissions
            </h2>
            <Link href="/admin/projects">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-blue-500 hover:text-blue-600">
                View All <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardContent className="p-0">
              {latestProjects.length > 0 ? (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {latestProjects.map((proj) => {
                    const statusMeta = PROJECT_STATUS_CONFIGS[proj.status];
                    return (
                      <div
                        key={proj.id}
                        className="p-5 flex items-center justify-between hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-all"
                      >
                        <div className="flex flex-col gap-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">
                              {proj.business.description.slice(0, 30) || proj.projectId}
                            </span>
                            <Badge className="text-[9px] font-semibold tabular-nums uppercase bg-zinc-100 text-zinc-600 border border-zinc-200 dark:bg-zinc-850 dark:text-zinc-400">
                              {proj.projectId}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                              {proj.client.name}
                            </span>
                            <span>•</span>
                            <span>{proj.project.websiteType.replace('_', ' ')}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Badge className={`text-[10px] font-semibold rounded-full px-2.5 py-0.5 border ${statusMeta?.color || ''}`}>
                            {statusMeta?.label || proj.status}
                          </Badge>
                          <Link href={`/admin/projects/${proj.id}`}>
                            <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs font-semibold px-3">
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center">
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 mb-4">
                    <Briefcase className="h-8 w-8" />
                  </div>
                  <h4 className="font-bold text-sm">No Projects Submitted Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-normal">
                    When clients complete the onboarding wizard, their project briefs will show up here.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Agency Quick Actions & Metrics Distribution */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-zinc-400" /> Workflows
          </h2>
          
          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex flex-col gap-2.5">
              <Link href="/start" target="_blank">
                <Button variant="outline" className="w-full h-10 justify-start gap-2.5 rounded-lg border-zinc-200 text-xs font-semibold">
                  <PlusCircle className="h-4.5 w-4.5 text-zinc-500" />
                  <span>Open Client Wizard</span>
                </Button>
              </Link>
              <Link href="/admin/projects">
                <Button variant="outline" className="w-full h-10 justify-start gap-2.5 rounded-lg border-zinc-200 text-xs font-semibold">
                  <Layers className="h-4.5 w-4.5 text-zinc-500" />
                  <span>Manage All Project Briefs</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
            <CardHeader className="p-5 pb-3">
              <CardTitle className="text-sm font-semibold">Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 flex flex-col gap-3">
              {['submitted', 'review', 'quotation', 'development', 'completed'].map((status) => {
                const count = countByStatus(status as ProjectStatus);
                const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                const config = PROJECT_STATUS_CONFIGS[status as ProjectStatus];

                return (
                  <div key={status} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">{config?.label}</span>
                      <span className="font-semibold tabular-nums text-zinc-500">{count} ({percentage}%)</span>
                    </div>
                    <Progress value={percentage} className="h-1.5" />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
