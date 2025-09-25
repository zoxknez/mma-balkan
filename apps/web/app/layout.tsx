import type { ReactNode } from 'react';
import './styles.css';
import { Sora } from 'next/font/google';
import Link from 'next/link';
import { headers } from 'next/headers';
import LiveTicker from './LiveTicker';
import ProgressBar from './ProgressBar';
import { NewsIcon, EventIcon, FighterIcon, LiveIcon, ForumIcon } from './icons';
import CommandPalette from './CommandPalette';
import SubtleBackground from './SubtleBackground';

const sora = Sora({ 
  subsets: ['latin'], 
  variable: '--font-sora', 
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800']
});

export const metadata = {
  title: 'MMA SRB - Balkan MMA Portal',
  description: 'Najkompletniji MMA hub na Balkanu - borci, događaji, vesti, analize',
};

export const viewport = {
  themeColor: '#0a0d12',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const path = (headers().get('x-invoke-path') || headers().get('x-next-url') || '/') as string;
  const is = (p: string) => path === p || path?.startsWith(p + '/')
  return (
    <html lang="sr" className={`theme-dark ${sora.variable}`}>
    <body>
  <ProgressBar />
  <SubtleBackground />
        <header className="site-header">
          <div className="container header-inner">
            <div className="brand" style={{display:'flex',alignItems:'center',gap:12}}>
              <span className="logo-mark" aria-hidden />
              <span>MMA SRB</span>
            </div>
            <nav className="main-nav">
              <Link className={is('/') ? 'active' : ''} href="/">Početna</Link>
              <Link className={is('/fighters') ? 'active' : ''} href="/fighters">Borci</Link>
              <Link className={is('/events') ? 'active' : ''} href="/events">Događaji</Link>
              <Link className={is('/news') ? 'active' : ''} href="/news">Vesti</Link>
              <Link className={is('/live') ? 'active' : ''} href="/live">Uživo</Link>
              <Link className={is('/forum') ? 'active' : ''} href="/forum">Forum</Link>
            </nav>
            <div className="header-actions">
              <input aria-label="Pretraga" className="input search" placeholder="Pretraži..." />
            </div>
          </div>
          <div className="container" style={{paddingTop:8}}>
            <LiveTicker />
          </div>
        </header>
        <div className="app-shell">
          <aside className="sidebar hide-sm" aria-label="Navigacija">
            <Link href="/news" className={is('/news') ? 'active' : ''}><NewsIcon /></Link>
            <Link href="/events" className={is('/events') ? 'active' : ''}><EventIcon /></Link>
            <Link href="/" className={is('/') ? 'active' : ''}><LiveIcon /></Link>
            <Link href="/fighters" className={is('/fighters') ? 'active' : ''}><FighterIcon /></Link>
            <Link href="/forum" className={is('/forum') ? 'active' : ''}><ForumIcon /></Link>
          </aside>
          <main className="page-content container">{children}</main>
        </div>
        <footer className="site-footer">
          <div className="container footer-inner">
            <span>© {new Date().getFullYear()} MMA SRB - Balkan MMA Portal</span>
            <span className="muted">🥊 UFC • ONE FC • Bellator • PFL</span>
          </div>
        </footer>
        {/* Mobile bottom dock nav */}
  <nav className="bottom-dock show-sm" aria-label="Primarna navigacija">
          <Link href="/news" className={is('/news') ? 'active' : ''}><NewsIcon /><span>Vesti</span></Link>
          <Link href="/events" className={is('/events') ? 'active' : ''}><EventIcon /><span>Dog.</span></Link>
          <Link href="/" className={is('/') ? 'active' : ''}><LiveIcon /><span>Uživo</span></Link>
          <Link href="/fighters" className={is('/fighters') ? 'active' : ''}><FighterIcon /><span>Borci</span></Link>
          <Link href="/forum" className={is('/forum') ? 'active' : ''}><ForumIcon /><span>Forum</span></Link>
        </nav>
  <CommandPalette />
      </body>
    </html>
  );
}
