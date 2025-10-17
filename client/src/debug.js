/**
 * Debug script to test authentication flow
 */
import config from './config.js';
import { AuthService } from './utils/auth.js';
import { MockApiService } from './utils/mock-api.js';

// Create debug function that can be called from browser console
window.debugGoTogether = async function() {
    console.log('=== Go Together Debug Test ===');
    
    // Test 1: Check environment detection
    console.log('1. Environment Detection:');
    console.log('   Hostname:', window.location.hostname);
    console.log('   Config:', config);
    
    // Test 2: Test MockApiService directly
    console.log('\n2. Testing MockApiService directly:');
    try {
        const mockApi = new MockApiService();
        const loginResult = await mockApi.login('demo@example.com', 'Demo123');
        console.log('   Mock login result:', loginResult);
    } catch (error) {
        console.error('   Mock login error:', error);
    }
    
    // Test 3: Test AuthService
    console.log('\n3. Testing AuthService:');
    try {
        const authService = new AuthService();
        console.log('   AuthService baseUrl:', authService.baseUrl);
        console.log('   AuthService has mockApi:', !!authService.mockApi);
        
        const authResult = await authService.login('demo@example.com', 'Demo123');
        console.log('   Auth login result:', authResult);
        
        const isAuth = await authService.isAuthenticated();
        console.log('   Is authenticated:', isAuth);
    } catch (error) {
        console.error('   Auth service error:', error);
    }
    
    console.log('\n=== Debug Test Complete ===');
};

console.log('Debug script loaded. Run debugGoTogether() in console to test authentication.');
