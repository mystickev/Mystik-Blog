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

// Admin is lazy-loaded — separate code chunk, not in main bundle
const Login     = lazy(() => import('./admin/Login'))
const Dashboard = lazy(() => import('./admin/Dashboard'))

// ── Simple hash-based router ──────────────────────────────────────────────
function useRoute() {
  const [hash, setHash] = useState(window.location.hash)
  useEffect(() => {
    const handler = () => setHash(window.location.hash)
    window.addEventListener('hashchange', handler)
    return () => window.removeEventListener('hashchange', handler)
  }, [])
  return hash
}

// ── 404 / Not Found page ──────────────────────────────────────────────────
function NotFound({ onNavigate }) {
  return (
    <div className="not-found" style={{ fontFamily: FONTS.mono }}>
      <div style={{ fontSize: 64, fontWeight: 700, fontFamily: FONTS.display, color: COLORS.accent, lineHeight: 1, marginBottom: 12 }}>404</div>
      <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8, letterSpacing: '0.08em' }}>// page not found</div>
      <div style={{ fontSize: 14, color: COLORS.textDim, marginBottom: 32, maxWidth: 320, lineHeight: 1.7 }}>
        This page doesn't exist or was moved. Check the URL or head back home.
      </div>
      <button
        style={{ ...S.btnPrimary, fontSize: 12 }}
        onClick={() => onNavigate('home')}
      >
        ← back to home
      </button>
    </div>
  )
}

// ── Loading spinner ───────────────────────────────────────────────────────
function LoadingScreen({ message = '// loading...' }) {
  return (
    <div style={{ ...S.page, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: FONTS.mono, fontSize: 12, color: COLORS.textMuted, gap: 10 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: COLORS.accent, animation: 'pulse 1.5s ease-in-out infinite' }} />
      {message}
    </div>
  )
}

const VALID_PAGES = ['home', 'blog', 'about', 'resources']

export default function App() {
  const hash = useRoute()
  const { posts, resources, about, loaded, savePosts, saveResources, saveAbout } = useData()
  const [page, setPage]       = useState('home')
  const [activePost, setPost] = useState(null)
  const [authed, setAuthed]   = useState(hasAdminSession())

  if (!loaded) return <LoadingScreen />

  // ── Admin route ────────────────────────────────────────────────────────
  if (hash === '#admin') {
    return (
      <Suspense fallback={<LoadingScreen message="// loading admin..." />}>
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
  const navigate = (p) => {
    setPage(p)
    setPost(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const isValidPage = VALID_PAGES.includes(page)

  return (
    <div style={S.page}>
      {/* Background grid */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${COLORS.border} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.border} 1px, transparent 1px)`, backgroundSize: '60px 60px', opacity: 0.18, pointerEvents: 'none', zIndex: 0 }} />

      <Nav page={page} onNavigate={navigate} />

      <div style={{ position: 'relative', zIndex: 1 }} className="page-content">
        {activePost
          ? <PostView post={activePost} onBack={() => setPost(null)} />
          : !isValidPage
          ? <NotFound onNavigate={navigate} />
          : page === 'home'      ? <Home posts={posts} onViewAll={() => navigate('blog')} onPost={setPost} />
          : page === 'blog'      ? <Blog posts={posts} />
          : page === 'about'     ? <About about={about} />
          : page === 'resources' ? <Resources resources={resources} />
          : null
        }
      </div>

      <Footer onNavigate={navigate} />
    </div>
  )
}
