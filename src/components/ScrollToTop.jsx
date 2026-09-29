import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop component that scrolls to the top of the page on route change.
 * Mount inside Router, before Routes.
 * Uses useLayoutEffect to scroll before paint.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      const element = document.querySelector(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'instant', block: 'start' })
        return
      }
    }

    // Otherwise scroll to top
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }, [pathname, hash])

  return null
}

export default ScrollToTop
