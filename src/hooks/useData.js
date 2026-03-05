import { useState, useEffect } from 'react'
import { storageGet, storageSet } from '../utils/storage'
import { DEFAULT_POSTS, DEFAULT_RESOURCES, DEFAULT_ABOUT } from '../data/defaults'

// -- useData hook ----------------------------------------------------------
// Posts are sourced from .md files via DEFAULT_POSTS -- never localStorage.
// Resources and About are still managed via admin dashboard + localStorage.

export function useData() {
  const [posts, setPosts]           = useState([])
  const [resources, setResources]   = useState([])
  const [about, setAbout]           = useState(DEFAULT_ABOUT)
  const [loaded, setLoaded]         = useState(false)

  useEffect(() => {
    ;(async () => {
      // Posts come from .md files at build time -- localStorage is never used for posts
      const r = await storageGet('mystik:resources')
      const a = await storageGet('mystik:about')
      setPosts(DEFAULT_POSTS)
      setResources(r ?? DEFAULT_RESOURCES)
      setAbout(a ?? DEFAULT_ABOUT)
      setLoaded(true)
    })()
  }, [])

  // Posts: updates state only -- .md files are the source of truth
  const savePosts = async (updated) => {
    setPosts(updated)
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