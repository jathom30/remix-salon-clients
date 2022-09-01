import { useEffect, useState } from "react"

export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: 0, height: 0
  })
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  // ? 768 is tailwind md breakpoint
  return { dimensions, isMobile: dimensions.width <= 768 }
}