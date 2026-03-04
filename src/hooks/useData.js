import { useState, useEffect } from 'react'
import { storageGet, storageSet } from '../utils/storage'
import { DEFAULT_POSTS, DEFAULT_RESOURCES, DEFAULT_ABOUT } from '../data/defaults'

// ── useData hook ──────────────────────────────────────────────────────────
// Manages all site content (posts, resources, about).
// Loads from persistent storage on mount, falls back to defaults.
// Exposes save functions that write through to storage automatically.

export function useData() {
  const [posts, setPosts]       = useState([])
  const [resources, setResources] = useState([])
  const [about, setAbout]       = useState(DEFAULT_ABOUT)
  const [loaded, setLoaded]     = useState(false)

  useEffect(() => {
    ;(async () => {
      const p = await storageGet('mystik:posts')
      const r = await storageGet('mystik:resources')
      const a = await storageGet('mystik:about')
      setPosts(p ?? DEFAULT_POSTS)
      setResources(r ?? DEFAULT_RESOURCES)
      setAbout(a ?? DEFAULT_ABOUT)
      setLoaded(true)
    })()
  }, [])

  const savePosts = async (updated) => {
    setPosts(updated)
    await storageSet('mystik:posts', updated)
  }

  const saveResources = async (updated) => {
    setResources(updated)
    await storageSet('mystik:resources', updated)
  }

  const saveAbout = async (updated) => {
    setAbout(updated)
    await storageSet('mystik:about', updated)
  }

  return { posts, resources, about, loaded, savePosts, saveResources, saveAbout }
}
