import { FacebookData, GoogleData, TikTokData, BusinessData, CombinedData, InsightData } from '../types';

export const combineData = (
  facebookData: FacebookData[],
  googleData: GoogleData[],
  tiktokData: TikTokData[],
  businessData: BusinessData[]
): CombinedData[] => {
  const combinedMap = new Map<string, any>();

  // Initialize combined data structure
  const initializeEntry = (date: string, state: string) => ({
    date,
    state,
    facebook: { 
      spend: 0, impressions: 0, clicks: 0, attributed_revenue: 0, 
      campaigns: 0, tactics: [] as string[] 
    },
    google: { 
      spend: 0, impressions: 0, clicks: 0, attributed_revenue: 0, 
      campaigns: 0, tactics: [] as string[] 
    },
    tiktok: { 
      spend: 0, impressions: 0, clicks: 0, attributed_revenue: 0, 
      campaigns: 0, tactics: [] as string[] 
    },
    business: { 
      orders: 0, new_orders: 0, new_customers: 0, 
      total_revenue: 0, gross_profit: 0, cogs: 0 
    }
  });

  // Process Facebook data
  facebookData.forEach(item => {
    const key = `${item.date}-${item.state}`;
    if (!combinedMap.has(key)) {
      combinedMap.set(key, initializeEntry(item.date, item.state));
    }
    const entry = combinedMap.get(key);
    entry.facebook.spend += item.spend;
    entry.facebook.impressions += item.impressions;
    entry.facebook.clicks += item.clicks;
    entry.facebook.attributed_revenue += item.attributed_revenue;
    entry.facebook.campaigns += 1;
    if (!entry.facebook.tactics.includes(item.tactic)) {
      entry.facebook.tactics.push(item.tactic);
    }
  });

  // Process Google data
  googleData.forEach(item => {
    const key = `${item.date}-${item.state}`;
    if (!combinedMap.has(key)) {
      combinedMap.set(key, initializeEntry(item.date, item.state));
    }
    const entry = combinedMap.get(key);
    entry.google.spend += item.spend;
    entry.google.impressions += item.impressions;
    entry.google.clicks += item.clicks;
    entry.google.attributed_revenue += item.attributed_revenue;
    entry.google.campaigns += 1;
    if (!entry.google.tactics.includes(item.tactic)) {
      entry.google.tactics.push(item.tactic);
    }
  });

  // Process TikTok data
  tiktokData.forEach(item => {
    const key = `${item.date}-${item.state}`;
    if (!combinedMap.has(key)) {
      combinedMap.set(key, initializeEntry(item.date, item.state));
    }
    const entry = combinedMap.get(key);
    entry.tiktok.spend += item.spend;
    entry.tiktok.impressions += item.impressions;
    entry.tiktok.clicks += item.clicks;
    entry.tiktok.attributed_revenue += item.attributed_revenue;
    entry.tiktok.campaigns += 1;
    if (!entry.tiktok.tactics.includes(item.tactic)) {
      entry.tiktok.tactics.push(item.tactic);
    }
  });

  // Process Business data - aggregate by date only (not by state)
  const businessByDate = new Map<string, BusinessData>();
  businessData.forEach(item => {
    businessByDate.set(item.date, item);
  });

  // Add business data to all state entries for each date
  combinedMap.forEach((entry, key) => {
    const businessEntry = businessByDate.get(entry.date);
    if (businessEntry) {
      // Distribute business metrics proportionally by state marketing spend
      const totalMarketingSpend = entry.facebook.spend + entry.google.spend + entry.tiktok.spend;
      const distributionFactor = totalMarketingSpend > 0 ? totalMarketingSpend / 1000 : 0.1; // Normalize distribution
      
      entry.business = {
        orders: Math.round(businessEntry.orders * distributionFactor),
        new_orders: Math.round(businessEntry.new_orders * distributionFactor),
        new_customers: Math.round(businessEntry.new_customers * distributionFactor),
        total_revenue: Math.round(businessEntry.total_revenue * distributionFactor * 100) / 100,
        gross_profit: Math.round(businessEntry.gross_profit * distributionFactor * 100) / 100,
        cogs: Math.round(businessEntry.cogs * distributionFactor * 100) / 100
      };
    }
  });

  // Calculate derived metrics
  return Array.from(combinedMap.values()).map(entry => {
    const totalSpend = entry.facebook.spend + entry.google.spend + entry.tiktok.spend;
    const totalImpressions = entry.facebook.impressions + entry.google.impressions + entry.tiktok.impressions;
    const totalClicks = entry.facebook.clicks + entry.google.clicks + entry.tiktok.clicks;
    const totalAttributedRevenue = entry.facebook.attributed_revenue + entry.google.attributed_revenue + entry.tiktok.attributed_revenue;
    const totalRevenue = entry.business.total_revenue;
    const totalProfit = entry.business.gross_profit;

    return {
      ...entry,
      totalSpend: Math.round(totalSpend * 100) / 100,
      totalImpressions,
      totalClicks,
      totalAttributedRevenue: Math.round(totalAttributedRevenue * 100) / 100,
      totalRevenue,
      totalProfit,
      roas: totalSpend > 0 ? Math.round((totalAttributedRevenue / totalSpend) * 100) / 100 : 0,
      cpc: totalClicks > 0 ? Math.round((totalSpend / totalClicks) * 100) / 100 : 0,
      cpm: totalImpressions > 0 ? Math.round((totalSpend / totalImpressions * 1000) * 100) / 100 : 0,
      ctr: totalImpressions > 0 ? Math.round((totalClicks / totalImpressions * 100) * 100) / 100 : 0,
      profitMargin: totalRevenue > 0 ? Math.round((totalProfit / totalRevenue * 100) * 100) / 100 : 0,
      customerAcquisitionCost: entry.business.new_customers > 0 ? Math.round((totalSpend / entry.business.new_customers) * 100) / 100 : 0,
      revenuePerOrder: entry.business.orders > 0 ? Math.round((totalRevenue / entry.business.orders) * 100) / 100 : 0,
      newCustomerRate: entry.business.orders > 0 ? Math.round((entry.business.new_customers / entry.business.orders * 100) * 100) / 100 : 0,
      marketingEfficiency: totalSpend > 0 ? Math.round((totalAttributedRevenue / totalSpend) * 100) / 100 : 0
    };
  });
};

export const aggregateByDate = (data: CombinedData[]): CombinedData[] => {
  const dateMap = new Map<string, CombinedData>();

  data.forEach(item => {
    if (!dateMap.has(item.date)) {
      dateMap.set(item.date, {
        date: item.date,
        state: 'All',
        facebook: { spend: 0, impressions: 0, clicks: 0, attributed_revenue: 0, campaigns: 0, tactics: [] },
        google: { spend: 0, impressions: 0, clicks: 0, attributed_revenue: 0, campaigns: 0, tactics: [] },
        tiktok: { spend: 0, impressions: 0, clicks: 0, attributed_revenue: 0, campaigns: 0, tactics: [] },
        business: { orders: 0, new_orders: 0, new_customers: 0, total_revenue: 0, gross_profit: 0, cogs: 0 },
        totalSpend: 0,
        totalImpressions: 0,
        totalClicks: 0,
        totalAttributedRevenue: 0,
        totalRevenue: 0,
        totalProfit: 0,
        roas: 0,
        cpc: 0,
        cpm: 0,
        ctr: 0,
        profitMargin: 0,
        customerAcquisitionCost: 0,
        revenuePerOrder: 0,
        newCustomerRate: 0,
        marketingEfficiency: 0
      });
    }

    const existing = dateMap.get(item.date)!;
    
    // Aggregate Facebook data
    existing.facebook.spend += item.facebook.spend;
    existing.facebook.impressions += item.facebook.impressions;
    existing.facebook.clicks += item.facebook.clicks;
    existing.facebook.attributed_revenue += item.facebook.attributed_revenue;
    existing.facebook.campaigns += item.facebook.campaigns;
    item.facebook.tactics.forEach(tactic => {
      if (!existing.facebook.tactics.includes(tactic)) {
        existing.facebook.tactics.push(tactic);
      }
    });
    
    // Aggregate Google data
    existing.google.spend += item.google.spend;
    existing.google.impressions += item.google.impressions;
    existing.google.clicks += item.google.clicks;
    existing.google.attributed_revenue += item.google.attributed_revenue;
    existing.google.campaigns += item.google.campaigns;
    item.google.tactics.forEach(tactic => {
      if (!existing.google.tactics.includes(tactic)) {
        existing.google.tactics.push(tactic);
      }
    });
    
    // Aggregate TikTok data
    existing.tiktok.spend += item.tiktok.spend;
    existing.tiktok.impressions += item.tiktok.impressions;
    existing.tiktok.clicks += item.tiktok.clicks;
    existing.tiktok.attributed_revenue += item.tiktok.attributed_revenue;
    existing.tiktok.campaigns += item.tiktok.campaigns;
    item.tiktok.tactics.forEach(tactic => {
      if (!existing.tiktok.tactics.includes(tactic)) {
        existing.tiktok.tactics.push(tactic);
      }
    });
    
    // Aggregate business data
    existing.business.orders += item.business.orders;
    existing.business.new_orders += item.business.new_orders;
    existing.business.new_customers += item.business.new_customers;
    existing.business.total_revenue += item.business.total_revenue;
    existing.business.gross_profit += item.business.gross_profit;
    existing.business.cogs += item.business.cogs;
    
    // Aggregate totals
    existing.totalSpend += item.totalSpend;
    existing.totalImpressions += item.totalImpressions;
    existing.totalClicks += item.totalClicks;
    existing.totalAttributedRevenue += item.totalAttributedRevenue;
    existing.totalRevenue += item.totalRevenue;
    existing.totalProfit += item.totalProfit;
  });

  // Recalculate derived metrics
  return Array.from(dateMap.values()).map(item => ({
    ...item,
    roas: item.totalSpend > 0 ? Math.round((item.totalAttributedRevenue / item.totalSpend) * 100) / 100 : 0,
    cpc: item.totalClicks > 0 ? Math.round((item.totalSpend / item.totalClicks) * 100) / 100 : 0,
    cpm: item.totalImpressions > 0 ? Math.round((item.totalSpend / item.totalImpressions * 1000) * 100) / 100 : 0,
    ctr: item.totalImpressions > 0 ? Math.round((item.totalClicks / item.totalImpressions * 100) * 100) / 100 : 0,
    profitMargin: item.totalRevenue > 0 ? Math.round((item.totalProfit / item.totalRevenue * 100) * 100) / 100 : 0,
    customerAcquisitionCost: item.business.new_customers > 0 ? Math.round((item.totalSpend / item.business.new_customers) * 100) / 100 : 0,
    revenuePerOrder: item.business.orders > 0 ? Math.round((item.totalRevenue / item.business.orders) * 100) / 100 : 0,
    newCustomerRate: item.business.orders > 0 ? Math.round((item.business.new_customers / item.business.orders * 100) * 100) / 100 : 0,
    marketingEfficiency: item.totalSpend > 0 ? Math.round((item.totalAttributedRevenue / item.totalSpend) * 100) / 100 : 0
  }));
};

export const generateInsights = (data: CombinedData[]): InsightData[] => {
  if (data.length === 0) return [];

  const insights: InsightData[] = [];
  
  // Calculate averages and trends
  const avgROAS = data.reduce((sum, item) => sum + item.roas, 0) / data.length;
  const avgCPC = data.reduce((sum, item) => sum + item.cpc, 0) / data.length;
  const avgProfitMargin = data.reduce((sum, item) => sum + item.profitMargin, 0) / data.length;
  const totalSpend = data.reduce((sum, item) => sum + item.totalSpend, 0);
  const totalRevenue = data.reduce((sum, item) => sum + item.totalRevenue, 0);
  
  // Platform performance analysis
  const platformSpend = {
    Facebook: data.reduce((sum, item) => sum + item.facebook.spend, 0),
    Google: data.reduce((sum, item) => sum + item.google.spend, 0),
    TikTok: data.reduce((sum, item) => sum + item.tiktok.spend, 0)
  };
  
  const platformROAS = {
    Facebook: data.reduce((sum, item) => sum + (item.facebook.spend > 0 ? item.facebook.attributed_revenue / item.facebook.spend : 0), 0) / data.filter(item => item.facebook.spend > 0).length,
    Google: data.reduce((sum, item) => sum + (item.google.spend > 0 ? item.google.attributed_revenue / item.google.spend : 0), 0) / data.filter(item => item.google.spend > 0).length,
    TikTok: data.reduce((sum, item) => sum + (item.tiktok.spend > 0 ? item.tiktok.attributed_revenue / item.tiktok.spend : 0), 0) / data.filter(item => item.tiktok.spend > 0).length
  };

  const bestPlatform = Object.entries(platformROAS).sort((a, b) => b[1] - a[1])[0];
  const worstPlatform = Object.entries(platformROAS).sort((a, b) => a[1] - b[1])[0];

  // ROAS Performance Insight
  if (avgROAS >= 3) {
    insights.push({
      type: 'success',
      title: 'Excellent ROAS Performance',
      description: `Your average ROAS of ${avgROAS.toFixed(2)}x indicates strong marketing efficiency across all channels.`,
      recommendation: 'Consider scaling successful campaigns and reallocating budget from underperforming channels.',
      impact: 'high',
      metric: 'ROAS',
      value: avgROAS
    });
  } else if (avgROAS >= 2) {
    insights.push({
      type: 'info',
      title: 'Good ROAS Performance',
      description: `Your average ROAS of ${avgROAS.toFixed(2)}x shows healthy returns, with room for optimization.`,
      recommendation: 'Focus on improving conversion rates and reducing cost per acquisition.',
      impact: 'medium',
      metric: 'ROAS',
      value: avgROAS
    });
  } else {
    insights.push({
      type: 'warning',
      title: 'ROAS Needs Improvement',
      description: `Your average ROAS of ${avgROAS.toFixed(2)}x is below optimal levels.`,
      recommendation: 'Review targeting, creative performance, and landing page optimization immediately.',
      impact: 'high',
      metric: 'ROAS',
      value: avgROAS
    });
  }

  // Platform Performance Insight
  insights.push({
    type: 'info',
    title: 'Top Performing Platform',
    description: `${bestPlatform[0]} delivers the highest ROAS at ${bestPlatform[1].toFixed(2)}x with $${platformSpend[bestPlatform[0] as keyof typeof platformSpend].toLocaleString()} in spend.`,
    recommendation: `Analyze ${bestPlatform[0]}'s successful tactics and apply learnings to other platforms.`,
    impact: 'high',
    metric: 'Platform ROAS',
    value: bestPlatform[1]
  });

  // Cost Efficiency Insight
  if (avgCPC > 5) {
    insights.push({
      type: 'warning',
      title: 'High Cost Per Click',
      description: `Average CPC of $${avgCPC.toFixed(2)} may be impacting profitability.`,
      recommendation: 'Optimize ad relevance, improve Quality Score, and test new targeting options.',
      impact: 'medium',
      metric: 'CPC',
      value: avgCPC
    });
  }

  // Profit Margin Insight
  if (avgProfitMargin < 20) {
    insights.push({
      type: 'danger',
      title: 'Low Profit Margins',
      description: `Average profit margin of ${avgProfitMargin.toFixed(1)}% indicates potential pricing or cost issues.`,
      recommendation: 'Review pricing strategy, reduce COGS, or focus on higher-margin products.',
      impact: 'high',
      metric: 'Profit Margin',
      value: avgProfitMargin
    });
  }

  // Marketing Efficiency Insight
  const marketingEfficiency = totalRevenue > 0 ? (totalSpend / totalRevenue) * 100 : 0;
  insights.push({
    type: marketingEfficiency < 15 ? 'success' : marketingEfficiency < 25 ? 'info' : 'warning',
    title: 'Marketing Investment Ratio',
    description: `Marketing spend represents ${marketingEfficiency.toFixed(1)}% of total revenue.`,
    recommendation: marketingEfficiency > 25 ? 'Consider optimizing spend efficiency or increasing organic growth channels.' : 'Current marketing investment ratio is healthy.',
    impact: marketingEfficiency > 25 ? 'medium' : 'low',
    metric: 'Marketing Efficiency',
    value: marketingEfficiency
  });

  return insights.slice(0, 6); // Return top 6 insights
};