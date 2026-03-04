export const fmtDate = d =>
  new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })

export const genId = () => Date.now()

export const todayISO = () => new Date().toISOString().split('T')[0]
