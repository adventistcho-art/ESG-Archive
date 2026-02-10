import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBudget(amount: number | null | undefined): string {
  if (!amount) return '-';
  if (amount >= 100000000) {
    return `${(amount / 100000000).toFixed(1)}억원`;
  }
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(0)}만원`;
  }
  return `${amount.toLocaleString()}원`;
}

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    ENVIRONMENT: 'Environment',
    SOCIAL: 'Social',
    GOVERNANCE: 'Governance',
  };
  return labels[category] || category;
}

export function getCategoryKorean(category: string): string {
  const labels: Record<string, string> = {
    ENVIRONMENT: '환경',
    SOCIAL: '사회',
    GOVERNANCE: '거버넌스',
  };
  return labels[category] || category;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    ENVIRONMENT: 'esg-tag-environment',
    SOCIAL: 'esg-tag-social',
    GOVERNANCE: 'esg-tag-governance',
  };
  return colors[category] || '';
}

export function getCategoryAccentColor(category: string): string {
  const colors: Record<string, string> = {
    ENVIRONMENT: '#10b981',
    SOCIAL: '#3b82f6',
    GOVERNANCE: '#8b5cf6',
  };
  return colors[category] || '#6b7280';
}
