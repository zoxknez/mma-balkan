'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Eye, 
  Users, 
  Calendar, 
  Newspaper, 
  BarChart3,
  TrendingUp,
  Activity
} from 'lucide-react';

interface DashboardStats {
  totalFighters: number;
  totalEvents: number;
  totalNews: number;
  totalUsers: number;
  recentActivity: Activity[];
  upcomingEvents: Event[];
  topNews: News[];
}

interface Activity {
  id: string;
  type: 'fighter_added' | 'event_created' | 'news_published' | 'user_registered';
  description: string;
  timestamp: string;
  user: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface News {
  id: string;
  title: string;
  views: number;
  publishedAt: string;
  category: string;
}

export function CMSDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStats({
        totalFighters: 1247,
        totalEvents: 89,
        totalNews: 342,
        totalUsers: 15420,
        recentActivity: [
          {
            id: '1',
            type: 'fighter_added',
            description: 'Novi borac dodan: Aleksandar Rakić',
            timestamp: '2024-01-15T10:30:00Z',
            user: 'Admin'
          },
          {
            id: '2',
            type: 'event_created',
            description: 'Kreiran događaj: UFC 300',
            timestamp: '2024-01-15T09:15:00Z',
            user: 'Moderator'
          },
          {
            id: '3',
            type: 'news_published',
            description: 'Objavljena vest: Pobeda Jon Jones-a',
            timestamp: '2024-01-15T08:45:00Z',
            user: 'Editor'
          }
        ],
        upcomingEvents: [
          {
            id: '1',
            title: 'UFC 300',
            date: '2024-04-13',
            status: 'upcoming'
          },
          {
            id: '2',
            title: 'Bellator 300',
            date: '2024-04-20',
            status: 'upcoming'
          }
        ],
        topNews: [
          {
            id: '1',
            title: 'Jon Jones zadržava titulu',
            views: 15420,
            publishedAt: '2024-01-14T15:30:00Z',
            category: 'results'
          },
          {
            id: '2',
            title: 'Novi transfer u UFC',
            views: 12350,
            publishedAt: '2024-01-13T12:00:00Z',
            category: 'transfers'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'fighter_added': return <Users className="h-4 w-4" />;
      case 'event_created': return <Calendar className="h-4 w-4" />;
      case 'news_published': return <Newspaper className="h-4 w-4" />;
      case 'user_registered': return <Users className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'fighter_added': return 'bg-blue-100 text-blue-800';
      case 'event_created': return 'bg-green-100 text-green-800';
      case 'news_published': return 'bg-purple-100 text-purple-800';
      case 'user_registered': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('sr-RS', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">CMS Dashboard</h1>
          <p className="text-gray-600 mt-2">Upravljanje sadržajem MMA Balkan platforme</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ukupno boraca</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalFighters.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Događaji</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalEvents}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Vesti</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalNews}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Newspaper className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Korisnici</p>
                  <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Pregled</TabsTrigger>
            <TabsTrigger value="content">Sadržaj</TabsTrigger>
            <TabsTrigger value="analytics">Analitika</TabsTrigger>
            <TabsTrigger value="settings">Postavke</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Poslednja aktivnost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
                          {getActivityIcon(activity.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{activity.user}</span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">{formatDate(activity.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Predstojeći događaji
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{event.title}</p>
                          <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                        </div>
                        <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                          {event.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top News */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Najpopularnije vesti
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.topNews.map((news, index) => (
                    <div key={news.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-gray-900">{news.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{news.category}</Badge>
                            <span className="text-xs text-gray-500">{news.views.toLocaleString()} pregleda</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Borci</h3>
                  <p className="text-gray-600 mb-4">Upravljanje borcima i njihovim profilima</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Dodaj borca
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Calendar className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Događaji</h3>
                  <p className="text-gray-600 mb-4">Kreiranje i upravljanje događajima</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Kreiraj događaj
                  </Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <Newspaper className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Vesti</h3>
                  <p className="text-gray-600 mb-4">Pisanje i objavljivanje vesti</p>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Napiši vest
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analitika</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Detaljna analitika će biti dostupna u sledećoj verziji.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Postavke CMS-a</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Postavke sistema će biti dostupne u sledećoj verziji.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}