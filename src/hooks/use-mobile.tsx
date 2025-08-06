import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Check on initial mount
    checkDevice()

    // Add resize listener
    window.addEventListener("resize", checkDevice)

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", checkDevice)
  }, [])

  return isMobile
}
