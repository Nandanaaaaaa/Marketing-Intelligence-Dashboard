export interface FacebookData {
  date: string;
  tactic: string;
  state: string;
  campaign: string;
  impressions: number;
  clicks: number;
  spend: number;
  attributed_revenue: number;
}

export interface GoogleData {
  date: string;
  tactic: string;
  state: string;
  campaign: string;
  impressions: number;
  clicks: number;
  spend: number;
  attributed_revenue: number;
}

export interface TikTokData {
  date: string;
  tactic: string;
  state: string;
  campaign: string;
  impressions: number;
  clicks: number;
  spend: number;
  attributed_revenue: number;
}

export interface BusinessData {
  date: string;
  orders: number;
  new_orders: number;
  new_customers: number;
  total_revenue: number;
  gross_profit: number;
  cogs: number;
}

export interface CombinedData {
  date: string;
  state: string;
  // Marketing metrics by platform
  facebook: {
    spend: number;
    impressions: number;
    clicks: number;
    attributed_revenue: number;
    campaigns: number;
    tactics: string[];
  };
  google: {
    spend: number;
    impressions: number;
    clicks: number;
    attributed_revenue: number;
    campaigns: number;
    tactics: string[];
  };
  tiktok: {
    spend: number;
    impressions: number;
    clicks: number;
    attributed_revenue: number;
    campaigns: number;
    tactics: string[];
  };
  // Business metrics
  business: {
    orders: number;
    new_orders: number;
    new_customers: number;
    total_revenue: number;
    gross_profit: number;
    cogs: number;
  };
  // Derived metrics
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalAttributedRevenue: number;
  totalRevenue: number;
  totalProfit: number;
  roas: number; // Return on Ad Spend
  cpc: number; // Cost Per Click
  cpm: number; // Cost Per Mille
  ctr: number; // Click Through Rate
  profitMargin: number;
  customerAcquisitionCost: number;
  revenuePerOrder: number;
  newCustomerRate: number;
  marketingEfficiency: number; // Attributed Revenue / Total Spend
}

export interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  platforms: string[];
  states: string[];
  tactics: string[];
  campaigns: string[];
  minSpend: number;
  maxSpend: number;
}

export interface InsightData {
  type: 'success' | 'warning' | 'danger' | 'info';
  title: string;
  description: string;
  recommendation: string;
  impact: 'high' | 'medium' | 'low';
  metric?: string;
  value?: number;
}