import React from 'react';
import { CombinedData, InsightData } from '../types';
import { AlertTriangle, TrendingUp, Target, DollarSign, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { generateInsights } from '../utils/dataProcessor';

interface InsightsPanelProps {
  data: CombinedData[];
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ data }) => {
  const insights = generateInsights(data);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="text-green-400" size={20} />;
      case 'info': return <Info className="text-blue-400" size={20} />;
      case 'warning': return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'danger': return <AlertCircle className="text-red-400" size={20} />;
      default: return <Info className="text-gray-400" size={20} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-l-green-500 bg-green-900/20';
      case 'info': return 'border-l-blue-500 bg-blue-900/20';
      case 'warning': return 'border-l-yellow-500 bg-yellow-900/20';
      case 'danger': return 'border-l-red-500 bg-red-900/20';
      default: return 'border-l-gray-500 bg-gray-900/20';
    }
  };

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-red-600 text-white',
      medium: 'bg-yellow-600 text-white',
      low: 'bg-green-600 text-white'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[impact as keyof typeof colors]}`}>
        {impact.toUpperCase()} IMPACT
      </span>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-white text-lg font-semibold">AI-Powered Insights & Recommendations</h3>
        <div className="text-sm text-gray-400">
          Based on {data.length} data points
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <div key={index} className={`border-l-4 ${getInsightColor(insight.type)} p-4 rounded-r-lg`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">{getInsightIcon(insight.type)}</div>
                <h4 className="text-white font-medium text-sm">{insight.title}</h4>
              </div>
              {getImpactBadge(insight.impact)}
            </div>
            
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">{insight.description}</p>
            
            <div className="bg-gray-700/50 p-3 rounded-md mb-3">
              <p className="text-gray-400 text-xs italic">
                💡 <strong>Recommendation:</strong> {insight.recommendation}
              </p>
            </div>
            
            {insight.metric && insight.value && (
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{insight.metric}</span>
                <span className="text-white font-mono">
                  {insight.metric.includes('%') || insight.metric.includes('Margin') || insight.metric.includes('Rate') 
                    ? `${insight.value.toFixed(1)}%` 
                    : insight.metric.includes('$') || insight.metric.includes('CPC') || insight.metric.includes('Cost')
                    ? `$${insight.value.toFixed(2)}`
                    : `${insight.value.toFixed(2)}x`
                  }
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gray-700/30 rounded-lg">
        <h4 className="text-white font-medium text-sm mb-2">📊 Executive Summary</h4>
        <p className="text-gray-300 text-xs leading-relaxed">
          Your marketing campaigns are generating <strong>${data.reduce((sum, item) => sum + item.totalRevenue, 0).toLocaleString()}</strong> in 
          total revenue from <strong>${data.reduce((sum, item) => sum + item.totalSpend, 0).toLocaleString()}</strong> in ad spend. 
          Focus on scaling your best-performing campaigns while optimizing underperforming channels for maximum ROI.
        </p>
      </div>
    </div>
  );
};

export default InsightsPanel;