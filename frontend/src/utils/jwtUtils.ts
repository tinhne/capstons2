/**
 * Utility functions for handling JWT tokens
 */

import { TokenPayload } from "../features/auth/types";

/**
 * Decode a JWT token without library dependencies
 * @param token - JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): TokenPayload | null {
  try {
    // JWT format: header.payload.signature
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return null;
    }

    // Base64Url decode the payload (second part)
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

    // Decode and parse the payload as JSON
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as TokenPayload;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}

/**
 * Extract user roles from JWT token scope
 * @param token - JWT token string
 * @returns Array of roles or empty array if no roles found
 */
export function extractRolesFromToken(token: string): string[] {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.scope) {
      return [];
    }

    // Parse space-separated scope string
    const scopeItems = decoded.scope.split(" ");

    // Filter for role entries (starting with ROLE_)
    return scopeItems
      .filter((item) => item.startsWith("ROLE_"))
      .map((role) => role.replace("ROLE_", ""));
  } catch (error) {
    console.error("Failed to extract roles from token:", error);
    return [];
  }
}

/**
 * Check if the user has a specific role based on their token
 * @param token - JWT token string
 * @param roleName - Name of the role to check (without ROLE_ prefix)
 * @returns Boolean indicating if user has the specified role
 */
export function hasRoleFromToken(token: string, roleName: string): boolean {
  const roles = extractRolesFromToken(token);
  return roles.includes(roleName.toUpperCase());
}

/**
 * Get user ID from token (subject claim)
 * @param token - JWT token string
 * @returns User ID or null if not found
 */
export function getUserIdFromToken(token: string): string | null {
  const decoded = decodeToken(token);
  return decoded?.sub || null;
}
