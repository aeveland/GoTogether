/**
 * Go Together - Main Application Entry Point
 * 
 * This file initializes the Material Design Web components and starts the application.
 * It handles routing, authentication state, and renders the appropriate views.
 */

import './styles/main.css';
import { Router } from './utils/router.js';
import { AuthService } from './utils/auth.js';
import { ApiService } from './utils/api.js';
import { ComponentRegistry } from './utils/component-registry.js';

// Import page components
import { LoginPage } from './pages/login.js';
import { DashboardPage } from './pages/dashboard.js';
import { TripPage } from './pages/trip.js';
import { ProfilePage } from './pages/profile.js';

class GoTogetherApp {
    constructor() {
        this.router = new Router();
        this.authService = new AuthService();
        this.apiService = new ApiService();
        this.componentRegistry = new ComponentRegistry();
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Hide loading spinner
            this.hideLoadingSpinner();
            
            // Initialize Material Design Web components
            this.initMDCComponents();
            
            // Register page components
            this.registerComponents();
            
            // Set up routing
            this.setupRouting();
            
            // Check authentication status
            await this.checkAuthStatus();
            
            // Make router globally accessible for navigation from components
            window.goTogetherRouter = this.router;
        
            // Start the router
            this.router.start();
            
            console.log('Go Together app initialized successfully');
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.showError('Failed to load application. Please refresh the page.');
        }
    }

    /**
     * Hide the loading spinner and show the app
     */
    hideLoadingSpinner() {
        const loadingContainer = document.querySelector('.loading-container');
        if (loadingContainer) {
            loadingContainer.style.display = 'none';
        }
    }

    /**
     * Initialize Material Design Web components
     */
    initMDCComponents() {
        // Auto-initialize all MDC components on the page
        if (window.mdc && window.mdc.autoInit) {
            window.mdc.autoInit();
        }
    }

    /**
     * Register all page components with the component registry
     */
    registerComponents() {
        this.componentRegistry.register('login-page', LoginPage);
        this.componentRegistry.register('dashboard-page', DashboardPage);
        this.componentRegistry.register('trip-page', TripPage);
        this.componentRegistry.register('profile-page', ProfilePage);
    }

    /**
     * Set up application routing
     */
    setupRouting() {
        // Public routes (no authentication required)
        this.router.addRoute('/', () => this.renderPage('login-page'));
        this.router.addRoute('/login', () => this.renderPage('login-page'));
        this.router.addRoute('/signup', () => this.renderPage('login-page', { mode: 'signup' }));
        
        // Protected routes (authentication required)
        this.router.addRoute('/dashboard', () => this.requireAuth(() => this.renderPage('dashboard-page')));
        this.router.addRoute('/trip/:id', (params) => this.requireAuth(() => this.renderPage('trip-page', { tripId: params.id })));
        this.router.addRoute('/profile', () => this.requireAuth(() => this.renderPage('profile-page')));
        
        // Default route
        this.router.setDefaultRoute('/dashboard');
    }

    /**
     * Check if user is authenticated and redirect accordingly
     */
    async checkAuthStatus() {
        console.log('Checking auth status...');
        const isAuthenticated = await this.authService.isAuthenticated();
        const currentPath = window.location.pathname;
        
        console.log('Auth status:', isAuthenticated, 'Current path:', currentPath);
        
        if (isAuthenticated && (currentPath === '/' || currentPath === '/login' || currentPath === '/signup')) {
            // User is authenticated but on a public page, redirect to dashboard
            console.log('User authenticated on public page, redirecting to dashboard');
            this.router.navigate('/dashboard');
        } else if (!isAuthenticated && !this.isPublicRoute(currentPath)) {
            // User is not authenticated but trying to access protected route
            console.log('User not authenticated on protected route, redirecting to login');
            this.router.navigate('/login');
        } else {
            console.log('No redirect needed');
        }
    }

    /**
     * Check if a route is public (doesn't require authentication)
     */
    isPublicRoute(path) {
        const publicRoutes = ['/', '/login', '/signup'];
        return publicRoutes.includes(path);
    }

    /**
     * Middleware to require authentication for protected routes
     */
    requireAuth(callback) {
        return async () => {
            const isAuthenticated = await this.authService.isAuthenticated();
            if (isAuthenticated) {
                callback();
            } else {
                this.router.navigate('/login');
            }
        };
    }

    /**
     * Render a page component
     */
    renderPage(componentName, props = {}) {
        const app = document.getElementById('app');
        const ComponentClass = this.componentRegistry.get(componentName);
        
        if (ComponentClass) {
            // Clear existing content
            app.innerHTML = '';
            
            // Create and render the component
            const component = new ComponentClass(props);
            app.appendChild(component.render());
            
            // Re-initialize MDC components for the new content
            this.initMDCComponents();
        } else {
            console.error(`Component ${componentName} not found`);
            this.showError('Page not found');
        }
    }

    /**
     * Show an error message to the user
     */
    showError(message) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="error-container">
                <div class="mdc-card error-card">
                    <div class="mdc-card__primary-action">
                        <div class="mdc-card__content">
                            <h2 class="mdc-typography--headline6">Error</h2>
                            <p class="mdc-typography--body2">${message}</p>
                        </div>
                    </div>
                    <div class="mdc-card__actions">
                        <button class="mdc-button mdc-card__action mdc-card__action--button" onclick="window.location.reload()">
                            <span class="mdc-button__label">Reload Page</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the application when the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new GoTogetherApp();
});
