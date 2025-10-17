/**
 * Simple Authentication Page
 * Basic login and registration without complex validation
 */
import { AuthService } from '../utils/auth.js';

export class SimpleAuthPage {
    constructor(props = {}) {
        this.props = props;
        this.authService = new AuthService();
        this.isLoginMode = props.mode !== 'signup';
    }

    render() {
        const container = document.createElement('div');
        container.style.cssText = `
            max-width: 400px;
            margin: 50px auto;
            padding: 30px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
        `;

        container.innerHTML = `
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1976d2; margin-bottom: 10px;">
                    ${this.isLoginMode ? 'Welcome Back' : 'Join Go Together'}
                </h1>
                <p style="color: #666; margin: 0;">
                    ${this.isLoginMode 
                        ? 'Sign in to plan your next adventure' 
                        : 'Create an account to start planning trips'
                    }
                </p>
            </div>

            <div id="error-message" style="display: none; background: #ffebee; color: #c62828; padding: 15px; border-radius: 4px; margin-bottom: 20px; border-left: 4px solid #f44336;">
            </div>

            <form id="auth-form">
                ${!this.isLoginMode ? `
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Full Name</label>
                        <input type="text" id="name" name="name" required 
                               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
                    </div>
                ` : ''}

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Email</label>
                    <input type="email" id="email" name="email" required 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">Password</label>
                    <input type="password" id="password" name="password" required 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
                    ${!this.isLoginMode ? `
                        <small style="color: #666; font-size: 12px;">Must be at least 6 characters</small>
                    ` : ''}
                </div>

                ${!this.isLoginMode ? `
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">Confirm Password</label>
                        <input type="password" id="confirm-password" name="confirmPassword" required 
                               style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; box-sizing: border-box;">
                    </div>
                ` : ''}

                <button type="submit" id="submit-btn" 
                        style="width: 100%; padding: 15px; background: #1976d2; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; margin-bottom: 20px;">
                    ${this.isLoginMode ? 'Sign In' : 'Create Account'}
                </button>
            </form>

            <div style="text-align: center;">
                <p style="margin: 0; color: #666;">
                    ${this.isLoginMode ? "Don't have an account?" : "Already have an account?"}
                    <button id="toggle-mode" 
                            style="background: none; border: none; color: #1976d2; cursor: pointer; text-decoration: underline; font-size: inherit;">
                        ${this.isLoginMode ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    attachEventListeners(container) {
        const form = container.querySelector('#auth-form');
        const toggleButton = container.querySelector('#toggle-mode');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });

        toggleButton.addEventListener('click', () => {
            this.toggleMode();
        });

        // Clear error on input
        const inputs = container.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.clearError();
            });
        });
    }

    async handleSubmit(event) {
        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        
        try {
            submitBtn.disabled = true;
            submitBtn.textContent = 'Please wait...';
            
            this.clearError();

            const formData = new FormData(event.target);
            const data = Object.fromEntries(formData.entries());

            if (this.isLoginMode) {
                await this.handleLogin(data);
            } else {
                await this.handleSignup(data);
            }
        } catch (error) {
            console.error('Auth error:', error);
            this.showError(error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    async handleLogin(data) {
        const { email, password } = data;
        
        if (!email || !password) {
            throw new Error('Please fill in all fields');
        }

        await this.authService.login(email, password);
        
        // Success - redirect to dashboard
        this.redirectToDashboard();
    }

    async handleSignup(data) {
        const { name, email, password, confirmPassword } = data;
        
        if (!name || !email || !password || !confirmPassword) {
            throw new Error('Please fill in all fields');
        }

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
        }

        await this.authService.register({
            name: name.trim(),
            email: email.trim(),
            password
        });
        
        // Success - redirect to dashboard
        this.redirectToDashboard();
    }

    redirectToDashboard() {
        // Simple redirect approach
        window.location.href = '/dashboard';
    }

    toggleMode() {
        this.isLoginMode = !this.isLoginMode;
        
        // Update URL
        const newPath = this.isLoginMode ? '/login' : '/signup';
        window.history.pushState({}, '', newPath);
        
        // Re-render
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.appendChild(this.render());
    }

    showError(message) {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    clearError() {
        const errorDiv = document.getElementById('error-message');
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
    }
}
