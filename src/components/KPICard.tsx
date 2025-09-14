import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  format?: 'currency' | 'percentage' | 'number' | 'multiplier';
}

const KPICard: React.FC<KPICardProps> = ({ 
  title, 
  value, 
  change, 
  changeLabel, 
  icon, 
  color, 
  subtitle,
  format = 'number'
}) => {
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus size={16} className="text-gray-400" />;
    return change > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />;
  };

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-gray-400';
    return change > 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatChange = (change: number | undefined) => {
    if (change === undefined) return 'N/A';
    const sign = change > 0 ? '+' : '';
    return `${sign}${Math.abs(change).toFixed(1)}%`;
  };
  
  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color} shadow-lg`}>
          {icon}
        </div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-sm ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-medium">{formatChange(change)}</span>
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-white text-2xl font-bold mb-1">{value}</p>
        {subtitle && (
          <p className="text-gray-500 text-xs mb-1">{subtitle}</p>
        )}
        <p className="text-gray-500 text-xs">{changeLabel}</p>
      </div>
    </div>
  );
};

export default KPICard;