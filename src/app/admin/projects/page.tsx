'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProjectService, ProjectDocument } from '@/services/project/ProjectService';
import { PROJECT_STATUS_CONFIGS, ProjectStatus } from '@/constants/project-status';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  ArrowRight,
  Eye,
  Calendar,
  Building2,
  Trash2,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');

  useEffect(() => {
    async function loadData() {
      try {
        const list = await ProjectService.getProjects();
        setProjects(list);
      } catch (e) {
        console.error('Error fetching projects:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter and sort logic
  const filteredProjects = projects
    .filter((proj) => {
      // 1. Search term check
      const query = searchTerm.toLowerCase();
      const matchSearch =
        proj.projectId.toLowerCase().includes(query) ||
        proj.client.name.toLowerCase().includes(query) ||
        proj.client.email.toLowerCase().includes(query) ||
        proj.business.description.toLowerCase().includes(query) ||
        proj.project.websiteType.toLowerCase().includes(query);

      // 2. Status filter check
      const matchStatus = statusFilter === 'all' || proj.status === statusFilter;

      // 3. Website type filter check
      const matchType = typeFilter === 'all' || proj.project.websiteType === typeFilter;

      return matchSearch && matchStatus && matchType;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tB - tA;
      }
      if (sortBy === 'oldest') {
        const tA = a.createdAt?.seconds || 0;
        const tB = b.createdAt?.seconds || 0;
        return tA - tB;
      }
      if (sortBy === 'alphabetical') {
        return a.client.name.localeCompare(b.client.name);
      }
      return 0;
    });

  const getWebsiteTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Format dates safely
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800" />
        <Skeleton className="h-12 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg" />
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Project Briefs
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Browse and review details of all project briefs. Total: {filteredProjects.length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
        <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <Input
              placeholder="Search by ID, client name, company, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl border-zinc-200 focus-visible:ring-zinc-400 focus-visible:border-zinc-400"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-zinc-400" />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap md:flex-nowrap gap-3 w-full md:w-auto">
            {/* Status Select */}
            <Select onValueChange={(val) => setStatusFilter(val || 'all')} value={statusFilter}>
              <SelectTrigger className="h-11 w-full md:w-40 rounded-xl border-zinc-200 bg-white dark:bg-zinc-950 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.entries(PROJECT_STATUS_CONFIGS).map(([val, conf]) => (
                  <SelectItem key={val} value={val}>
                    {conf.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Type Select */}
            <Select onValueChange={(val) => setTypeFilter(val || 'all')} value={typeFilter}>
              <SelectTrigger className="h-11 w-full md:w-44 rounded-xl border-zinc-200 bg-white dark:bg-zinc-950 text-xs">
                <SelectValue placeholder="Website Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="company_profile">Company Profile</SelectItem>
                <SelectItem value="landing_page">Landing Page</SelectItem>
                <SelectItem value="ecommerce">E-Commerce Store</SelectItem>
                <SelectItem value="web_app">Web Application</SelectItem>
                <SelectItem value="booking">Booking / Reservation</SelectItem>
                <SelectItem value="portfolio">Portfolio</SelectItem>
                <SelectItem value="other">Other / Custom</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select onValueChange={(val) => setSortBy(val || 'newest')} value={sortBy}>
              <SelectTrigger className="h-11 w-full md:w-40 rounded-xl border-zinc-200 bg-white dark:bg-zinc-950 text-xs">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest Submissions</SelectItem>
                <SelectItem value="oldest">Oldest Submissions</SelectItem>
                <SelectItem value="alphabetical">Client Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects List Table */}
      <Card className="rounded-2xl border border-zinc-200/60 shadow-sm bg-white dark:bg-zinc-900 overflow-hidden">
        <CardContent className="p-0">
          {filteredProjects.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 text-xs font-semibold text-zinc-400 bg-zinc-50/50 dark:bg-zinc-900/50">
                    <th className="p-4 pl-6">Project ID</th>
                    <th className="p-4">Client / Company</th>
                    <th className="p-4">Website Type</th>
                    <th className="p-4">Submitted Date</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {filteredProjects.map((proj) => {
                    const statusMeta = PROJECT_STATUS_CONFIGS[proj.status];
                    return (
                      <tr
                        key={proj.id}
                        className="text-xs hover:bg-zinc-50/40 dark:hover:bg-zinc-950/20 transition-colors group"
                      >
                        <td className="p-4 pl-6 font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                          {proj.projectId}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200 leading-normal">
                              {proj.client.name}
                            </span>
                            <span className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
                              <Building2 className="h-3 w-3" /> {proj.business.description.slice(0, 40)}...
                            </span>
                          </div>
                        </td>
                        <td className="p-4 font-medium text-zinc-700 dark:text-zinc-300">
                          {getWebsiteTypeLabel(proj.project.websiteType)}
                        </td>
                        <td className="p-4 font-medium text-zinc-500 tabular-nums">
                          {formatDate(proj.createdAt)}
                        </td>
                        <td className="p-4">
                          <Badge className={`text-[10px] font-semibold rounded-full px-2.5 py-0.5 border ${statusMeta?.color || ''}`}>
                            {statusMeta?.label || proj.status}
                          </Badge>
                        </td>
                        <td className="p-4 text-right pr-6">
                          <Link href={`/admin/projects/${proj.id}`}>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg p-0 hover:bg-zinc-100 dark:hover:bg-zinc-850"
                            >
                              <Eye className="h-4 w-4 text-zinc-500" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 flex flex-col items-center justify-center text-center">
              <div className="p-4 bg-zinc-50 dark:bg-zinc-850 rounded-full text-zinc-400 mb-4">
                <SlidersHorizontal className="h-8 w-8" />
              </div>
              <h4 className="font-bold text-sm">No Projects Found</h4>
              <p className="text-xs text-muted-foreground max-w-xs mt-1.5 leading-normal">
                Try refining your filters, search term, or sorting parameters.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
