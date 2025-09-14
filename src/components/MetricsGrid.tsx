import React from 'react';
import { CombinedData } from '../types';

interface MetricsGridProps {
  data: CombinedData[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ data }) => {
  // Calculate platform-specific metrics
  const platformMetrics = {
    Facebook: {
      spend: data.reduce((sum, item) => sum + item.facebook.spend, 0),
      revenue: data.reduce((sum, item) => sum + item.facebook.attributed_revenue, 0),
      clicks: data.reduce((sum, item) => sum + item.facebook.clicks, 0),
      impressions: data.reduce((sum, item) => sum + item.facebook.impressions, 0),
      campaigns: data.reduce((sum, item) => sum + item.facebook.campaigns, 0)
    },
    Google: {
      spend: data.reduce((sum, item) => sum + item.google.spend, 0),
      revenue: data.reduce((sum, item) => sum + item.google.attributed_revenue, 0),
      clicks: data.reduce((sum, item) => sum + item.google.clicks, 0),
      impressions: data.reduce((sum, item) => sum + item.google.impressions, 0),
      campaigns: data.reduce((sum, item) => sum + item.google.campaigns, 0)
    },
    TikTok: {
      spend: data.reduce((sum, item) => sum + item.tiktok.spend, 0),
      revenue: data.reduce((sum, item) => sum + item.tiktok.attributed_revenue, 0),
      clicks: data.reduce((sum, item) => sum + item.tiktok.clicks, 0),
      impressions: data.reduce((sum, item) => sum + item.tiktok.impressions, 0),
      campaigns: data.reduce((sum, item) => sum + item.tiktok.campaigns, 0)
    },
    Business: {
      spend: data.reduce((sum, item) => sum + item.business.total_revenue, 0),
      revenue: data.reduce((sum, item) => sum + item.business.gross_profit, 0),
      clicks: data.reduce((sum, item) => sum + item.business.orders, 0),
      impressions: data.reduce((sum, item) => sum + item.business.new_customers, 0),
      campaigns: data.reduce((sum, item) => sum + item.business.new_orders, 0)
    }
  };

  const platformColors = {
    Facebook: 'bg-blue-600',
    Google: 'bg-red-600',
    TikTok: 'bg-purple-600',
    Business: 'bg-green-600'
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-white text-lg font-semibold mb-6">Platform Performance Breakdown</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(platformMetrics).map(([platform, metrics]) => {
          const roas = metrics.spend > 0 ? metrics.revenue / metrics.spend : 0;
          const cpc = metrics.clicks > 0 ? metrics.spend / metrics.clicks : 0;
          const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
          
          return (
            <div key={platform} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-4">
                <div className={`w-4 h-4 rounded-full ${platformColors[platform as keyof typeof platformColors]} mr-3`}></div>
                <h4 className="text-white font-semibold">{platform}</h4>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Total Spend</span>
                  <span className="text-white font-medium">${metrics.spend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Attributed Revenue</span>
                  <span className="text-green-400 font-medium">${metrics.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">ROAS</span>
                  <span className="text-white font-medium">{roas.toFixed(2)}x</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">CPC</span>
                  <span className="text-white font-medium">${cpc.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">CTR</span>
                  <span className="text-white font-medium">{ctr.toFixed(2)}%</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm">Active Campaigns</span>
                  <span className="text-blue-400 font-medium">{metrics.campaigns.toLocaleString()}</span>
                </div>
                
                <div className="pt-2 border-t border-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Total Clicks</span>
                    <span className="text-white text-sm">{metrics.clicks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400 text-sm">Total Impressions</span>
                    <span className="text-white text-sm">{metrics.impressions.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MetricsGrid;