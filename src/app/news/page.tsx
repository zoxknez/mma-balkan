'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, TrendingUp } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { useNews } from '@/hooks/useNews';
import { useRouter, usePathname } from 'next/navigation';
import { usePrefetch } from '@/lib/prefetch';

import { NewsHeader } from '@/components/news/NewsHeader';
import { NewsStats } from '@/components/news/NewsStats';
import { NewsControls } from '@/components/news/NewsControls';
import { FeaturedArticle } from '@/components/news/FeaturedArticle';
import { NewsGrid } from '@/components/news/NewsGrid';
import { NewsPagination } from '@/components/news/NewsPagination';
import { NoResults } from '@/components/news/NoResults';
import { NewsArticle, SortOption } from '@/components/news/types';

// Mock data za vesti
const mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Aleksandar Rakić spreman za revanš: "Ovaj put neću napraviti istu greška"',
    excerpt: 'Srpski borac u ekskluzivnom intervjuu otkriva detalje svoje pripreme za borbu protiv Jan Błachowicza i kako planira da povrati titulu.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Intervjui',
    author: 'Marko Petrović',
    publishDate: '2025-09-26T10:30:00Z',
    views: 15420,
    likes: 892,
    image: '/news/rakic-interview.jpg',
    featured: true,
    trending: true
  },
  {
    id: '2',
    title: 'Nova MMA promocija stiže u Zagreb: Croatian Fighting Championship najavljuje spektakl',
    excerpt: 'CFC donosi revoluciju u hrvatski MMA sa najboljim regionalnim borcima i internacionalnim zvezdam u glavnim borbama.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Organizacije',
    author: 'Ana Kovač',
    publishDate: '2025-09-25T14:15:00Z',
    views: 8930,
    likes: 456,
    image: '/news/cfc-announcement.jpg',
    featured: false,
    trending: true
  },
  {
    id: '3',
    title: 'Analiza: Kako je Stipe Miočić promenio landscape heavyweight divizije',
    excerpt: 'Retrospektiva karijere hrvatske legende i njen uticaj na razvoj MMA scene na Balkanu i u svetu.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Analize',
    author: 'Stefan Nikolić',
    publishDate: '2025-09-24T09:45:00Z',
    views: 12340,
    likes: 678,
    image: '/news/miocic-legacy.jpg',
    featured: true,
    trending: false
  },
  {
    id: '4',
    title: 'Roberto Soldić potpisao sa UFC-om: Ekskluzivne fotografije sa ceremonije',
    excerpt: 'Hrvatski welterweight šampion zvanično se pridružuje najjačoj MMA promociji na svetu. Evo šta možemo očekivati.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Transfer',
    author: 'Nikola Jovanović',
    publishDate: '2025-09-23T16:20:00Z',
    views: 23450,
    likes: 1234,
    image: '/news/soldic-ufc.jpg',
    featured: false,
    trending: true
  },
  {
    id: '5',
    title: 'Ženske MMA na Balkanu: Nova generacija borki osvaja svetsku scenu',
    excerpt: 'Sve više balkanskih borki uspešno se takmiči na međunarodnom nivou. Analiza fenomena i prognoze za budućnost.',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    category: 'Žene u MMA',
    author: 'Milica Stojanović',
    publishDate: '2025-09-22T11:10:00Z',
    views: 7890,
    likes: 345,
    image: '/news/women-mma.jpg',
    featured: false,
    trending: false
  }
];

const categories = ['Sve', 'Intervjui', 'Organizacije', 'Analize', 'Transfer', 'Žene u MMA', 'Treninzi', 'Događaji'];

export default function NewsPage() {
  const prefetch = usePrefetch();
  const router = useRouter();
  const pathname = usePathname();

  const [selectedCategory, setSelectedCategory] = useState('Sve');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [page, setPage] = useState(1);
  const [limit] = useState(9);

  const { data: apiNews, isLoading, pagination } = useNews({
    page,
    limit,
    ...(searchTerm ? { search: searchTerm } : {}),
    ...(selectedCategory !== 'Sve' ? { category: selectedCategory } : {}),
  });

  const news: NewsArticle[] = (apiNews || []).map(n => ({
    id: n.id,
    title: n.title,
    excerpt: n.excerpt ?? '',
    category: n.category,
    author: n.authorName,
    publishDate: n.publishAt,
    views: n.views,
    likes: n.likes,
    image: n.imageUrl ?? undefined,
    featured: n.featured,
    trending: n.trending,
  }));

  const baseNews = news.length ? news : mockNews;

  const filteredNews = baseNews
    .filter(article => 
      (selectedCategory === 'Sve' || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        default:
          return 0;
      }
    });

  // Initialize state from URL (client-only)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('q') || '';
    const cat = params.get('category') || 'Sve';
    const sort = (params.get('sort') as SortOption | null) || 'date';
    const p = Number(params.get('page') || '1') || 1;
    setSearchTerm(q);
    setSelectedCategory(cat);
    setSortBy(sort);
    setPage(p);
  }, []);

  // Sync state to URL
  useEffect(() => {
    const sp = new URLSearchParams();
    if (searchTerm) sp.set('q', searchTerm);
    if (selectedCategory !== 'Sve') sp.set('category', selectedCategory);
    if (sortBy !== 'date') sp.set('sort', sortBy);
    if (page > 1) sp.set('page', String(page));
    router.replace(`${pathname}?${sp.toString()}`);
  }, [searchTerm, selectedCategory, sortBy, page, router, pathname]);

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Intervjui': 'text-green-400',
      'Organizacije': 'text-blue-400',
      'Analize': 'text-purple-400',
      'Transfer': 'text-orange-400',
      'Žene u MMA': 'text-pink-400',
      'Treninzi': 'text-yellow-400',
      'Događaji': 'text-red-400'
    };
    return colors[category] || 'text-gray-400';
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Pre ${diffDays} ${diffDays === 1 ? 'dan' : 'dana'}`;
    if (diffHours > 0) return `Pre ${diffHours} ${diffHours === 1 ? 'sat' : 'sati'}`;
    return 'Upravo sada';
  };

  const stats = {
    totalNews: filteredNews.length,
    trendingCount: filteredNews.filter(n => n.trending).length,
    totalViews: baseNews.reduce((sum, n) => sum + n.views, 0),
    activeAuthors: 47
  };

  const featuredArticle = filteredNews.find(article => article.featured);
  const gridNews = filteredNews.filter(article => !article.featured);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        {/* Ultra-Futuristic Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>
        
        {/* Floating News Elements */}
        <div className="absolute top-20 right-12 opacity-10">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.3, 1] }}
            transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          >
            <Newspaper className="w-44 h-44 text-orange-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-16 left-12 opacity-10">
          <motion.div
            animate={{ rotate: -360, x: [-15, 15, -15] }}
            transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          >
            <TrendingUp className="w-40 h-40 text-yellow-500" />
          </motion.div>
        </div>
        
        <div className="relative z-10 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <NewsHeader />
            
            <NewsStats stats={stats} />

            <NewsControls 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              sortBy={sortBy}
              onSortChange={setSortBy}
              categories={categories}
              totalResults={filteredNews.length}
            />

            {featuredArticle && (
              <FeaturedArticle 
                article={featuredArticle}
                getCategoryColor={getCategoryColor}
                formatTimeAgo={formatTimeAgo}
                onPrefetch={prefetch}
              />
            )}

            <NewsGrid 
              news={gridNews}
              isLoading={isLoading}
              getCategoryColor={getCategoryColor}
              formatTimeAgo={formatTimeAgo}
              onPrefetch={prefetch}
            />

            <NewsPagination 
              page={pagination?.page ?? page}
              totalPages={pagination?.totalPages ?? 1}
              isLoading={isLoading}
              onPageChange={setPage}
            />

            {filteredNews.length === 0 && !isLoading && (
              <NoResults 
                onReset={() => {
                  setSelectedCategory('Sve');
                  setSearchTerm('');
                  setSortBy('date');
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
