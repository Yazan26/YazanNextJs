const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const API_AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  profile: "/auth/profile",
  modules: "/vkm", // filtering available for location, level, studyCredit, and isActive
  // (locations include breda /breda en den bosch/den bosch/den bosch en tilburg/ tilburg,
  //  levels include NLQF6/NLQF5, studyCredit includes 15/30 
  //  isActive can be true/false)
  // post & get available
  // example: /vkm?location=breda&level=NLQF6&studyCredit=30&isActive=true
  moduleById: "/vkm/", // append a
  // unique module by id: /vkm/{id} //get,put,delete available 
  recommendations: "/vkm/recommendations/me", 
  // /vkm/recommendations/me?limit=2

  toggleFavorite: "/vkm/:id/favorite", // append a unique module by id: /vkm/{id}/favorite
  
  favorites: "/vkm/favorites", // get all favorited modules


} as const;
