import React, { useState, useEffect, useMemo } from 'react';
import { BarChart3, DollarSign, Target, TrendingUp, Users, ShoppingCart, UserPlus, Percent } from 'lucide-react';
import KPICard from './components/KPICard';
import FilterPanel from './components/FilterPanel';
import LineChart from './components/LineChart';
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import InsightsPanel from './components/InsightsPanel';
import MetricsGrid from './components/MetricsGrid';
import { combineData, aggregateByDate } from './utils/dataProcessor';
import { facebookData, googleData, tiktokData, businessData } from './data/mockData';
import { FilterOptions, CombinedData } from './types';

function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      end: new Date().toISOString().split('T')[0]
    },
    platforms: ['Facebook', 'Google', 'TikTok', 'Business'],
    states: [],
    tactics: [],
    campaigns: [],
    minSpend: 0,
    maxSpend: Infinity
  });

  const combinedData = useMemo(() => {
    return combineData(facebookData, googleData, tiktokData, businessData);
  }, []);

  const filteredData = useMemo(() => {
    return combinedData.filter(item => {
      const itemDate = new Date(item.date);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      
      const isInDateRange = itemDate >= startDate && itemDate <= endDate;
      const isInStates = filters.states.length === 0 || filters.states.includes(item.state);
      const isInSpendRange = item.totalSpend >= filters.minSpend && item.totalSpend <= filters.maxSpend;
      
      // Platform filtering
      let platformMatch = false;
      if (filters.platforms.includes('Facebook') && item.facebook.spend > 0) platformMatch = true;
      if (filters.platforms.includes('Google') && item.google.spend > 0) platformMatch = true;
      if (filters.platforms.includes('TikTok') && item.tiktok.spend > 0) platformMatch = true;
      if (filters.platforms.includes('Business') && item.business.total_revenue > 0) platformMatch = true;
      if (filters.platforms.length === 0) platformMatch = true;
      
      return isInDateRange && isInStates && isInSpendRange && platformMatch;
    });
  }, [combinedData, filters]);

  const aggregatedData = useMemo(() => {
    return aggregateByDate(filteredData).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredData]);

  // Extract available filter options
  const availableStates = useMemo(() => {
    return [...new Set(combinedData.map(item => item.state))].sort();
  }, [combinedData]);

  const availableTactics = useMemo(() => {
    const tactics = new Set<string>();
    combinedData.forEach(item => {
      item.facebook.tactics.forEach(tactic => tactics.add(tactic));
      item.google.tactics.forEach(tactic => tactics.add(tactic));
      item.tiktok.tactics.forEach(tactic => tactics.add(tactic));
      // Add Business tactics if needed
      // Uncomment and modify if Business data has tactics
      // item.business.tactics.forEach(tactic => tactics.add(tactic));
    });
    return Array.from(tactics).sort();
  }, [combinedData]);

  const availableCampaigns = useMemo(() => {
    return []; // Campaigns would be extracted from raw data if available
  }, []);

  // Calculate comprehensive KPIs
  const totalSpend = filteredData.reduce((sum, item) => sum + item.totalSpend, 0);
  const totalAttributedRevenue = filteredData.reduce((sum, item) => sum + item.totalAttributedRevenue, 0);
  const totalRevenue = filteredData.reduce((sum, item) => sum + item.totalRevenue, 0);
  const totalProfit = filteredData.reduce((sum, item) => sum + item.totalProfit, 0);
  const totalOrders = filteredData.reduce((sum, item) => sum + item.business.orders, 0);
  const totalNewCustomers = filteredData.reduce((sum, item) => sum + item.business.new_customers, 0);
  const totalClicks = filteredData.reduce((sum, item) => sum + item.totalClicks, 0);
  const totalImpressions = filteredData.reduce((sum, item) => sum + item.totalImpressions, 0);

  // Derived metrics
  const avgROAS = totalSpend > 0 ? totalAttributedRevenue / totalSpend : 0;
  const avgCPC = totalClicks > 0 ? totalSpend / totalClicks : 0;
  const avgCTR = totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
  const profitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const customerAcquisitionCost = totalNewCustomers > 0 ? totalSpend / totalNewCustomers : 0;
  const revenuePerOrder = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const newCustomerRate = totalOrders > 0 ? (totalNewCustomers / totalOrders) * 100 : 0;

  // Prepare data for Revenue vs Ad Spend Trend chart
  const revenueAdSpendData = {
    labels: aggregatedData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Revenue',
        data: aggregatedData.map(item => item.totalRevenue),
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.2)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Attributed Revenue',
        data: aggregatedData.map(item => item.totalAttributedRevenue),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Ad Spend',
        data: aggregatedData.map(item => item.totalSpend),
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        tension: 0.4,
        yAxisID: 'y'
      }
    ]
  };

  // Prepare data for ROAS Performance chart
  const roasPerformanceData = {
    labels: aggregatedData.map(item => new Date(item.date).toLocaleDateString()),
    datasets: [
      {
        label: 'ROAS',
        data: aggregatedData.map(item => item.roas),
        borderColor: 'cyan',
        backgroundColor: 'rgba(0, 255, 255, 0.2)',
        tension: 0.4
      }
    ]
  };

  // Prepare data for Platform Performance Pie Chart
  const platformPerformanceData = {
    labels: ['Facebook', 'Google', 'TikTok', 'Business'],
    datasets: [
      {
        data: [
          filteredData.reduce((sum, item) => sum + item.facebook.spend, 0),
          filteredData.reduce((sum, item) => sum + item.google.spend, 0),
          filteredData.reduce((sum, item) => sum + item.tiktok.spend, 0),
          filteredData.reduce((sum, item) => sum + item.business.total_revenue, 0)
        ],
        backgroundColor: ['blue', 'red', 'purple', 'green'],
        hoverBackgroundColor: ['rgba(0,0,255,0.8)', 'rgba(255,0,0,0.8)', 'rgba(128,0,128,0.8)', 'rgba(0,255,0,0.8)']
      }
    ]
  };

  const statePerformanceData = {
    labels: [...new Set(filteredData.map(item => item.state))].slice(0, 10),
    datasets: [{
      label: 'Revenue by State',
      data: [...new Set(filteredData.map(item => item.state))].slice(0, 10).map(state =>
        filteredData.filter(item => item.state === state).reduce((sum, item) => sum + item.totalRevenue, 0)
      ),
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: '#3B82F6',
      borderWidth: 1,
      hoverBackgroundColor: 'rgba(59, 130, 246, 1)'
    }]
  };

  const businessMetricsData = {
    labels: aggregatedData.map(item => new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Total Orders',
        data: aggregatedData.map(item => item.business.orders),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'New Customers',
        data: aggregatedData.map(item => item.business.new_customers),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Marketing Intelligence Dashboard</h1>
          <p className="text-gray-400 text-lg">
            Comprehensive analysis of marketing performance across Facebook, Google, TikTok, and Business campaigns
          </p>
          <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
            <span>📊 {filteredData.length} data points analyzed</span>
            <span>📅 {filters.dateRange.start} to {filters.dateRange.end}</span>
            <span>💰 ${totalSpend.toLocaleString()} total ad spend</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterPanel 
            filters={filters}
            onFiltersChange={setFilters}
            availableStates={availableStates}
            availableTactics={availableTactics}
            availableCampaigns={availableCampaigns}
          />
        </div>

        {/* Primary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Ad Spend"
            value={`$${totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            change={8.2}
            changeLabel="vs previous period"
            icon={<DollarSign size={24} />}
            color="bg-blue-600"
            subtitle="Across all platforms"
          />
          <KPICard
            title="Attributed Revenue"
            value={`$${totalAttributedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
            change={12.4}
            changeLabel="vs previous period"
            icon={<TrendingUp size={24} />}
            color="bg-green-600"
            subtitle="From marketing campaigns"
          />
          <KPICard
            title="Return on Ad Spend"
            value={`${avgROAS.toFixed(2)}x`}
            change={5.3}
            changeLabel="vs previous period"
            icon={<Target size={24} />}
            color="bg-purple-600"
            subtitle="Marketing efficiency"
          />
          <KPICard
            title="Cost Per Click"
            value={`$${avgCPC.toFixed(2)}`}
            change={-3.7}
            changeLabel="vs previous period"
            icon={<Users size={24} />}
            color="bg-orange-600"
            subtitle="Average across platforms"
          />
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="Total Orders"
            value={totalOrders.toLocaleString()}
            change={15.8}
            changeLabel="vs previous period"
            icon={<ShoppingCart size={24} />}
            color="bg-indigo-600"
            subtitle="Business performance"
          />
          <KPICard
            title="New Customers"
            value={totalNewCustomers.toLocaleString()}
            change={22.1}
            changeLabel="vs previous period"
            icon={<UserPlus size={24} />}
            color="bg-pink-600"
            subtitle="Customer acquisition"
          />
          <KPICard
            title="Profit Margin"
            value={`${profitMargin.toFixed(1)}%`}
            change={-1.2}
            changeLabel="vs previous period"
            icon={<Percent size={24} />}
            color="bg-teal-600"
            subtitle="Business profitability"
          />
          <KPICard
            title="Customer Acq. Cost"
            value={`$${customerAcquisitionCost.toFixed(2)}`}
            change={-8.5}
            changeLabel="vs previous period"
            icon={<BarChart3 size={24} />}
            color="bg-red-600"
            subtitle="Cost to acquire customer"
          />
        </div>

        {/* Platform Performance Breakdown */}
        <div className="mb-8">
          <MetricsGrid data={filteredData} />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <LineChart 
            title="Revenue vs Ad Spend Trend"
            data={revenueAdSpendData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value: any) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }}
          />
          <LineChart 
            title="ROAS Performance Over Time"
            data={roasPerformanceData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value: any) {
                      return value.toFixed(1) + 'x';
                    }
                  }
                }
              }
            }}
          />
          <PieChart 
            title="Ad Spend Distribution by Platform"
            data={platformPerformanceData}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function(context: any) {
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((context.parsed / total) * 100).toFixed(1);
                      return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
                    }
                  }
                }
              }
            }}
          />
          <BarChart 
            title="Revenue Performance by State"
            data={statePerformanceData}
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value: any) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Business Metrics Chart */}
        <div className="mb-8">
          <LineChart 
            title="Business Performance: Orders & Customer Acquisition"
            data={businessMetricsData}
            options={{
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        {/* AI Insights */}
        <div className="mb-8">
          <InsightsPanel data={filteredData} />
        </div>

        {/* Detailed Data Table */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">Detailed Performance Data</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 text-gray-400">Ad Spend</th>
                  <th className="text-left py-3 px-4 text-gray-400">Attributed Rev.</th>
                  <th className="text-left py-3 px-4 text-gray-400">Total Revenue</th>
                  <th className="text-left py-3 px-4 text-gray-400">Profit</th>
                  <th className="text-left py-3 px-4 text-gray-400">Orders</th>
                  <th className="text-left py-3 px-4 text-gray-400">ROAS</th>
                  <th className="text-left py-3 px-4 text-gray-400">CPC</th>
                  <th className="text-left py-3 px-4 text-gray-400">CTR</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedData.slice(-15).map((item, index) => (
                  <tr key={index} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="py-3 px-4 text-white font-medium">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-orange-400">${item.totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-cyan-400">${item.totalAttributedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-green-400">${item.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-blue-400">${item.totalProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</td>
                    <td className="py-3 px-4 text-white">{item.business.orders.toLocaleString()}</td>
                    <td className="py-3 px-4 text-white font-mono">{item.roas.toFixed(2)}x</td>
                    <td className="py-3 px-4 text-white font-mono">${item.cpc.toFixed(2)}</td>
                    <td className="py-3 px-4 text-white font-mono">{item.ctr.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>📊 Interactive BI Dashboard | Built for data-driven marketing decisions</p>
          <p className="mt-1">Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default App;