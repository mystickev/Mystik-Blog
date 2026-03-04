import { S } from '../theme'

const NAV_ITEMS = [
  { id: 'home',      label: '~/home' },
  { id: 'blog',      label: '~/blog' },
  { id: 'about',     label: '~/about' },
  { id: 'resources', label: '~/resources' },
]

export default function Nav({ page, onNavigate }) {
  return (
    <nav style={S.nav}>
      <div style={S.navInner}>
        <div style={S.logo} onClick={() => onNavigate('home')} title="Mystik">
          <div style={S.logoDot} />
          Mystik
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.id}
              style={S.navLink(page === item.id)}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
