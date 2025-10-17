/**
 * JWT utility functions
 */

export interface JWTPayload {
  sub: string; // user ID
  username: string;
  email: string;
  role?: string;
  iat: number; // issued at
  exp: number; // expiration
  [key: string]: unknown; // Allow additional properties
}

/**
 * Decode a JWT token and return the payload
 * @param token - The JWT token to decode
 * @returns The decoded payload
 */
export function decodeJWT(token: string): JWTPayload {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload (base64)
    const payload = parts[1];
    const decoded = atob(payload);
    
    return JSON.parse(decoded) as JWTPayload;
  } catch {
    throw new Error('Failed to decode JWT token');
  }
}

/**
 * Check if a JWT token is expired
 * @param token - The JWT token to check
 * @returns true if expired, false otherwise
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJWT(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
}

/**
 * Get the user info from a JWT token
 * @param token - The JWT token
 * @returns User object with id, username, email, and role
 */
export function getUserFromToken(token: string) {
  const payload = decodeJWT(token);
  const user = {
    id: payload.sub,
    username: payload.username,
    email: payload.email,
    role: payload.role || 'student',
  };

  return user;
}
