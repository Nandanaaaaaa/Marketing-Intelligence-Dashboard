import { FacebookData, GoogleData, TikTokData, BusinessData } from '../types';

// Generate mock data for the last 120 days as specified
const generateDates = (days: number): string[] => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'WA', 'AZ', 'MA', 'TN', 'IN'];
const dates = generateDates(120); // 120 days as specified

const facebookTactics = ['Video Ads', 'Carousel Ads', 'Single Image', 'Collection Ads', 'Lead Ads'];
const googleTactics = ['Search Ads', 'Display Ads', 'Shopping Ads', 'YouTube Ads', 'Performance Max'];
const tiktokTactics = ['In-Feed Ads', 'Spark Ads', 'TopView', 'Brand Takeover', 'Branded Effects'];

const generateCampaignName = (platform: string, tactic: string, state: string): string => {
  const campaignTypes = ['Acquisition', 'Retargeting', 'Brand', 'Conversion', 'Awareness'];
  const randomType = campaignTypes[Math.floor(Math.random() * campaignTypes.length)];
  return `${platform}_${randomType}_${state}_${tactic.replace(/\s+/g, '')}`;
};

// Facebook data with campaign-level details
export const facebookData: FacebookData[] = dates.flatMap(date => 
  states.flatMap(state => 
    facebookTactics.map(tactic => {
      const baseSpend = Math.random() * 800 + 200;
      const impressions = Math.floor(baseSpend * (Math.random() * 50 + 30)); // 30-80 impressions per dollar
      const clicks = Math.floor(impressions * (Math.random() * 0.03 + 0.01)); // 1-4% CTR
      const attributed_revenue = baseSpend * (Math.random() * 4 + 1); // 1-5x ROAS
      
      return {
        date,
        tactic,
        state,
        campaign: generateCampaignName('FB', tactic, state),
        impressions,
        clicks,
        spend: Math.round(baseSpend * 100) / 100,
        attributed_revenue: Math.round(attributed_revenue * 100) / 100
      };
    })
  )
);

// Google data with campaign-level details
export const googleData: GoogleData[] = dates.flatMap(date => 
  states.flatMap(state => 
    googleTactics.map(tactic => {
      const baseSpend = Math.random() * 600 + 150;
      const impressions = Math.floor(baseSpend * (Math.random() * 40 + 25)); // 25-65 impressions per dollar
      const clicks = Math.floor(impressions * (Math.random() * 0.05 + 0.02)); // 2-7% CTR
      const attributed_revenue = baseSpend * (Math.random() * 3.5 + 1.2); // 1.2-4.7x ROAS
      
      return {
        date,
        tactic,
        state,
        campaign: generateCampaignName('GGL', tactic, state),
        impressions,
        clicks,
        spend: Math.round(baseSpend * 100) / 100,
        attributed_revenue: Math.round(attributed_revenue * 100) / 100
      };
    })
  )
);

// TikTok data with campaign-level details
export const tiktokData: TikTokData[] = dates.flatMap(date => 
  states.flatMap(state => 
    tiktokTactics.map(tactic => {
      const baseSpend = Math.random() * 500 + 100;
      const impressions = Math.floor(baseSpend * (Math.random() * 60 + 40)); // 40-100 impressions per dollar
      const clicks = Math.floor(impressions * (Math.random() * 0.025 + 0.008)); // 0.8-3.3% CTR
      const attributed_revenue = baseSpend * (Math.random() * 3 + 0.8); // 0.8-3.8x ROAS
      
      return {
        date,
        tactic,
        state,
        campaign: generateCampaignName('TT', tactic, state),
        impressions,
        clicks,
        spend: Math.round(baseSpend * 100) / 100,
        attributed_revenue: Math.round(attributed_revenue * 100) / 100
      };
    })
  )
);

// Business data - daily business performance
export const businessData: BusinessData[] = dates.map(date => {
  const baseOrders = Math.floor(Math.random() * 200 + 100); // 100-300 orders per day
  const newOrdersRatio = Math.random() * 0.4 + 0.3; // 30-70% new orders
  const new_orders = Math.floor(baseOrders * newOrdersRatio);
  const new_customers = Math.floor(new_orders * (Math.random() * 0.3 + 0.7)); // 70-100% of new orders are new customers
  const avgOrderValue = Math.random() * 80 + 50; // $50-130 AOV
  const total_revenue = Math.round(baseOrders * avgOrderValue * 100) / 100;
  const grossMargin = Math.random() * 0.3 + 0.4; // 40-70% gross margin
  const gross_profit = Math.round(total_revenue * grossMargin * 100) / 100;
  const cogs = Math.round((total_revenue - gross_profit) * 100) / 100;
  
  return {
    date,
    orders: baseOrders,
    new_orders,
    new_customers,
    total_revenue,
    gross_profit,
    cogs
  };
});