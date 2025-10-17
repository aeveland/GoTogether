// Minimal test - just show something on the page
console.log('Minimal test script loaded');

// Mark that script loaded
window.goTogetherScriptLoaded = true;

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded in minimal test');
    
    const app = document.getElementById('app');
    if (app) {
        console.log('App element found, showing test content');
        app.innerHTML = `
            <div style="padding: 40px; font-family: Arial, sans-serif; text-align: center; background: #f5f5f5; min-height: 100vh;">
                <h1 style="color: #1976d2; margin-bottom: 20px;">🎉 SUCCESS!</h1>
                <p style="font-size: 18px; margin-bottom: 30px;">The app is loading properly!</p>
                
                <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 500px; margin: 0 auto;">
                    <h2 style="color: #333; margin-bottom: 20px;">Go Together - Working!</h2>
                    
                    <p style="margin-bottom: 20px;">The JavaScript bundle is loading correctly. Now we can add back the full app functionality.</p>
                    
                    <button onclick="testLogin()" style="background: #4caf50; color: white; border: none; padding: 15px 30px; border-radius: 4px; cursor: pointer; margin: 10px; font-size: 16px;">
                        Test Login API
                    </button>
                    
                    <button onclick="showFullApp()" style="background: #2196f3; color: white; border: none; padding: 15px 30px; border-radius: 4px; cursor: pointer; margin: 10px; font-size: 16px;">
                        Load Full App
                    </button>
                    
                    <div id="test-result" style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-radius: 4px; text-align: left; font-family: monospace; font-size: 12px;">
                        Ready for testing...
                    </div>
                </div>
            </div>
        `;
    } else {
        console.error('App element not found!');
        document.body.innerHTML = '<h1 style="color: red; text-align: center; padding: 50px;">ERROR: App element not found in DOM</h1>';
    }
});

// Test functions
window.testLogin = async () => {
    const resultDiv = document.getElementById('test-result');
    resultDiv.innerHTML = 'Testing API connection...';
    
    try {
        // Test health endpoint first
        const healthResponse = await fetch('/api/health');
        const healthData = await healthResponse.json();
        
        resultDiv.innerHTML = \`API Health Check: ✅ SUCCESS
Server Status: \${healthData.status}
Database: \${healthData.database ? '✅ Connected' : '❌ Disconnected'}

Ready to test authentication!\`;
        
    } catch (error) {
        resultDiv.innerHTML = \`❌ API Connection Failed: \${error.message}\`;
    }
};

window.showFullApp = () => {
    const resultDiv = document.getElementById('test-result');
    resultDiv.innerHTML = 'Loading full app functionality...';
    
    // This would reload with the full app
    setTimeout(() => {
        resultDiv.innerHTML = 'Full app loading would be implemented here. For now, this confirms the basic structure works!';
    }, 1000);
};
