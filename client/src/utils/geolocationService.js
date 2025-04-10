// Service to detect user location

// Function to get user's state from coordinates
export const getStateFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    )
    const data = await response.json()
    return data.principalSubdivision // This returns the state/province
  } catch (error) {
    console.error("Error getting location:", error)
    return null
  }
}

// Function to get user's state
export const getUserState = () => {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const state = await getStateFromCoordinates(position.coords.latitude, position.coords.longitude)
          resolve(state)
        },
        (error) => {
          console.error("Error:", error)
          reject(error)
        },
      )
    } else {
      reject(new Error("Geolocation not available"))
    }
  })
}
