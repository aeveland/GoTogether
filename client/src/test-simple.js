// Simple test to see if basic JavaScript is working
console.log('Test script loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded');
    
    const app = document.getElementById('app');
    if (app) {
        console.log('App element found');
        app.innerHTML = `
            <div style="padding: 40px; font-family: Arial, sans-serif; text-align: center;">
                <h1 style="color: #1976d2;">Go Together - Debug Mode</h1>
                <p>If you can see this, JavaScript is working!</p>
                <button onclick="testAuth()" style="background: #4caf50; color: white; border: none; padding: 15px 30px; border-radius: 4px; cursor: pointer; margin: 10px;">
                    Test Auth
                </button>
                <button onclick="showLogin()" style="background: #2196f3; color: white; border: none; padding: 15px 30px; border-radius: 4px; cursor: pointer; margin: 10px;">
                    Show Login
                </button>
                <div id="debug-output" style="margin-top: 20px; padding: 20px; background: #f5f5f5; border-radius: 4px; text-align: left;">
                    <h3>Debug Output:</h3>
                    <div id="debug-content">Ready...</div>
                </div>
            </div>
        `;
    } else {
        console.error('App element not found!');
        document.body.innerHTML = '<h1>ERROR: App element not found</h1>';
    }
});

window.testAuth = async () => {
    const debugContent = document.getElementById('debug-content');
    debugContent.innerHTML = 'Testing authentication...';
    
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        debugContent.innerHTML = `Health check: ${JSON.stringify(data, null, 2)}`;
    } catch (error) {
        debugContent.innerHTML = `Error: ${error.message}`;
    }
};

window.showLogin = () => {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="max-width: 400px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: Arial, sans-serif;">
            <h1 style="color: #1976d2; text-align: center;">Simple Login</h1>
            <form id="simple-login">
                <div style="margin-bottom: 15px;">
                    <label>Email:</label>
                    <input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label>Password:</label>
                    <input type="password" name="password" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                <button type="submit" style="width: 100%; padding: 15px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Login
                </button>
            </form>
            <div id="login-result" style="margin-top: 15px;"></div>
        </div>
    `;
    
    document.getElementById('simple-login').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        const resultDiv = document.getElementById('login-result');
        resultDiv.innerHTML = 'Logging in...';
        
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                resultDiv.innerHTML = `<div style="color: green;">Success! ${JSON.stringify(data)}</div>`;
            } else {
                resultDiv.innerHTML = `<div style="color: red;">Error: ${data.message}</div>`;
            }
        } catch (error) {
            resultDiv.innerHTML = `<div style="color: red;">Network error: ${error.message}</div>`;
        }
    });
};
