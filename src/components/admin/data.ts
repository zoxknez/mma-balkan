export const adminStats = {
  totalUsers: 1247,
  activeUsers: 892,
  totalFighters: 156,
  totalEvents: 23,
  totalClubs: 45,
  revenue: 45600,
  growthRate: 12.5,
  conversionRate: 3.2
};

export const recentActivities = [
  { id: 1, type: 'fighter_added', user: 'Marko Petrović', action: 'Dodao novog borca', time: '2 minuta', status: 'success' },
  { id: 2, type: 'event_created', user: 'Ana Jovanović', action: 'Kreirao događaj', time: '15 minuta', status: 'success' },
  { id: 3, type: 'user_registered', user: 'Stefan Nikolić', action: 'Registrovao se', time: '1 sat', status: 'success' },
  { id: 4, type: 'club_updated', user: 'Milica Stojanović', action: 'Ažurirao klub', time: '2 sata', status: 'warning' },
  { id: 5, type: 'payment_failed', user: 'Petar Marković', action: 'Neuspešna uplata', time: '3 sata', status: 'error' },
];

export const systemAlerts = [
  { id: 1, type: 'warning', message: 'Visoka CPU upotreba na serveru', time: '5 minuta', resolved: false },
  { id: 2, type: 'info', message: 'Nova verzija dostupna', time: '1 sat', resolved: false },
  { id: 3, type: 'error', message: 'Greška u bazi podataka', time: '2 sata', resolved: true },
  { id: 4, type: 'success', message: 'Backup uspešno završen', time: '3 sata', resolved: true },
];

export const performanceData = [
  { x: 'Jan', y: 85 },
  { x: 'Feb', y: 92 },
  { x: 'Mar', y: 78 },
  { x: 'Apr', y: 95 },
  { x: 'May', y: 88 },
  { x: 'Jun', y: 96 },
];

export const revenueData = [
  { label: 'Pretplate', value: 25000 },
  { label: 'Reklame', value: 12000 },
  { label: 'Događaji', value: 8600 },
];

export const userGrowthData = [
  { category: 'Jan', value: 120 },
  { category: 'Feb', value: 145 },
  { category: 'Mar', value: 132 },
  { category: 'Apr', value: 178 },
  { category: 'May', value: 195 },
  { category: 'Jun', value: 220 },
];

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  joinDate: string;
  actions?: string;
  [key: string]: unknown;
}

export const userData: AdminUser[] = [
  { id: 1, name: 'Marko Petrović', email: 'marko@example.com', role: 'Admin', status: 'active', lastLogin: '2025-01-15', joinDate: '2024-01-15' },
  { id: 2, name: 'Ana Jovanović', email: 'ana@example.com', role: 'Moderator', status: 'active', lastLogin: '2025-01-14', joinDate: '2024-02-20' },
  { id: 3, name: 'Stefan Nikolić', email: 'stefan@example.com', role: 'User', status: 'inactive', lastLogin: '2025-01-10', joinDate: '2024-03-15' },
  { id: 4, name: 'Milica Stojanović', email: 'milica@example.com', role: 'User', status: 'active', lastLogin: '2025-01-15', joinDate: '2024-04-10' },
];
