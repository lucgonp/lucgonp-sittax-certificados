// Service do recurso Dashboard.
class DashboardService {
  constructor(client) {
    this.client = client;
  }

  overview() {
    return this.client.get('/dashboard/overview');
  }

  commission() {
    return this.client.get('/dashboard/commission');
  }

  recentActivities(params) {
    return this.client.get('/dashboard/recent-activities', { params });
  }

  portfolioDistribution() {
    return this.client.get('/dashboard/portfolio-distribution');
  }
}

module.exports = DashboardService;
