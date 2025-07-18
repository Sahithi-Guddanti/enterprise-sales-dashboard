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
  const [customerSegments, setCustomerSegments] = useState(generateCustomerSegments());
  const [kpiData, setKPIData] = useState(generateKPIData());

  // Filter product data based on selected category
  const filteredProductData = selectedCategory === 'All' 
    ? productData 
    : productData.filter(product => product.category === selectedCategory);

  // Calculate dynamic KPIs based on filtered products
  const calculateFilteredKPIs = () => {
    const totalRevenue = filteredProductData.reduce((sum, product) => sum + product.revenue, 0);
    const totalUnits = filteredProductData.reduce((sum, product) => sum + product.units, 0);
    const avgOrderValue = totalUnits > 0 ? totalRevenue / totalUnits : 0;
    const avgGrowth = filteredProductData.length > 0 
      ? filteredProductData.reduce((sum, product) => sum + product.growth, 0) / filteredProductData.length 
      : 0;

    // Base KPI data for "All" categories
    const baseKPIs = generateKPIData();
    
    if (selectedCategory === 'All') {
      return baseKPIs;
    }

    // Calculate category-specific metrics
    const categoryMultiplier = totalRevenue / 2847560; // Ratio compared to total
    
    return {
      totalRevenue: { 
        value: totalRevenue, 
        change: avgGrowth, 
        trend: avgGrowth > 0 ? 'up' : 'down' 
      },
      totalOrders: { 
        value: totalUnits, 
        change: avgGrowth * 0.8, 
        trend: avgGrowth > 0 ? 'up' : 'down' 
      },
      avgOrderValue: { 
        value: avgOrderValue, 
        change: avgGrowth * 0.6, 
        trend: avgGrowth > 0 ? 'up' : 'down' 
      },
      customerAcquisition: { 
        value: Math.round(baseKPIs.customerAcquisition.value * categoryMultiplier), 
        change: avgGrowth * 0.4, 
        trend: avgGrowth > 0 ? 'up' : 'down' 
      },
      customerLifetimeValue: { 
        value: avgOrderValue * 4.5, 
        change: avgGrowth * 0.7, 
        trend: avgGrowth > 0 ? 'up' : 'down' 
      },
      churnRate: { 
        value: avgGrowth < 0 ? Math.abs(avgGrowth) * 0.3 + 2 : 2.1, 
        change: avgGrowth < 0 ? Math.abs(avgGrowth) * 0.2 : -0.5, 
        trend: avgGrowth < 0 ? 'down' : 'up' 
      }
    };
  };

  // Generate dynamic customer segments based on category
  const generateDynamicSegments = () => {
    if (selectedCategory === 'All') {
      return generateCustomerSegments();
    }

    // Category-specific segment distributions
    const categorySegments = {
      'Electronics': [
        { name: 'Tech Enthusiasts', value: 28, color: '#10b981', description: 'Early adopters of new technology' },
        { name: 'Professional Users', value: 22, color: '#3b82f6', description: 'Business and professional buyers' },
        { name: 'Price Conscious', value: 18, color: '#8b5cf6', description: 'Value-seeking consumers' },
        { name: 'Brand Loyalists', value: 15, color: '#06b6d4', description: 'Loyal to specific brands' },
        { name: 'Casual Buyers', value: 10, color: '#84cc16', description: 'Occasional purchasers' },
        { name: 'Gift Buyers', value: 7, color: '#f59e0b', description: 'Purchasing for others' }
      ],
      'Clothing': [
        { name: 'Fashion Forward', value: 25, color: '#10b981', description: 'Trend-conscious shoppers' },
        { name: 'Brand Enthusiasts', value: 20, color: '#3b82f6', description: 'Premium brand buyers' },
        { name: 'Athletic Focused', value: 18, color: '#8b5cf6', description: 'Sports and fitness oriented' },
        { name: 'Value Shoppers', value: 16, color: '#06b6d4', description: 'Price-sensitive buyers' },
        { name: 'Seasonal Buyers', value: 12, color: '#84cc16', description: 'Seasonal purchase patterns' },
        { name: 'Occasional Buyers', value: 9, color: '#f59e0b', description: 'Infrequent purchasers' }
      ],
      'Home & Garden': [
        { name: 'Home Improvers', value: 30, color: '#10b981', description: 'Active home renovation' },
        { name: 'Quality Seekers', value: 25, color: '#3b82f6', description: 'Premium product buyers' },
        { name: 'DIY Enthusiasts', value: 20, color: '#8b5cf6', description: 'Do-it-yourself projects' },
        { name: 'Seasonal Gardeners', value: 15, color: '#06b6d4', description: 'Seasonal garden buyers' },
        { name: 'New Homeowners', value: 10, color: '#84cc16', description: 'Recent home purchases' }
      ],
      'Sports': [
        { name: 'Fitness Enthusiasts', value: 35, color: '#10b981', description: 'Regular fitness activities' },
        { name: 'Professional Athletes', value: 20, color: '#3b82f6', description: 'Competitive sports' },
        { name: 'Weekend Warriors', value: 18, color: '#8b5cf6', description: 'Recreational sports' },
        { name: 'Health Conscious', value: 15, color: '#06b6d4', description: 'Health and wellness focused' },
        { name: 'Casual Users', value: 12, color: '#84cc16', description: 'Occasional sports activities' }
      ]
    };

    return categorySegments[selectedCategory] || generateCustomerSegments();
  };

  const dynamicKPIs = calculateFilteredKPIs();
  const dynamicSegments = generateDynamicSegments();

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
            {selectedCategory === 'All' ? 'All Categories' : selectedCategory} ({data.length} products)
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
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
            {data.length > 0 ? data.slice(0, 8).map((product, index) => (
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
            )) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No products found for the selected category
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
            value={dynamicKPIs.totalRevenue.value}
            change={dynamicKPIs.totalRevenue.change}
            trend={dynamicKPIs.totalRevenue.trend}
            prefix="$"
          />
          <KPICard
            title="Total Orders"
            value={dynamicKPIs.totalOrders.value}
            change={dynamicKPIs.totalOrders.change}
            trend={dynamicKPIs.totalOrders.trend}
          />
          <KPICard
            title="Avg Order Value"
            value={dynamicKPIs.avgOrderValue.value}
            change={dynamicKPIs.avgOrderValue.change}
            trend={dynamicKPIs.avgOrderValue.trend}
            prefix="$"
          />
          <KPICard
            title="New Customers"
            value={dynamicKPIs.customerAcquisition.value}
            change={dynamicKPIs.customerAcquisition.change}
            trend={dynamicKPIs.customerAcquisition.trend}
          />
          <KPICard
            title="Customer LTV"
            value={dynamicKPIs.customerLifetimeValue.value}
            change={dynamicKPIs.customerLifetimeValue.change}
            trend={dynamicKPIs.customerLifetimeValue.trend}
            prefix="$"
          />
          <KPICard
            title="Churn Rate"
            value={dynamicKPIs.churnRate.value}
            change={dynamicKPIs.churnRate.change}
            trend={dynamicKPIs.churnRate.trend}
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
              <LineChart data={revenueData}>
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
                  data={dynamicSegments}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {dynamicSegments.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Share']}
                  labelFormatter={(label) => dynamicSegments.find(s => s.name === label)?.description || label}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {dynamicSegments.slice(0, 6).map((segment, index) => (
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
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Matrix</h3>
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