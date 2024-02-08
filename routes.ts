/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/new-verification"];

/**
 * An array of routes that are used for authentication
 * Logged-in users will be redirected to /settings or /dashboard
 * @type {string[]}
 */
export const authRoutes = ["/login", "/register"];

/**
 * The prefix for API Authentication routes
 * Routes that start with this prefix are used for API Authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/user";
