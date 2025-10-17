/**
 * Simple client-side router for single-page application
 * Handles URL routing and navigation without page reloads
 */
export class Router {
    constructor() {
        this.routes = new Map();
        this.defaultRoute = '/';
        this.currentRoute = null;
        
        // Bind methods to preserve context
        this.handlePopState = this.handlePopState.bind(this);
        this.handleLinkClick = this.handleLinkClick.bind(this);
    }

    /**
     * Add a route with its handler function
     * @param {string} path - The route path (can include :param for dynamic segments)
     * @param {function} handler - Function to call when route matches
     */
    addRoute(path, handler) {
        this.routes.set(path, handler);
    }

    /**
     * Set the default route to redirect to when no route matches
     * @param {string} path - Default route path
     */
    setDefaultRoute(path) {
        this.defaultRoute = path;
    }

    /**
     * Start the router by setting up event listeners and handling initial route
     */
    start() {
        // Listen for browser back/forward button
        window.addEventListener('popstate', this.handlePopState);
        
        // Intercept link clicks for client-side navigation
        document.addEventListener('click', this.handleLinkClick);
        
        // Handle the initial route
        this.handleRoute(window.location.pathname);
    }

    /**
     * Navigate to a new route programmatically
     * @param {string} path - The path to navigate to
     * @param {boolean} replace - Whether to replace current history entry
     */
    navigate(path, replace = false) {
        if (replace) {
            window.history.replaceState({}, '', path);
        } else {
            window.history.pushState({}, '', path);
        }
        this.handleRoute(path);
    }

    /**
     * Handle browser back/forward navigation
     * @param {PopStateEvent} event - The popstate event
     */
    handlePopState(event) {
        this.handleRoute(window.location.pathname);
    }

    /**
     * Handle link clicks for client-side navigation
     * @param {Event} event - The click event
     */
    handleLinkClick(event) {
        // Only handle clicks on links with data-route attribute
        const link = event.target.closest('[data-route]');
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('data-route') || link.getAttribute('href');
            this.navigate(path);
        }
    }

    /**
     * Handle a route by finding matching handler and executing it
     * @param {string} path - The current path
     */
    handleRoute(path) {
        this.currentRoute = path;
        
        // Try to find exact match first
        if (this.routes.has(path)) {
            this.routes.get(path)();
            return;
        }

        // Try to find parameterized route match
        for (const [routePath, handler] of this.routes) {
            const params = this.matchRoute(routePath, path);
            if (params) {
                handler(params);
                return;
            }
        }

        // No route matched, redirect to default
        if (path !== this.defaultRoute) {
            this.navigate(this.defaultRoute, true);
        }
    }

    /**
     * Match a route pattern against a path and extract parameters
     * @param {string} routePath - The route pattern (e.g., '/trip/:id')
     * @param {string} actualPath - The actual path to match
     * @returns {object|null} - Parameters object or null if no match
     */
    matchRoute(routePath, actualPath) {
        const routeSegments = routePath.split('/');
        const pathSegments = actualPath.split('/');

        // Must have same number of segments
        if (routeSegments.length !== pathSegments.length) {
            return null;
        }

        const params = {};
        
        for (let i = 0; i < routeSegments.length; i++) {
            const routeSegment = routeSegments[i];
            const pathSegment = pathSegments[i];

            if (routeSegment.startsWith(':')) {
                // This is a parameter
                const paramName = routeSegment.slice(1);
                params[paramName] = pathSegment;
            } else if (routeSegment !== pathSegment) {
                // Segments don't match
                return null;
            }
        }

        return params;
    }

    /**
     * Get the current route path
     * @returns {string} - Current route path
     */
    getCurrentRoute() {
        return this.currentRoute;
    }
}
