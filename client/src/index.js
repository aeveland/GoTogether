console.log('Simple app starting');

// Detect if running on Vercel (no backend available)
const isVercelDeployment = window.location.hostname.includes('vercel.app') || window.location.hostname.includes('netlify.app');

document.addEventListener('DOMContentLoaded', function() {
    const app = document.getElementById('app');
    
    app.innerHTML = '<div style="padding: 40px; text-align: center; font-family: Arial;"><h1>Go Together</h1><p>Loading...</p></div>';
    
    // Simple login form
    setTimeout(function() {
        const demoNote = isVercelDeployment ? '<div style="background: #e3f2fd; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #1976d2;"><strong>Demo Mode:</strong> Use email: demo@example.com, password: demo123</div>' : '';
        
        app.innerHTML = '<div style="max-width: 400px; margin: 50px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); font-family: Arial;"><h1 style="color: #1976d2; text-align: center;">Login</h1>' + demoNote + '<form id="login-form"><div style="margin-bottom: 15px;"><label>Email:</label><input type="email" name="email" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" value="' + (isVercelDeployment ? 'demo@example.com' : '') + '"></div><div style="margin-bottom: 15px;"><label>Password:</label><input type="password" name="password" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;" value="' + (isVercelDeployment ? 'demo123' : '') + '"></div><button type="submit" style="width: 100%; padding: 15px; background: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">Login</button></form><div id="result"></div></div>';
        
        document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const email = formData.get('email');
            const password = formData.get('password');
            
            try {
                let data;
                
                if (isVercelDeployment) {
                    // Mock API for demo deployment
                    if (email === 'demo@example.com' && password === 'demo123') {
                        data = {
                            success: true,
                            data: {
                                user: { id: 1, name: 'Demo User', email: 'demo@example.com' },
                                token: 'demo-token-12345'
                            }
                        };
                    } else {
                        throw new Error('Invalid demo credentials. Use demo@example.com / demo123');
                    }
                } else {
                    // Real API for local development
                    const response = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ email: email, password: password })
                    });
                    
                    data = await response.json();
                    
                    if (!response.ok) {
                        throw new Error(data.message || 'Login failed');
                    }
                }
                
                localStorage.setItem('gotogether_token', data.data.token);
                localStorage.setItem('gotogether_user', JSON.stringify(data.data.user));
                
                // Show dashboard
                const deploymentNote = isVercelDeployment ? '<div style="background: #fff3e0; padding: 10px; border-radius: 4px; margin-bottom: 15px; font-size: 12px; color: #f57c00;">This is a demo deployment. Full backend features are available in the local version.</div>' : '';
                app.innerHTML = '<div style="padding: 40px; font-family: Arial;">' + deploymentNote + '<h1>Welcome ' + data.data.user.name + '!</h1><p>You are logged in successfully.</p><div style="margin: 20px 0;"><button onclick="showTrips()" style="padding: 10px 20px; background: #4caf50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">My Trips</button><button onclick="logout()" style="padding: 10px 20px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Logout</button></div><div id="dashboard-content"></div></div>';
                
            } catch (error) {
                document.getElementById('result').innerHTML = '<div style="color: red; margin-top: 10px;">Error: ' + error.message + '</div>';
            }
        });
    }, 100);
});

window.logout = function() {
    localStorage.removeItem('gotogether_token');
    localStorage.removeItem('gotogether_user');
    location.reload();
};

window.showTrips = function() {
    const content = document.getElementById('dashboard-content');
    if (isVercelDeployment) {
        // Mock trips for demo
        content.innerHTML = '<div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px;"><h3>Demo Trips</h3><div style="border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin: 10px 0;"><h4>Yosemite Adventure</h4><p>Weekend camping in beautiful Yosemite National Park</p><small>Nov 15-17, 2025</small></div><div style="border: 1px solid #ddd; padding: 15px; border-radius: 4px; margin: 10px 0;"><h4>Big Sur Coastal Trip</h4><p>Scenic coastal camping along the Big Sur coastline</p><small>Dec 1-3, 2025</small></div></div>';
    } else {
        content.innerHTML = '<div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin-top: 20px;"><h3>Your Trips</h3><p>Trip functionality will be implemented with the full backend.</p></div>';
    }
};
