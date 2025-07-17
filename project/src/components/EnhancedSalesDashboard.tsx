import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Area, AreaChart, ScatterChart, Scatter } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Target, Filter, Calendar, Download, RefreshCw, AlertCircle } from 'lucide-react';

const EnhancedSalesDashboard = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('12M');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSegment, setSelectedSegment] = useState('All');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Mock data generation
  const generateRevenueData = () => {
    const months = ['Jan 24', 'Feb 24', 'Mar 24', 'Apr 24', 'May 24', 'Jun 24', 'Jul 24', 'Aug 24', 'Sep 24', 'Oct 24', 'Nov 24', 'Dec 24', 'Jan 25', 'Feb 25', 'Mar 25', 'Apr 25', 'May 25', 'Jun 25', 'Jul 25'];
    return months.map((month, index) => ({
      month,
      revenue: 45000 + Math.random() * 25000 + (index * 2000),
      forecast: index > 15 ? 65000 + Math.random() * 15000 : null,
      target: 60000 + (index * 1000),
      orders: 450 + Math.random() * 200 + (index * 10)
    }));
  };

  const generateProductData = () => [
    { name: 'MacBook Pro', revenue: 125420, units: 142, margin: 28.5, category: 'Electronics', growth: 15.2 },
    { name: 'iPhone 15', revenue: 98750, units: 198, margin: 32.1, category: 'Electronics', growth: 8.7 },
    { name: 'Samsung 4K TV', revenue: 87340, units: 89, margin: 18.9, category: 'Electronics', growth: -2.1 },
    { name: 'Nike Air Max', revenue: 76580, units: 256, margin: 45.2, category: 'Clothing', growth: 22.4 },
    { name: 'Adidas Ultraboost', revenue: 65420, units: 189, margin: 42.8, category: 'Clothing', growth: 18.9 },
    { name: 'Dyson V15', revenue: 54320, units: 67, margin: 35.4, category: 'Home & Garden', growth: 12.3 },
    { name: 'KitchenAid Mixer', revenue: 43210, units: 78, margin: 28.7, category: 'Home & Garden', growth: 6.8 },
    { name: 'Peloton Bike', revenue: 39870, units: 23, margin: 22.1, category: 'Sports', growth: -5.4 },
    { name: 'Kindle Oasis', revenue: 32540, units: 145, margin: 38.9, category: 'Books', growth: 9.2 },
    { name: 'Fitbit Versa', revenue: 28760, units: 167, margin: 41.3, category: 'Electronics', growth: 14.6 }
  ];

  const generateCustomerSegments = () => [
    { name: 'Champions', value: 23, color: '#10b981', description: 'High value, frequent buyers' },
    { name: 'Loyal Customers', value: 18, color: '#3b82f6', description: 'Regular customers with good value' },
    { name: 'Potential Loyalists', value: 15, color: '#8b5cf6', description: 'Recent customers with potential' },
    { name: 'New Customers', value: 12, color: '#06b6d4', description: 'Recently acquired customers' },
    { name: 'Promising', value: 10, color: '#84cc16', description: 'Good potential, need nurturing' },
    { name: 'Need Attention', value: 8, color: '#f59e0b', description: 'Declining engagement' },
    { name: 'About to Sleep', value: 7, color: '#f97316', description: 'Risk of churning' },
    { name: 'At Risk', value: 5, color: '#ef4444', description: 'High churn risk' },
    { name: 'Cannot Lose', value: 2, color: '#dc2626', description: 'High value, at risk' }
  ];

  // Generate dynamic customer segments based on category and time range
  const generateDynamicCustomerSegments = (category, timeRange) => {
    const baseSegments = [
      { name: 'Champions', color: '#10b981', description: 'High value, frequent buyers' },
      { name: 'Loyal Customers', color: '#3b82f6', description: 'Regular customers with good value' },
      { name: 'Potential Loyalists', color: '#8b5cf6', description: 'Recent customers with potential' },
      { name: 'New Customers', color: '#06b6d4', description: 'Recently acquired customers' },
      { name: 'Promising', color: '#84cc16', description: 'Good potential, need nurturing' },
      { name: 'Need Attention', color: '#f59e0b', description: 'Declining engagement' },
      { name: 'About to Sleep', color: '#f97316', description: 'Risk of churning' },
      { name: 'At Risk', color: '#ef4444', description: 'High churn risk' },
      { name: 'Cannot Lose', color: '#dc2626', description: 'High value, at risk' }
    ];

    // Category-based adjustments
    const categoryMultipliers = {
      'Electronics': { champions: 1.2, loyal: 1.1, newCustomers: 0.8, atRisk: 0.9 },
      'Clothing': { champions: 0.9, loyal: 1.3, newCustomers: 1.4, atRisk: 0.7 },
      'Home & Garden': { champions: 0.8, loyal: 0.9, newCustomers: 0.6, atRisk: 1.2 },
      'Sports': { champions: 1.1, loyal: 0.8, newCustomers: 1.2, atRisk: 1.1 },
      'Books': { champions: 0.7, loyal: 1.2, newCustomers: 0.9, atRisk: 0.8 },
      'All': { champions: 1.0, loyal: 1.0, newCustomers: 1.0, atRisk: 1.0 }
    };

    // Time range adjustments
    const timeMultipliers = {
      '3M': { champions: 0.8, newCustomers: 1.5, atRisk: 1.3 },
      '6M': { champions: 0.9, newCustomers: 1.2, atRisk: 1.1 },
      '12M': { champions: 1.0, newCustomers: 1.0, atRisk: 1.0 },
      '24M': { champions: 1.3, newCustomers: 0.7, atRisk: 0.8 }
    };

    const catMult = categoryMultipliers[category] || categoryMultipliers['All'];
    const timeMult = timeMultipliers[timeRange] || timeMultipliers['12M'];

    // Base percentages
    const baseValues = [25, 18, 15, 12, 10, 8, 7, 3, 2];
    
    return baseSegments.map((segment, index) => {
      let multiplier = 1;
      
      // Apply category and time multipliers based on segment type
      if (segment.name === 'Champions') {
        multiplier = (catMult.champions || 1) * (timeMult.champions || 1);
      } else if (segment.name === 'Loyal Customers') {
        multiplier = (catMult.loyal || 1) * 1;
      } else if (segment.name === 'New Customers') {
        multiplier = (catMult.newCustomers || 1) * (timeMult.newCustomers || 1);
      } else if (segment.name === 'At Risk' || segment.name === 'Cannot Lose') {
        multiplier = (catMult.atRisk || 1) * (timeMult.atRisk || 1);
      }
      
      let value = Math.round(baseValues[index] * multiplier);
      
      // Ensure minimum value of 1 and add some randomness
      value = Math.max(1, value + Math.floor(Math.random() * 3 - 1));
      
      return {
        ...segment,
        value
      };
    });
  };

  const generateKPIData = () => ({
    totalRevenue: { value: 2847560, change: 12.4, trend: 'up' },
    totalOrders: { value: 15847, change: 8.7, trend: 'up' },
    avgOrderValue: { value: 179.65, change: 3.2, trend: 'up' },
    customerAcquisition: { value: 1247, change: -2.1, trend: 'down' },
    customerLifetimeValue: { value: 892.40, change: 15.8, trend: 'up' },
    churnRate: { value: 4.2, change: -0.8, trend: 'up' }
  });

  const [revenueData, setRevenueData] = useState(generateRevenueData());
  const [productData, setProductData] = useState(generateProductData());
  const [kpiData, setKPIData] = useState(generateKPIData());

  // Filter product data based on selected category
  const filteredProductData = selectedCategory === 'All' 
    ? productData 
    : productData.filter(product => product.category === selectedCategory);

  // Filter revenue data based on selected time range
  const getFilteredRevenueData = () => {
    const monthsToShow = {
      '3M': 3,
      '6M': 6,
      '12M': 12,
      '24M': 19 // All available data
    };
    const months = monthsToShow[selectedTimeRange];
    return revenueData.slice(-months);
  };

  const filteredRevenueData = getFilteredRevenueData();

  // Generate dynamic customer segments based on current filters
  const dynamicCustomerSegments = generateDynamicCustomerSegments(selectedCategory, selectedTimeRange);

  // Calculate dynamic KPIs based on filtered data
  const calculateDynamicKPIs = () => {
    // Calculate from filtered product data
    const totalRevenue = filteredProductData.reduce((sum, product) => sum + product.revenue, 0);
    const totalUnits = filteredProductData.reduce((sum, product) => sum + product.units, 0);
    const avgOrderValue = totalUnits > 0 ? totalRevenue / totalUnits : 0;
    
    // Calculate from filtered revenue data
    const revenueSum = filteredRevenueData.reduce((sum, item) => sum + item.revenue, 0);
    const ordersSum = filteredRevenueData.reduce((sum, item) => sum + item.orders, 0);
    const avgRevenueOrderValue = ordersSum > 0 ? revenueSum / ordersSum : 0;
    
    // Use revenue data for time-based metrics, product data for category-based metrics
    const finalRevenue = selectedTimeRange !== '12M' ? revenueSum : totalRevenue;
    const finalOrders = selectedTimeRange !== '12M' ? ordersSum : totalUnits;
    const finalAvgOrderValue = selectedTimeRange !== '12M' ? avgRevenueOrderValue : avgOrderValue;
    
    // Calculate growth (comparing with previous period)
    const revenueGrowth = filteredRevenueData.length > 1 ? 
      ((filteredRevenueData[filteredRevenueData.length - 1].revenue - filteredRevenueData[0].revenue) / filteredRevenueData[0].revenue * 100) : 12.4;
    
    return {
      totalRevenue: { 
        value: finalRevenue, 
        change: revenueGrowth, 
        trend: revenueGrowth > 0 ? 'up' : 'down' 
      },
      totalOrders: { 
        value: Math.round(finalOrders), 
        change: revenueGrowth * 0.7, // Simulate related growth
        trend: revenueGrowth > 0 ? 'up' : 'down' 
      },
      avgOrderValue: { 
        value: finalAvgOrderValue, 
        change: revenueGrowth * 0.3, // Simulate related growth
        trend: revenueGrowth > 0 ? 'up' : 'down' 
      },
      customerAcquisition: { 
        value: Math.round(finalOrders * 0.08), // 8% of orders are new customers
        change: -2.1, 
        trend: 'down' 
      },
      customerLifetimeValue: { 
        value: finalAvgOrderValue * 4.97, // Average customer makes ~5 orders
        change: 15.8, 
        trend: 'up' 
      },
      churnRate: { 
        value: 4.2, 
        change: -0.8, 
        trend: 'up' 
      }
    };
  };

  const dynamicKPIData = calculateDynamicKPIs();
  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
      // Simulate small data changes
      setRevenueData(prev => prev.map(item => ({
        ...item,
        revenue: item.revenue + (Math.random() - 0.5) * 1000
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setRevenueData(generateRevenueData());
      setProductData(generateProductData());
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const KPICard = ({ title, value, change, trend, prefix = '', suffix = '' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend === 'up' ? (
          <TrendingUp className="w-4 h-4 text-green-500" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500" />
        )}
      </div>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-gray-900">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </span>
        <span className={`ml-2 text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
    </div>
  );

  const ProductTable = ({ data }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Top Products Performance</h3>
          <span className="text-sm text-gray-500">
            {selectedCategory === 'All' ? 'All Categories' : selectedCategory} 
            ({data.length} products)
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        {data.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No products found for the selected category.</p>
          </div>
        ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((product, index) => (
              <tr key={index} className="hover:bg-gray-50 cursor-pointer transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  ${product.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.units}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.margin}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    product.growth > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product.growth > 0 ? '+' : ''}{product.growth}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Enterprise Sales Analytics</h1>
              <p className="text-sm text-gray-600">
                Last updated: {lastUpdated.toLocaleTimeString()} | Real-time insights for data-driven decisions
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedTimeRange} 
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="3M">Last 3 Months</option>
                <option value="6M">Last 6 Months</option>
                <option value="12M">Last 12 Months</option>
                <option value="24M">Last 24 Months</option>
              </select>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
              </select>
              <button 
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <KPICard
            title="Total Revenue"
            value={dynamicKPIData.totalRevenue.value}
            change={dynamicKPIData.totalRevenue.change}
            trend={dynamicKPIData.totalRevenue.trend}
            prefix="$"
          />
          <KPICard
            title="Total Orders"
            value={dynamicKPIData.totalOrders.value}
            change={dynamicKPIData.totalOrders.change}
            trend={dynamicKPIData.totalOrders.trend}
          />
          <KPICard
            title="Avg Order Value"
            value={dynamicKPIData.avgOrderValue.value}
            change={dynamicKPIData.avgOrderValue.change}
            trend={dynamicKPIData.avgOrderValue.trend}
            prefix="$"
          />
          <KPICard
            title="New Customers"
            value={dynamicKPIData.customerAcquisition.value}
            change={dynamicKPIData.customerAcquisition.change}
            trend={dynamicKPIData.customerAcquisition.trend}
          />
          <KPICard
            title="Customer LTV"
            value={dynamicKPIData.customerLifetimeValue.value}
            change={dynamicKPIData.customerLifetimeValue.change}
            trend={dynamicKPIData.customerLifetimeValue.trend}
            prefix="$"
          />
          <KPICard
            title="Churn Rate"
            value={dynamicKPIData.churnRate.value}
            change={dynamicKPIData.churnRate.change}
            trend={dynamicKPIData.churnRate.trend}
            suffix="%"
          />
        </div>

        {/* Revenue Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Trend & Forecast</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Actual</span>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Forecast</span>
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span>Target</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#10b981' }} />
                <Line type="monotone" dataKey="target" stroke="#9ca3af" strokeWidth={1} strokeDasharray="3 3" dot={{ fill: '#9ca3af' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Customer Segmentation (RFM)</h3>
              <AlertCircle className="w-5 h-5 text-gray-400" />
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dynamicCustomerSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dynamicCustomerSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  labelFormatter={(label) => dynamicCustomerSegments.find(s => s.name === label)?.description || label}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {dynamicCustomerSegments.slice(0, 6).map((segment, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }}></div>
                  <span className="text-gray-700">{segment.name}</span>
                  <span className="text-gray-500">{segment.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProductTable data={filteredProductData} />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Performance Matrix</h3>
              <span className="text-sm text-gray-500">
                {selectedCategory === 'All' ? 'All Categories' : selectedCategory} 
                ({filteredProductData.length} products)
              </span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="margin" name="Margin %" stroke="#6b7280" fontSize={12} />
                <YAxis dataKey="revenue" name="Revenue" stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'revenue' ? `$${value.toLocaleString()}` : `${value}%`,
                    name === 'revenue' ? 'Revenue' : 'Margin'
                  ]}
                />
                <Scatter 
                  data={filteredProductData.slice(0, 8)} 
                  fill="#3b82f6" 
                  name="Products"
                />
              </ScatterChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600">
              <p>Bubble size represents unit sales volume</p>
              <p>Top-right quadrant shows high-margin, high-revenue products</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSalesDashboard;