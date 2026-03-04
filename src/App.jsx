import { useState, useEffect, lazy, Suspense } from 'react'
import { S, COLORS, FONTS } from './theme'
import Nav from './components/Nav'
import Footer from './components/Footer'
import Home from './pages/Home'
import Blog from './pages/Blog'
import About from './pages/About'
import Resources from './pages/Resources'
import PostView from './pages/PostView'
import { useData } from './hooks/useData'
import { hasAdminSession } from './utils/auth'

// Admin is lazy-loaded — it's a separate code chunk and NOT included
// in the main JS bundle that public visitors download
const Login     = lazy(() => import('./admin/Login'))
const Dashboard = lazy(() => import('./admin/Dashboard'))

// ── Simple hash-based router ──────────────────────────────────────────────
// /#admin   → admin area
// /         → public site
function useRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const handler = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return hash
}

export default function App() {
  const hash = useRoute()
  const { posts, resources, about, loaded, savePosts, saveResources, saveAbout } = useData()
  const [page, setPage]           = useState('home')
  const [activePost, setPost]     = useState(null)
  const [authed, setAuthed]       = useState(hasAdminSession())

  if (!loaded) {
    return (
      <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>
        // loading...
      </div>
    )
  }

  // ── Admin route ────────────────────────────────────────────────────────
  if (hash === '#admin') {
    return (
      <Suspense fallback={<div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted }}>// loading admin...</div>}>
        {authed
          ? <Dashboard
              posts={posts} resources={resources} about={about}
              onSavePosts={savePosts} onSaveResources={saveResources} onSaveAbout={saveAbout}
              onExit={() => { setAuthed(false); window.location.hash = '' }}
            />
          : <Login onSuccess={() => setAuthed(true)} />
        }
      </Suspense>
    )
  }

  // ── Public site ────────────────────────────────────────────────────────
  const navigate = (p) => { setPage(p); setPost(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div style={S.page}>
      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`, backgroundSize: '60px 60px', opacity: 0.18, pointerEvents: 'none', zIndex: 0 }} />

      <Nav page={page} onNavigate={navigate} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {activePost
          ? <PostView post={activePost} onBack={() => setPost(null)} />
          : page === 'home'      ? <Home posts={posts} onViewAll={() => navigate('blog')} onPost={setPost} />
          : page === 'blog'      ? <Blog posts={posts} />
          : page === 'about'     ? <About about={about} />
          : page === 'resources' ? <Resources resources={resources} />
          : null
        }
      </div>

      <Footer onNavigate={navigate} />

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1;box-shadow:0 0 10px #5ef5b8}50%{opacity:0.5;box-shadow:0 0 4px #5ef5b8} }
        * { box-sizing: border-box; }
        a { color: inherit; }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(0.4); }
      `}</style>
    </div>
  )
}
