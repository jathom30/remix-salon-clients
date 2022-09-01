import { useEffect, useState } from "react"
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

const screens = fullConfig.theme?.screens as unknown as { sm: string; md: string; lg: string; xl: string; '2xl': string }

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

  const breakpoint = () => {
    const keys = Object.keys(screens) as (keyof typeof screens)[]
    return keys.reduce((acc: keyof typeof screens, key) => {
      if (dimensions.width >= parseInt(screens[key])) {
        return key
      }
      return acc
    }, '2xl')
  }

  return { dimensions, breakpoint: breakpoint(), isMobile: dimensions.width <= parseInt(screens.md) }
}