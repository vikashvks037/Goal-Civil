'use client';
import { ENDPOINTS } from '@/constants';
import { useState, useEffect } from 'react';
import { Newspaper, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import { PageHeader, EmptyState, SearchFilterBar } from '@/shared/components';
import { CurrentAffairsManager } from '@/features/admin/components/CurrentAffairsManager';

export default function AdminCurrentAffairsPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Current Affairs"
        subtitle="Manage articles and daily updates"
      />
      <CurrentAffairsManager />
    </div>
  );
}
