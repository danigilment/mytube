"use client"

import { createContext, useState, useEffect } from "react"
import { isTimeBetween10AMand12PM, shouldUseLightTheme } from "../utils/themeUtils"
import { getUserState } from "../utils/geolocationService"

export const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark") // Default theme
  const [userState, setUserState] = useState(null)

  useEffect(() => {
    const checkTimeAndLocation = async () => {
      try {
        // Check time
        const isCorrectTime = isTimeBetween10AMand12PM()

        // Check location
        let state = null
        try {
          state = await getUserState()
          setUserState(state)
        } catch (err) {
          console.error("Could not get user location:", err)
        }

        // Set theme based on time and location
        if (shouldUseLightTheme(isCorrectTime, state)) {
          setTheme("light")
        } else {
          setTheme("dark")
        }
      } catch (error) {
        console.error("Error setting theme:", error)
      }
    }

    checkTimeAndLocation()
  }, [])

  return <ThemeContext.Provider value={{ theme, userState }}>{children}</ThemeContext.Provider>
}
