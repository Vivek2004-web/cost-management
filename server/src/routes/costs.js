const express = require('express');
const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate Demo Cost Data fallback
function generateDemoCostData(daysCount = 30) {
  const cloudProviders = [
    { name: 'Amazon Web Services (AWS)', short: 'AWS', cost: 1650.00, percentage: 52.9, color: '#FF9900' },
    { name: 'Microsoft Azure', short: 'Azure', cost: 940.00, percentage: 30.1, color: '#0089D6' },
    { name: 'Google Cloud Platform (GCP)', short: 'GCP', cost: 530.00, percentage: 17.0, color: '#4285F4' }
  ];

  const serviceDistribution = [
    { name: 'AWS EC2 Compute', provider: 'AWS', amount: 890.00, cost: 890.00, percentage: 28.5, color: '#FF9900' },
    { name: 'Azure Virtual Machines', provider: 'Azure', amount: 580.00, cost: 580.00, percentage: 18.6, color: '#0089D6' },
    { name: 'AWS RDS Database', provider: 'AWS', amount: 480.00, cost: 480.00, percentage: 15.4, color: '#FFB800' },
    { name: 'GCP Compute Engine', provider: 'GCP', amount: 340.00, cost: 340.00, percentage: 10.9, color: '#4285F4' },
    { name: 'Azure SQL Database', provider: 'Azure', amount: 360.00, cost: 360.00, percentage: 11.5, color: '#005BA1' },
    { name: 'GCP BigQuery Data Warehouse', provider: 'GCP', amount: 190.00, cost: 190.00, percentage: 6.1, color: '#34A853' },
    { name: 'AWS S3 Cloud Storage', provider: 'AWS', amount: 280.00, cost: 280.00, percentage: 9.0, color: '#10B981' }
  ];

  const dailyBreakdown = [];
  const now = new Date();
  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];

    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const fluctuationFactor = isWeekend ? 0.8 : 1.12;
    const dayTotal = parseFloat((104.00 * fluctuationFactor * (1 + (Math.random() * 0.2 - 0.1))).toFixed(2));

    dailyBreakdown.push({
      date: dateStr,
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      total: dayTotal,
      aws: parseFloat((dayTotal * 0.53).toFixed(2)),
      azure: parseFloat((dayTotal * 0.30).toFixed(2)),
      gcp: parseFloat((dayTotal * 0.17).toFixed(2))
    });
  }

  const aiCostAdvisor = [
    {
      id: 'advisor-1',
      provider: 'AWS',
      serviceName: 'Amazon EC2 Compute',
      increasePercentage: 27,
      spikeAmount: '$240.00/mo',
      reasons: [
        'Two new EC2 instances launched',
        'Auto Scaling scaled out yesterday',
        'CPU utilization remained below 15%'
      ],
      suggestedAction: 'Resize to t3.medium to reduce monthly cost.',
      actionLabel: 'Resize to t3.medium'
    }
  ];

  return {
    summary: {
      totalMonthlyCost: 3120.00,
      todaysCost: 112.40,
      highestCostService: 'AWS EC2 Compute',
      highestServiceCost: 890.00,
      currency: 'USD',
      monthTrendPercentage: 9.8,
      forecastMonthEnd: 3380.00
    },
    cloudProviders,
    serviceDistribution,
    dailyBreakdown,
    aiCostAdvisor,
    isDemoMode: true
  };
}

// GET /api/costs/overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || '30';
    const daysCount = parseInt(period, 10);

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);

    // If demo mode is ON or no keys provided, return demo data
    if (!user || user.demo_mode === 1 || (!user.aws_access_key && !user.azure_client_id && !user.gcp_project_id)) {
      const data = generateDemoCostData(daysCount);
      return res.json({ success: true, ...data });
    }

    // --- REAL AWS COST EXPLORER LIVE API CALL ---
    if (user.aws_access_key && user.aws_secret_key) {
      try {
        console.log(`Connecting to AWS Cost Explorer API for user ${user.email} (Key: ${user.aws_access_key.slice(0, 6)}...)...`);

        // Cost Explorer global endpoint is us-east-1
        const client = new CostExplorerClient({
          region: 'us-east-1',
          credentials: {
            accessKeyId: user.aws_access_key.trim(),
            secretAccessKey: user.aws_secret_key.trim()
          }
        });

        // Compute Date Range (Start must be at least 1 day prior to End)
        const endDateObj = new Date();
        const startDateObj = new Date();
        startDateObj.setDate(startDateObj.getDate() - (daysCount || 30));

        const endDate = endDateObj.toISOString().split('T')[0];
        const startDate = startDateObj.toISOString().split('T')[0];

        const command = new GetCostAndUsageCommand({
          TimePeriod: { Start: startDate, End: endDate },
          Granularity: 'DAILY',
          Metrics: ['UnblendedCost'],
          GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }]
        });

        const response = await client.send(command);

        if (response && response.ResultsByTime && response.ResultsByTime.length > 0) {
          console.log(`AWS Cost Explorer API Success! Received ${response.ResultsByTime.length} daily entries.`);

          let totalMonthlyCost = 0;
          let todaysCost = 0;
          const dailyMap = {};
          const serviceTotals = {};

          response.ResultsByTime.forEach((result, idx) => {
            const date = result.TimePeriod.Start;
            let dayTotal = 0;

            if (result.Groups && result.Groups.length > 0) {
              result.Groups.forEach(group => {
                const serviceName = group.Keys[0] || 'Other AWS Services';
                const amount = parseFloat(group.Metrics?.UnblendedCost?.Amount || '0');
                if (amount > 0) {
                  dayTotal += amount;
                  serviceTotals[serviceName] = (serviceTotals[serviceName] || 0) + amount;
                }
              });
            }

            dayTotal = parseFloat(dayTotal.toFixed(2));
            totalMonthlyCost += dayTotal;
            if (idx === response.ResultsByTime.length - 1) {
              todaysCost = dayTotal;
            }

            dailyMap[date] = {
              date,
              displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              total: dayTotal,
              aws: dayTotal,
              azure: 0,
              gcp: 0
            };
          });

          totalMonthlyCost = parseFloat(totalMonthlyCost.toFixed(2));
          const dailyBreakdown = Object.values(dailyMap);

          // Find service with highest actual cost
          let highestService = { name: 'AWS Services', amount: 0 };
          Object.entries(serviceTotals).forEach(([name, amount]) => {
            if (amount > highestService.amount) {
              highestService = { name, amount: parseFloat(amount.toFixed(2)) };
            }
          });

          // Service distribution list
          const colors = ['#FF9900', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#64748B'];
          const serviceDistribution = Object.entries(serviceTotals).map(([name, amount], index) => {
            return {
              name,
              provider: 'AWS',
              amount: parseFloat(amount.toFixed(2)),
              cost: parseFloat(amount.toFixed(2)),
              percentage: parseFloat(((amount / (totalMonthlyCost || 1)) * 100).toFixed(1)),
              color: colors[index % colors.length]
            };
          }).sort((a, b) => b.amount - a.amount);

          // If AWS account returned $0.00 total spend (e.g. brand new account or free tier)
          const finalTotal = totalMonthlyCost > 0 ? totalMonthlyCost : 0.00;

          return res.json({
            success: true,
            summary: {
              totalMonthlyCost: finalTotal,
              todaysCost: parseFloat(todaysCost.toFixed(2)),
              highestCostService: highestService.name,
              highestServiceCost: highestService.amount,
              currency: 'USD',
              monthTrendPercentage: 0.0,
              forecastMonthEnd: parseFloat((finalTotal * 1.05).toFixed(2))
            },
            cloudProviders: [
              { name: 'Amazon Web Services (AWS)', short: 'AWS', cost: finalTotal, percentage: 100, color: '#FF9900' }
            ],
            dailyBreakdown: dailyBreakdown.length > 0 ? dailyBreakdown : [{ date: endDate, displayDate: 'Today', total: 0, aws: 0, azure: 0, gcp: 0 }],
            serviceDistribution: serviceDistribution.length > 0 ? serviceDistribution : [{ name: 'AWS Cloud', provider: 'AWS', amount: 0, cost: 0, percentage: 100, color: '#FF9900' }],
            aiCostAdvisor: [
              {
                id: 'aws-actual-advisor-1',
                provider: 'AWS',
                serviceName: highestService.name || 'Amazon EC2',
                increasePercentage: 0,
                spikeAmount: '$0.00',
                reasons: [
                  `Live AWS Cost Explorer connection active for ${user.aws_access_key.slice(0, 6)}...`,
                  `Total actual billing parsed across ${serviceDistribution.length} AWS services.`
                ],
                suggestedAction: `Review ${highestService.name} usage metrics in AWS Console.`,
                actionLabel: 'Open AWS Cost Console'
              }
            ],
            aiRecommendations: [],
            isDemoMode: false,
            awsError: null,
            credentialNotice: `Connected directly to Live AWS Cost Explorer API (${user.aws_access_key.slice(0, 6)}...)`
          });

        }

      } catch (awsError) {
        console.error('AWS Cost Explorer SDK Call Error:', awsError.name, awsError.message);
        
        return res.json({
          success: false,
          isDemoMode: false,
          awsError: `AWS API Error (${awsError.name || 'Error'}): ${awsError.message}. Verify that IAM policy 'ce:GetCostAndUsage' is attached to Access Key ${user.aws_access_key.slice(0, 6)}...`,
          summary: { totalMonthlyCost: 0, todaysCost: 0, highestCostService: 'N/A', highestServiceCost: 0, currency: 'USD', monthTrendPercentage: 0, forecastMonthEnd: 0 },
          cloudProviders: [],
          dailyBreakdown: [],
          serviceDistribution: [],
          aiCostAdvisor: [],
          aiRecommendations: []
        });
      }
    }

    // Fallback if no AWS keys provided
    const data = generateDemoCostData(daysCount);
    return res.json({ success: true, ...data });

  } catch (error) {
    console.error('Error fetching cost overview:', error);
    res.status(500).json({ success: false, message: 'Failed to query AWS Cost Explorer API.' });
  }
});

module.exports = router;
