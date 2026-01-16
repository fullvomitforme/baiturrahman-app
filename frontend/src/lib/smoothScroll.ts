'use client'

import { useEffect } from 'react'

export function useSmoothScroll() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')

      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href?.startsWith('#')) return

      e.preventDefault()

      const targetId = href.slice(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const navbarHeight = 64 // 16rem = 64px
        const targetPosition = targetElement.offsetTop - navbarHeight

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth',
        })

        // Update URL without triggering scroll
        history.pushState(null, '', href)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
