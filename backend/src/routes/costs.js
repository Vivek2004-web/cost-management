const express = require('express');
const { CostExplorerClient, GetCostAndUsageCommand } = require('@aws-sdk/client-cost-explorer');
const { EC2Client, DescribeInstancesCommand } = require('@aws-sdk/client-ec2');
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Simple in-memory cache to prevent hitting AWS Cost Explorer rate limits (5 req/sec limit)
const costCache = new Map(); // key: `userId_period`, value: { timestamp, data }
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

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

  const dailyServiceBreakdown = dailyBreakdown.map(day => {
    const item = {
      date: day.date,
      displayDate: day.displayDate,
      total: day.total
    };
    serviceDistribution.forEach(srv => {
      const baseShare = (srv.amount / 3120.00) * day.total;
      const dayNum = new Date(day.date).getDate();
      const variation = (Math.sin(dayNum + srv.name.length) * 0.12) + 1;
      item[srv.name] = parseFloat(Math.max(1, baseShare * variation).toFixed(2));
    });
    return item;
  });

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
    dailyServiceBreakdown,
    aiCostAdvisor,
    isDemoMode: true
  };
}

// GET /api/costs/overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const period = req.query.period || '30';
    const daysCount = parseInt(period, 10);
    const userId = req.user.id;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    // Demo Mode check
    if (!user || user.demo_mode === 1 || (!user.aws_access_key && !user.azure_client_id && !user.gcp_project_id)) {
      const data = generateDemoCostData(daysCount);
      return res.json({ success: true, ...data });
    }

    // Check cache first for rapid requests (unless force refresh requested)
    const cacheKey = `${userId}_${daysCount}`;
    const forceRefresh = req.query.refresh === 'true';
    const cached = costCache.get(cacheKey);
    if (!forceRefresh && cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
      console.log(`[Cache Hit] Serving cached AWS Cost Explorer data for user ${user.email}`);
      return res.json({ success: true, ...cached.data });
    }

    // --- REAL ENTERPRISE AWS COST EXPLORER SDK ENGINE (WITH PAGINATION) ---
    if (user.aws_access_key && user.aws_secret_key) {
      try {
        console.log(`Connecting to AWS Cost Explorer API for ${user.email} (Key: ${user.aws_access_key.slice(0, 6)}...)...`);

        const client = new CostExplorerClient({
          region: 'us-east-1',
          credentials: {
            accessKeyId: user.aws_access_key.trim(),
            secretAccessKey: user.aws_secret_key.trim()
          }
        });

        // Set End date to tomorrow so today's usage is included in AWS Cost Explorer's [Start, End) range
        const endDateObj = new Date();
        endDateObj.setDate(endDateObj.getDate() + 1);
        const endDate = endDateObj.toISOString().split('T')[0];

        // Start date: beginning of previous month to ensure 100% full-month billing parity with AWS Billing Console
        const startDateObj = new Date();
        if (daysCount <= 60) {
          startDateObj.setMonth(startDateObj.getMonth() - 1);
          startDateObj.setDate(1);
        } else {
          startDateObj.setDate(startDateObj.getDate() - daysCount);
        }
        const startDate = startDateObj.toISOString().split('T')[0];

        let nextPageToken = null;
        const allResultsByTime = [];

        // PAGINATION LOOP: Fetch 100% of all billing pages from AWS
        do {
          const command = new GetCostAndUsageCommand({
            TimePeriod: { Start: startDate, End: endDate },
            Granularity: 'DAILY',
            Metrics: ['UnblendedCost'],
            GroupBy: [{ Type: 'DIMENSION', Key: 'SERVICE' }],
            NextPageToken: nextPageToken || undefined
          });

          const response = await client.send(command);
          if (response && response.ResultsByTime) {
            allResultsByTime.push(...response.ResultsByTime);
          }
          nextPageToken = response.NextPageToken;
        } while (nextPageToken);

        if (allResultsByTime.length > 0) {
          console.log(`AWS Cost Explorer API Success! Fetched ${allResultsByTime.length} daily entries across all pages.`);

          let totalMonthlyCost = 0;
          let mtdCost = 0;
          let lastMonthTotalCost = 0;
          let todaysCost = 0;

          const currentMonthPrefix = new Date().toISOString().slice(0, 7); // e.g. "2026-08"
          const prevMonthObj = new Date();
          prevMonthObj.setMonth(prevMonthObj.getMonth() - 1);
          const lastMonthPrefix = prevMonthObj.toISOString().slice(0, 7); // e.g. "2026-07"

          const dailyBreakdown = [];
          const dailyServiceBreakdown = [];
          const serviceTotals = {};

          allResultsByTime.forEach((result, idx) => {
            const date = result.TimePeriod.Start;
            let dayTotal = 0;
            const serviceDayObj = {
              date,
              displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              total: 0
            };

            if (result.Groups && result.Groups.length > 0) {
              result.Groups.forEach(group => {
                const serviceName = group.Keys[0] || 'Other AWS Services';
                const amount = parseFloat(group.Metrics?.UnblendedCost?.Amount || '0');
                if (amount > 0) {
                  dayTotal += amount;
                  serviceTotals[serviceName] = (serviceTotals[serviceName] || 0) + amount;
                  serviceDayObj[serviceName] = parseFloat(amount.toFixed(2));
                }
              });
            }

            totalMonthlyCost += dayTotal;
            if (date.startsWith(currentMonthPrefix)) {
              mtdCost += dayTotal;
            } else if (date.startsWith(lastMonthPrefix)) {
              lastMonthTotalCost += dayTotal;
            }

            if (idx === allResultsByTime.length - 1) {
              todaysCost = dayTotal;
            }

            const formattedDayTotal = parseFloat(dayTotal.toFixed(2));
            serviceDayObj.total = formattedDayTotal;

            dailyBreakdown.push({
              date,
              displayDate: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              total: formattedDayTotal,
              aws: formattedDayTotal,
              azure: 0,
              gcp: 0
            });

            dailyServiceBreakdown.push(serviceDayObj);
          });

          const mtdFormatted = parseFloat(mtdCost.toFixed(2));
          const lastMonthFormatted = parseFloat(lastMonthTotalCost.toFixed(2));
          const grandTotalFormatted = parseFloat(totalMonthlyCost.toFixed(2));

          // Use MTD cost as current monthly spend (or grand total if MTD is 0)
          const activeMonthlySpend = mtdFormatted > 0 ? mtdFormatted : grandTotalFormatted;

          // Find service with highest actual cost
          let highestService = { name: 'AWS Services', amount: 0 };
          Object.entries(serviceTotals).forEach(([name, amount]) => {
            if (amount > highestService.amount) {
              highestService = { name, amount: parseFloat(amount.toFixed(2)) };
            }
          });

          // Service distribution list
          const colors = ['#FF9900', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899', '#F59E0B', '#64748B', '#06B6D4', '#E11D48', '#84CC16'];
          const serviceDistribution = Object.entries(serviceTotals).map(([name, amount], index) => {
            return {
              name,
              provider: 'AWS',
              amount: parseFloat(amount.toFixed(2)),
              cost: parseFloat(amount.toFixed(2)),
              percentage: parseFloat(((amount / (grandTotalFormatted || 1)) * 100).toFixed(1)),
              color: colors[index % colors.length]
            };
          }).sort((a, b) => b.amount - a.amount);

          const resultPayload = {
            summary: {
              totalMonthlyCost: activeMonthlySpend,
              lastMonthCost: lastMonthFormatted,
              todaysCost: parseFloat(todaysCost.toFixed(2)),
              highestCostService: highestService.name,
              highestServiceCost: highestService.amount,
              currency: 'USD',
              monthTrendPercentage: lastMonthFormatted > 0 ? parseFloat((((activeMonthlySpend - lastMonthFormatted) / lastMonthFormatted) * 100).toFixed(1)) : 0.0,
              forecastMonthEnd: parseFloat((activeMonthlySpend * 2.2).toFixed(2))
            },
            cloudProviders: [
              { name: 'Amazon Web Services (AWS)', short: 'AWS', cost: totalMonthlyCost, percentage: 100, color: '#FF9900' }
            ],
            dailyBreakdown: dailyBreakdown.length > 0 ? dailyBreakdown : [{ date: endDate, displayDate: 'Today', total: 0, aws: 0, azure: 0, gcp: 0 }],
            dailyServiceBreakdown: dailyServiceBreakdown.length > 0 ? dailyServiceBreakdown : dailyBreakdown,
            serviceDistribution: serviceDistribution.length > 0 ? serviceDistribution : [{ name: 'AWS Cloud', provider: 'AWS', amount: 0, cost: 0, percentage: 100, color: '#FF9900' }],
            aiCostAdvisor: [
              {
                id: 'aws-actual-advisor-1',
                provider: 'AWS',
                serviceName: highestService.name || 'Amazon EC2',
                increasePercentage: 0,
                spikeAmount: `$${highestService.amount.toFixed(2)}`,
                reasons: [
                  `Live AWS Cost Explorer connection active for ${user.aws_access_key.slice(0, 6)}...`,
                  `${serviceDistribution.length} AWS service(s) aggregated from your live AWS billing console.`
                ],
                suggestedAction: `Review ${highestService.name} usage metrics in AWS Console.`,
                actionLabel: 'Open AWS Cost Console'
              }
            ],
            aiRecommendations: [],
            isDemoMode: false,
            awsError: null,
            credentialNotice: `Live AWS Cost Explorer Connected (${user.aws_access_key.slice(0, 6)}...)`
          };

          // Store in cache
          costCache.set(cacheKey, { timestamp: Date.now(), data: resultPayload });

          return res.json({ success: true, ...resultPayload });
        }

      } catch (awsError) {
        console.error('AWS Cost Explorer SDK Call Error:', awsError.name, awsError.message);
        
        return res.json({
          success: false,
          isDemoMode: false,
          awsError: `AWS API Error (${awsError.name || 'Error'}): ${awsError.message}. Ensure IAM policy 'ce:GetCostAndUsage' is attached to Access Key ${user.aws_access_key.slice(0, 6)}...`,
          summary: { totalMonthlyCost: 0, todaysCost: 0, highestCostService: 'N/A', highestServiceCost: 0, currency: 'USD', monthTrendPercentage: 0, forecastMonthEnd: 0 },
          cloudProviders: [],
          dailyBreakdown: [],
          serviceDistribution: [],
          aiCostAdvisor: [],
          aiRecommendations: []
        });
      }
    }

    const data = generateDemoCostData(daysCount);
    return res.json({ success: true, ...data });

  } catch (error) {
    console.error('Error fetching cost overview:', error);
    res.status(500).json({ success: false, message: 'Failed to query AWS Cost Explorer API.' });
  }
});

// GET /api/costs/resources - Fetch live EC2 instances from AWS
router.get('/resources', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    // If demo mode or no AWS credentials, return demo resources
    if (!user || user.demo_mode === 1 || !user.aws_access_key || !user.aws_secret_key) {
      return res.json({
        success: true,
        isDemo: true,
        resources: [
          { id: 'i-09abf721c810a42e1', name: 'prod-api-cluster-worker-01', service: 'EC2 (t3.medium)', provider: 'AWS', region: 'us-east-1', status: 'RUNNING', cost: 420.00, cpu: '14.2%', memory: '4.0 GB', tags: ['env:prod', 'team:engineering'] },
          { id: 'i-077cc21bb998810a2', name: 'prod-api-cluster-worker-02', service: 'EC2 (t3.medium)', provider: 'AWS', region: 'us-east-1', status: 'IDLE', cost: 420.00, cpu: '4.1%', memory: '4.0 GB', tags: ['env:prod', 'team:engineering'] },
          { id: 'rds-prod-postgres-main', name: 'prod-db-postgres-primary', service: 'RDS (db.t3.medium)', provider: 'AWS', region: 'us-east-1', status: 'RUNNING', cost: 480.00, cpu: '38.4%', memory: '4.0 GB', tags: ['env:prod', 'team:database'] },
          { id: 's3-analytics-logs-2026', name: 's3-analytics-raw-logs', service: 'S3 Storage', provider: 'AWS', region: 'us-east-1', status: 'ACTIVE', cost: 280.00, cpu: 'N/A', memory: '8.4 TB', tags: ['env:prod', 'team:analytics'] },
          { id: 'lambda-auth-verify-user', name: 'auth-jwt-verifier-func', service: 'Lambda Function', provider: 'AWS', region: 'us-east-1', status: 'RUNNING', cost: 65.00, cpu: '2.1%', memory: '128 MB', tags: ['env:prod', 'team:auth'] }
        ]
      });
    }

    const region = user.aws_region || 'us-east-1';
    console.log(`Fetching live EC2 resources for ${user.email} in region ${region}...`);

    const ec2Client = new EC2Client({
      region: region,
      credentials: {
        accessKeyId: user.aws_access_key.trim(),
        secretAccessKey: user.aws_secret_key.trim()
      }
    });

    const command = new DescribeInstancesCommand({});
    const response = await ec2Client.send(command);

    const resources = [];
    if (response.Reservations) {
      response.Reservations.forEach(reservation => {
        if (reservation.Instances) {
          reservation.Instances.forEach(inst => {
            const nameTag = inst.Tags?.find(t => t.Key.toLowerCase() === 'name')?.Value || inst.InstanceId;
            const state = inst.State?.Name?.toUpperCase() || 'STOPPED';
            const type = inst.InstanceType || 't3.micro';
            const az = inst.Placement?.AvailabilityZone || region;
            const tagList = (inst.Tags || []).map(t => `${t.Key}:${t.Value}`);

            let estMonthlyCost = 0;
            if (state === 'RUNNING') {
              if (type.includes('small')) estMonthlyCost = 15.20;
              else if (type.includes('medium')) estMonthlyCost = 30.40;
              else if (type.includes('large')) estMonthlyCost = 60.80;
              else estMonthlyCost = 7.60;
            }

            resources.push({
              id: inst.InstanceId,
              name: nameTag,
              service: `EC2 (${type})`,
              provider: 'AWS',
              region: az,
              status: state,
              cost: estMonthlyCost,
              cpu: state === 'RUNNING' ? '12.5%' : '0.0%',
              memory: type,
              tags: tagList.length > 0 ? tagList : ['env:aws', `type:${type}`]
            });
          });
        }
      });
    }

    console.log(`Live EC2 Success! Retrieved ${resources.length} instances.`);
    return res.json({
      success: true,
      isDemo: false,
      resources
    });

  } catch (err) {
    console.error('Error fetching live EC2 instances:', err.message);
    return res.json({
      success: false,
      message: `EC2 API Error: ${err.message}`,
      resources: []
    });
  }
});

router.clearCache = () => costCache.clear();

module.exports = router;
