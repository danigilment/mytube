// Helper functions for theme detection based on time and location

// Function to check if time is between 10 AM and 12 PM
export const isTimeBetween10AMand12PM = () => {
  const currentHour = new Date().getHours()
  return currentHour >= 10 && currentHour < 12
}

// South Indian states list
export const southIndianStates = ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"]

// Function to check if location is in South India
export const isLocationSouthIndia = (state) => {
  if (!state) return false
  return southIndianStates.some((s) => state.toLowerCase().includes(s.toLowerCase()))
}

// Function to determine theme based on time and location
export const shouldUseLightTheme = (time, state) => {
  // Use light theme if time is between 10 AM and 12 PM AND location is in South India
  return time && isLocationSouthIndia(state)
}
