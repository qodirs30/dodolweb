'use client';

import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ProjectDocument, UploadItem } from '../project/ProjectService';
import { PROJECT_STATUS_CONFIGS } from '@/constants/project-status';

// Register a clean sans-serif font family if needed, otherwise use Helvetica/Courier/Times defaults
// which are built into PDF format and guaranteed to work without extra network weight.

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 10,
    lineHeight: 1.5,
    padding: 40,
    color: '#18181b', // zinc-900
    backgroundColor: '#ffffff',
  },
  // Cover Page
  coverContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  coverHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f5',
    paddingBottom: 20,
  },
  brandLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#09090b',
  },
  docType: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#71717a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  coverBody: {
    marginVertical: 'auto',
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#09090b',
    lineHeight: 1.2,
  },
  coverSubtitle: {
    fontSize: 14,
    color: '#52525b',
    marginTop: 10,
    lineHeight: 1.4,
  },
  coverMetaGrid: {
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 30,
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  metaItem: {
    width: '45%',
    marginBottom: 15,
  },
  metaLabel: {
    fontSize: 8,
    color: '#a1a1aa',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.8,
  },
  metaValue: {
    fontSize: 11,
    color: '#18181b',
    fontWeight: 'bold',
    marginTop: 4,
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    paddingTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: '#a1a1aa',
  },

  // Main Page Styles
  sectionHeader: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#09090b',
    paddingBottom: 6,
    marginTop: 25,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#09090b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  col12: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  col6: {
    width: '50%',
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 8,
    color: '#71717a',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: 10,
    color: '#18181b',
    marginTop: 3,
  },
  bulletList: {
    marginTop: 5,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletDot: {
    width: 12,
    fontSize: 10,
    color: '#09090b',
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: '#27272a',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTopWidth: 1,
    borderTopColor: '#f4f4f5',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    color: '#a1a1aa',
  },
  bold: {
    fontWeight: 'bold',
  },
});

interface PdfTemplateProps {
  project: ProjectDocument;
  aiAnalysis: any | null;
  uploads: UploadItem[];
}

export const ProjectBriefPdfDocument: React.FC<PdfTemplateProps> = ({
  project,
  aiAnalysis,
  uploads,
}) => {
  const getWebsiteTypeLabel = (type: string) => {
    return type?.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '—';
  };

  const formattedDate = new Date(project.submittedAt?.seconds * 1000 || Date.now()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const activeUploads = uploads.filter((u) => !u.deleted);

  return (
    <Document>
      {/* PAGE 1: COVER PAGE */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverContainer}>
          <View style={styles.coverHeader}>
            <Text style={styles.brandLogo}>qRSEngine</Text>
            <Text style={styles.docType}>Project Specification Brief</Text>
          </View>

          <View style={styles.coverBody}>
            <Text style={styles.coverTitle}>
              {project.business.description.slice(0, 45) || 'Website Project Brief'}
            </Text>
            <Text style={styles.coverSubtitle}>
              A comprehensive technical and functional requirement outline.
            </Text>

            <View style={styles.coverMetaGrid}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Project ID</Text>
                <Text style={styles.metaValue}>{project.projectId}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Client Company</Text>
                <Text style={styles.metaValue}>{project.client.company}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Website Type</Text>
                <Text style={styles.metaValue}>{getWebsiteTypeLabel(project.project.websiteType)}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Estimated Budget</Text>
                <Text style={styles.metaValue}>{project.project.budget}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Date Submitted</Text>
                <Text style={styles.metaValue}>{formattedDate}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Status</Text>
                <Text style={styles.metaValue}>
                  {PROJECT_STATUS_CONFIGS[project.status]?.label || project.status}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.coverFooter}>
            <Text>Confidential • Prepared for {project.client.name}</Text>
            <Text>Page 1 of 3</Text>
          </View>
        </View>
      </Page>

      {/* PAGE 2: CLIENT BRIEF DETAILS */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>01. Client & Business Details</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.col6}>
            <Text style={styles.metaLabel}>Primary Client Name</Text>
            <Text style={styles.fieldValue}>{project.client.name}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={styles.metaLabel}>Primary Email / Phone</Text>
            <Text style={styles.fieldValue}>{project.client.email} / {project.client.phone}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={styles.metaLabel}>Business Sector</Text>
            <Text style={styles.fieldValue}>{project.business.category}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={styles.metaLabel}>Company Size & Location</Text>
            <Text style={styles.fieldValue}>{project.business.companySize || '1-10'} people • {project.business.location}</Text>
          </View>
          <View style={styles.col12}>
            <Text style={styles.metaLabel}>Business Overview</Text>
            <Text style={styles.fieldValue}>{project.business.description}</Text>
          </View>
          {project.business.mapsLink && (
            <View style={styles.col12}>
              <Text style={styles.metaLabel}>Google Maps Link</Text>
              <Text style={styles.fieldValue}>{project.business.mapsLink}</Text>
            </View>
          )}
          {(project.business.instagram || project.business.tiktok || project.business.facebook) && (
            <View style={styles.col12}>
              <Text style={styles.metaLabel}>Social Media Links</Text>
              <Text style={styles.fieldValue}>
                {[
                  project.business.instagram && `Instagram: ${project.business.instagram}`,
                  project.business.tiktok && `TikTok: ${project.business.tiktok}`,
                  project.business.facebook && `Facebook: ${project.business.facebook}`,
                ].filter(Boolean).join(' • ')}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>02. Features & Design Preferences</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.col12}>
            <Text style={styles.metaLabel}>Requested Features List</Text>
            <Text style={styles.fieldValue}>{project.features.selected?.join(', ') || 'None selected'}</Text>
          </View>
          {project.features.custom && (
            <View style={styles.col12}>
              <Text style={styles.metaLabel}>Custom Integrations Requested</Text>
              <Text style={styles.fieldValue}>{project.features.custom}</Text>
            </View>
          )}
          <View style={styles.col6}>
            <Text style={styles.metaLabel}>Preferred Design Styles</Text>
            <Text style={styles.fieldValue}>{project.design.style?.join(', ') || 'None selected'}</Text>
          </View>
          <View style={styles.col6}>
            <Text style={styles.metaLabel}>Animation preference</Text>
            <Text style={styles.fieldValue}>{project.design.animations || 'Subtle'}</Text>
          </View>
          {project.design.references && (
            <View style={styles.col12}>
              <Text style={styles.metaLabel}>Reference Websites</Text>
              <Text style={styles.fieldValue}>{project.design.references}</Text>
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Confidential • WPB Project ID: {project.projectId}</Text>
          <Text>Page 2 of 3</Text>
        </View>
      </Page>

      {/* PAGE 3: AI ANALYSIS & ASSETS CHECKLIST */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>03. AI Requirement Analysis</Text>
        </View>

        {aiAnalysis ? (
          <View style={{ gap: 15 }}>
            <View>
              <Text style={styles.metaLabel}>Executive Analysis Summary</Text>
              <Text style={styles.fieldValue}>{aiAnalysis.summary || aiAnalysis.businessOverview}</Text>
            </View>

            <View style={styles.grid}>
              <View style={styles.col6}>
                <Text style={styles.metaLabel}>Project Complexity</Text>
                <Text style={styles.fieldValue}>{aiAnalysis.complexity || 'Medium'}</Text>
              </View>
              <View style={styles.col6}>
                <Text style={styles.metaLabel}>Estimated Duration</Text>
                <Text style={styles.fieldValue}>{aiAnalysis.estimatedDuration || 20} Working Days</Text>
              </View>
            </View>

            {aiAnalysis.riskAnalysis && aiAnalysis.riskAnalysis.length > 0 && (
              <View>
                <Text style={styles.metaLabel}>Identified Risks</Text>
                <View style={styles.bulletList}>
                  {aiAnalysis.riskAnalysis.slice(0, 4).map((risk: string, idx: number) => (
                    <View key={idx} style={styles.bulletItem}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{risk}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {aiAnalysis.followUpQuestions && aiAnalysis.followUpQuestions.length > 0 && (
              <View>
                <Text style={styles.metaLabel}>Questions for Onboarding Follow-up</Text>
                <View style={styles.bulletList}>
                  {aiAnalysis.followUpQuestions.slice(0, 4).map((q: string, idx: number) => (
                    <View key={idx} style={styles.bulletItem}>
                      <Text style={styles.bulletDot}>{idx + 1}.</Text>
                      <Text style={styles.bulletText}>{q}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={{ fontStyle: 'italic', color: '#a1a1aa' }}>AI analysis was not performed on this brief.</Text>
          </View>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>04. Uploaded Assets & Google Drive Link</Text>
        </View>

        {project.answers?.assets_drive_link && (
          <View style={{ marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid #f4f4f5' }}>
            <Text style={styles.metaLabel}>Google Drive Link (Aset Logo & Foto)</Text>
            <Text style={styles.fieldValue}>{project.answers.assets_drive_link}</Text>
          </View>
        )}

        {activeUploads.length > 0 ? (
          <View style={styles.bulletList}>
            {activeUploads.map((file, idx) => (
              <View key={file.id || idx} style={styles.bulletItem}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>
                  {file.fileName} ({(file.size / 1024 / 1024).toFixed(2)} MB) • Category: {file.category}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ fontStyle: 'italic', color: '#a1a1aa' }}>No assets uploaded with this submission.</Text>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Confidential • WPB Project ID: {project.projectId}</Text>
          <Text>Page 3 of 3</Text>
        </View>
      </Page>
    </Document>
  );
};
