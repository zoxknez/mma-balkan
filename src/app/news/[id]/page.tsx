'use client';

import { Layout } from '@/components/layout';
import { ParticleSystem, CyberGrid } from '@/components/effects/ParticleSystem';
import { useParams, useRouter } from 'next/navigation';
import { useNewsItem } from '@/hooks/useNews';
import { incrementNewsView, toggleNewsLike } from '@/lib/api/news';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, Eye, Heart } from 'lucide-react';
import Image from 'next/image';
import { ShareButton } from '@/components/ui/share-button';
import { Skeleton } from '@/components/ui/skeleton';
import { WatchlistButton } from '@/components/ui/watchlist-button';
import { JsonLd } from '@/components/seo/JsonLd';

export default function NewsDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const { data: article, isLoading } = useNewsItem(id);
  const [likes, setLikes] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    // fire and forget view increment
    incrementNewsView(id).catch(() => {});
  }, [id]);

  useEffect(() => {
    if (article && likes === null) setLikes(article.likes);
  }, [article, likes]);

  return (
    <Layout>
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900 via-gray-900 to-black">
          <ParticleSystem className="absolute inset-0" />
          <CyberGrid />
        </div>

        <div className="relative z-10 px-6 py-8 max-w-4xl mx-auto">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Nazad
            </Button>
            <ShareButton title="Podeli vest" />
            {id ? <WatchlistButton entity={{ type: 'news', id }} /> : null}
          </div>

          <div className="glass-card p-6 relative overflow-hidden">
            <CyberGrid />
            <div className="relative z-10">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <Skeleton className="h-64 w-full" />
                </>
              ) : article ? (
                <article className="prose prose-invert max-w-none">
                  <h1 className="text-3xl font-bold text-white mb-2">{article.title}</h1>
                  <div className="text-gray-400 text-sm flex items-center gap-4 mb-6">
                    <span className="inline-flex items-center gap-1"><User className="w-4 h-4" /> {article.authorName}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1"><Calendar className="w-4 h-4" /> {new Date(article.publishAt).toLocaleString('sr-RS')}</span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1"><Eye className="w-4 h-4" /> {article.views.toLocaleString()}</span>
                    <button
                      className="inline-flex items-center gap-1 text-gray-400 hover:text-red-400 transition-colors"
                      onClick={async () => {
                        if (!id) return;
                        const res = await toggleNewsLike(id, 'inc');
                        if (res.data?.likes !== undefined) setLikes(res.data.likes);
                      }}
                      aria-label="Like"
                    >
                      <Heart className="w-4 h-4" /> {(likes ?? article.likes).toLocaleString()}
                    </button>
                  </div>

                  {article.imageUrl && (
                    <div className="mb-6 relative w-full">
                      <Image
                        src={article.imageUrl}
                        alt={article.title}
                        width={1200}
                        height={675}
                        className="w-full h-auto rounded-lg border border-orange-400/20 object-cover"
                        unoptimized
                        priority
                      />
                    </div>
                  )}

                  <p className="text-gray-200 leading-7 whitespace-pre-line">{article.content}</p>
                </article>
              ) : (
                <div className="text-gray-400">Članak nije pronađen.</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* SEO: NewsArticle JSON-LD */}
      {!isLoading && article ? (
        <JsonLd data={{
          '@context': 'https://schema.org',
          '@type': 'NewsArticle',
          headline: article.title,
          author: { '@type': 'Person', name: article.authorName },
          datePublished: article.publishAt,
          image: article.imageUrl,
        }} />
      ) : null}
    </Layout>
  );
}
