/**
 * Simple Dashboard Page Component
 * Main landing page showing user's trips and quick actions
 */
import { AuthService } from '../utils/auth.js';

export class DashboardPage {
    constructor(props = {}) {
        this.props = props;
        this.authService = new AuthService();
    }

    render() {
        const container = document.createElement('div');
        container.style.cssText = `
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        `;

        // Get user info
        const user = this.authService.getUser();
        const userName = user ? user.name : 'User';

        container.innerHTML = `
            <!-- Header -->
            <div style="background: #1976d2; color: white; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin: 0; font-size: 28px;">Go Together</h1>
                    <p style="margin: 5px 0 0 0; opacity: 0.9;">Welcome back, ${userName}!</p>
                </div>
                <div>
                    <button id="profile-btn" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 15px; border-radius: 4px; margin-right: 10px; cursor: pointer;">
                        Profile
                    </button>
                    <button id="logout-btn" style="background: rgba(255,255,255,0.2); color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer;">
                        Logout
                    </button>
                </div>
            </div>

            <!-- Main Content -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
                <!-- Quick Actions -->
                <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="margin: 0 0 20px 0; color: #333;">Quick Actions</h2>
                    <div style="display: flex; flex-direction: column; gap: 15px;">
                        <button id="create-trip-btn" style="background: #4caf50; color: white; border: none; padding: 15px; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold;">
                            🏕️ Create New Trip
                        </button>
                        <button id="join-trip-btn" style="background: #2196f3; color: white; border: none; padding: 15px; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold;">
                            🤝 Join Existing Trip
                        </button>
                        <button id="browse-trips-btn" style="background: #ff9800; color: white; border: none; padding: 15px; border-radius: 4px; font-size: 16px; cursor: pointer; font-weight: bold;">
                            🔍 Browse Public Trips
                        </button>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="margin: 0 0 20px 0; color: #333;">Recent Activity</h2>
                    <div id="recent-activity" style="color: #666;">
                        <p style="text-align: center; padding: 20px;">No recent activity yet. Create your first trip to get started!</p>
                    </div>
                </div>
            </div>

            <!-- Your Trips -->
            <div style="background: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #333;">Your Trips</h2>
                    <button id="refresh-trips-btn" style="background: #e0e0e0; color: #333; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;">
                        🔄 Refresh
                    </button>
                </div>
                <div id="trips-container">
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3 style="margin: 0 0 10px 0;">No trips yet</h3>
                        <p style="margin: 0;">Create your first trip to start planning your adventure!</p>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 40px; padding: 20px; color: #666;">
                <p style="margin: 0;">Go Together - Plan amazing trips with friends</p>
            </div>
        `;

        this.attachEventListeners(container);
        return container;
    }

    attachEventListeners(container) {
        // Logout button
        const logoutBtn = container.querySelector('#logout-btn');
        logoutBtn.addEventListener('click', () => {
            this.authService.logout();
        });

        // Profile button
        const profileBtn = container.querySelector('#profile-btn');
        profileBtn.addEventListener('click', () => {
            window.location.href = '/profile';
        });

        // Create trip button
        const createTripBtn = container.querySelector('#create-trip-btn');
        createTripBtn.addEventListener('click', () => {
            this.handleCreateTrip();
        });

        // Join trip button
        const joinTripBtn = container.querySelector('#join-trip-btn');
        joinTripBtn.addEventListener('click', () => {
            this.handleJoinTrip();
        });

        // Browse trips button
        const browseTripBtn = container.querySelector('#browse-trips-btn');
        browseTripBtn.addEventListener('click', () => {
            this.handleBrowseTrips();
        });

        // Refresh trips button
        const refreshBtn = container.querySelector('#refresh-trips-btn');
        refreshBtn.addEventListener('click', () => {
            this.loadTrips();
        });
    }

    handleCreateTrip() {
        const tripName = prompt('Enter a name for your new trip:');
        if (tripName && tripName.trim()) {
            alert(`Creating trip: ${tripName.trim()}\nThis feature will be implemented soon!`);
        }
    }

    handleJoinTrip() {
        const tripCode = prompt('Enter the trip invitation code:');
        if (tripCode && tripCode.trim()) {
            alert(`Joining trip with code: ${tripCode.trim()}\nThis feature will be implemented soon!`);
        }
    }

    handleBrowseTrips() {
        alert('Browse public trips feature will be implemented soon!');
    }

    async loadTrips() {
        // This would normally load trips from the API
        // For now, just show a message
        const container = document.getElementById('trips-container');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 20px; color: #666;">
                    <p>Loading trips... (API integration coming soon)</p>
                </div>
            `;
        }
    }
}
