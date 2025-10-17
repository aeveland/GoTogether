/**
 * Application Configuration
 * Environment-specific settings for the Go Together app
 */

const config = {
    development: {
        API_BASE_URL: '/api',
        APP_NAME: 'Go Together (Dev)',
        DEBUG: true
    },
    production: {
        API_BASE_URL: 'https://your-backend-api.herokuapp.com/api', // Update this when you deploy backend
        APP_NAME: 'Go Together',
        DEBUG: false
    },
    demo: {
        API_BASE_URL: '/api/mock', // For demo/static deployment
        APP_NAME: 'Go Together (Demo)',
        DEBUG: false
    }
};

// Determine environment
const getEnvironment = () => {
    console.log('Detecting environment for hostname:', window.location.hostname);
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Environment: development');
        return 'development';
    }
    
    // Check if this is a demo deployment (no real backend)
    if (window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app')) {
        console.log('Environment: demo');
        return 'demo';
    }
    
    console.log('Environment: production');
    return 'production';
};

const currentEnv = getEnvironment();
const appConfig = config[currentEnv];

console.log('App config loaded:', appConfig);

export default appConfig;
