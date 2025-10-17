/**
 * Trip Page Component
 * Detailed view of a specific trip with shopping lists, todos, and notes
 */
import { ApiService } from '../utils/api.js';

export class TripPage {
    constructor(props = {}) {
        this.props = props;
        this.tripId = props.tripId;
        this.apiService = new ApiService();
        this.trip = null;
        this.activeTab = 'overview';
        
        // Bind methods
        this.handleTabChange = this.handleTabChange.bind(this);
    }

    /**
     * Render the trip page
     * @returns {HTMLElement} - The rendered page element
     */
    render() {
        const container = document.createElement('div');
        container.className = 'fade-in';
        
        container.innerHTML = `
            <!-- App Bar -->
            <div class="app-bar">
                <div class="d-flex align-center">
                    <button class="mdc-button" data-route="/dashboard">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">arrow_back</i>
                        <span class="mdc-button__label">Back</span>
                    </button>
                    <h1 class="app-bar-title ml-3">Trip Details</h1>
                </div>
                <div class="app-bar-actions">
                    <button class="mdc-button" id="invite-btn">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">person_add</i>
                        <span class="mdc-button__label">Invite</span>
                    </button>
                </div>
            </div>

            <div class="page-container">
                <!-- Loading State -->
                <div id="loading-state" class="text-center p-4">
                    <div class="mdc-circular-progress" style="width:48px;height:48px;" role="progressbar">
                        <div class="mdc-circular-progress__indeterminate-container">
                            <div class="mdc-circular-progress__spinner-layer">
                                <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
                                    <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48">
                                        <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
                                    </svg>
                                </div>
                                <div class="mdc-circular-progress__gap-patch">
                                    <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48">
                                        <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2"/>
                                    </svg>
                                </div>
                                <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
                                    <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48">
                                        <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="mt-2">Loading trip details...</p>
                </div>

                <!-- Trip Content -->
                <div id="trip-content" class="d-none">
                    <!-- Trip Header -->
                    <div id="trip-header" class="mb-4"></div>

                    <!-- Tab Bar -->
                    <div class="mdc-tab-bar" role="tablist" id="trip-tabs">
                        <div class="mdc-tab-scroller">
                            <div class="mdc-tab-scroller__scroll-area">
                                <div class="mdc-tab-scroller__scroll-content">
                                    <button class="mdc-tab mdc-tab--active" role="tab" data-tab="overview">
                                        <span class="mdc-tab__content">
                                            <span class="mdc-tab__icon material-icons">info</span>
                                            <span class="mdc-tab__text-label">Overview</span>
                                        </span>
                                        <span class="mdc-tab-indicator mdc-tab-indicator--active">
                                            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                        </span>
                                        <span class="mdc-tab__ripple"></span>
                                    </button>
                                    <button class="mdc-tab" role="tab" data-tab="shopping">
                                        <span class="mdc-tab__content">
                                            <span class="mdc-tab__icon material-icons">shopping_cart</span>
                                            <span class="mdc-tab__text-label">Shopping</span>
                                        </span>
                                        <span class="mdc-tab-indicator">
                                            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                        </span>
                                        <span class="mdc-tab__ripple"></span>
                                    </button>
                                    <button class="mdc-tab" role="tab" data-tab="todos">
                                        <span class="mdc-tab__content">
                                            <span class="mdc-tab__icon material-icons">checklist</span>
                                            <span class="mdc-tab__text-label">To-Dos</span>
                                        </span>
                                        <span class="mdc-tab-indicator">
                                            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                        </span>
                                        <span class="mdc-tab__ripple"></span>
                                    </button>
                                    <button class="mdc-tab" role="tab" data-tab="notes">
                                        <span class="mdc-tab__content">
                                            <span class="mdc-tab__icon material-icons">note</span>
                                            <span class="mdc-tab__text-label">Notes</span>
                                        </span>
                                        <span class="mdc-tab-indicator">
                                            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
                                        </span>
                                        <span class="mdc-tab__ripple"></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Tab Content -->
                    <div id="tab-content" class="mt-4"></div>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachEventListeners(container);
        
        // Load trip data
        this.loadTrip();

        return container;
    }

    /**
     * Attach event listeners
     * @param {HTMLElement} container - The container element
     */
    attachEventListeners(container) {
        // Tab navigation
        const tabs = container.querySelectorAll('.mdc-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', this.handleTabChange);
        });

        // Invite button
        const inviteBtn = container.querySelector('#invite-btn');
        inviteBtn?.addEventListener('click', this.handleInvite.bind(this));
    }

    /**
     * Load trip data from API
     */
    async loadTrip() {
        try {
            this.trip = await this.apiService.getTrip(this.tripId);
            this.renderTripContent();
        } catch (error) {
            console.error('Failed to load trip:', error);
            this.showError('Failed to load trip details. Please try again.');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Render trip content
     */
    renderTripContent() {
        const tripContent = document.getElementById('trip-content');
        const tripHeader = document.getElementById('trip-header');
        
        if (tripHeader && this.trip) {
            tripHeader.innerHTML = this.renderTripHeader();
        }
        
        tripContent?.classList.remove('d-none');
        
        // Render initial tab content
        this.renderTabContent();
    }

    /**
     * Render trip header
     * @returns {string} - HTML string for trip header
     */
    renderTripHeader() {
        if (!this.trip) return '';

        const startDate = new Date(this.trip.start_date);
        const endDate = new Date(this.trip.end_date);

        return `
            <div class="mdc-card">
                <div class="mdc-card__content">
                    <h2 class="mdc-typography--headline5 mb-2">${this.trip.name}</h2>
                    <div class="d-flex flex-column gap-2">
                        <div class="d-flex align-center">
                            <i class="material-icons mr-2">location_on</i>
                            <span>${this.trip.location}</span>
                        </div>
                        <div class="d-flex align-center">
                            <i class="material-icons mr-2">date_range</i>
                            <span>${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}</span>
                        </div>
                        <div class="d-flex align-center">
                            <i class="material-icons mr-2">group</i>
                            <span>${this.trip.member_count || 0} members</span>
                        </div>
                    </div>
                    ${this.trip.description ? `
                        <p class="mdc-typography--body2 mt-3">${this.trip.description}</p>
                    ` : ''}
                </div>
            </div>
        `;
    }

    /**
     * Handle tab change
     * @param {Event} event - Click event
     */
    handleTabChange(event) {
        const tab = event.currentTarget;
        const tabName = tab.getAttribute('data-tab');
        
        if (tabName && tabName !== this.activeTab) {
            // Update active tab
            document.querySelectorAll('.mdc-tab').forEach(t => {
                t.classList.remove('mdc-tab--active');
                t.querySelector('.mdc-tab-indicator').classList.remove('mdc-tab-indicator--active');
            });
            
            tab.classList.add('mdc-tab--active');
            tab.querySelector('.mdc-tab-indicator').classList.add('mdc-tab-indicator--active');
            
            this.activeTab = tabName;
            this.renderTabContent();
        }
    }

    /**
     * Render content for active tab
     */
    renderTabContent() {
        const tabContent = document.getElementById('tab-content');
        if (!tabContent) return;

        switch (this.activeTab) {
            case 'overview':
                tabContent.innerHTML = this.renderOverviewTab();
                break;
            case 'shopping':
                tabContent.innerHTML = this.renderShoppingTab();
                break;
            case 'todos':
                tabContent.innerHTML = this.renderTodosTab();
                break;
            case 'notes':
                tabContent.innerHTML = this.renderNotesTab();
                break;
            default:
                tabContent.innerHTML = '<p>Tab content not found</p>';
        }
    }

    /**
     * Render overview tab content
     * @returns {string} - HTML string
     */
    renderOverviewTab() {
        return `
            <div class="slide-up">
                <h3 class="mdc-typography--headline6 mb-3">Trip Overview</h3>
                <div class="card-grid">
                    <div class="mdc-card">
                        <div class="mdc-card__content text-center">
                            <i class="material-icons" style="font-size: 48px; color: var(--mdc-theme-primary);">shopping_cart</i>
                            <h4 class="mdc-typography--headline6">Shopping List</h4>
                            <p class="mdc-typography--body2">Shared shopping list for the trip</p>
                            <button class="mdc-button mdc-button--outlined" data-tab-switch="shopping">
                                <span class="mdc-button__label">View Shopping List</span>
                            </button>
                        </div>
                    </div>
                    <div class="mdc-card">
                        <div class="mdc-card__content text-center">
                            <i class="material-icons" style="font-size: 48px; color: var(--mdc-theme-primary);">checklist</i>
                            <h4 class="mdc-typography--headline6">To-Do List</h4>
                            <p class="mdc-typography--body2">Tasks and preparations for the trip</p>
                            <button class="mdc-button mdc-button--outlined" data-tab-switch="todos">
                                <span class="mdc-button__label">View To-Dos</span>
                            </button>
                        </div>
                    </div>
                    <div class="mdc-card">
                        <div class="mdc-card__content text-center">
                            <i class="material-icons" style="font-size: 48px; color: var(--mdc-theme-primary);">note</i>
                            <h4 class="mdc-typography--headline6">Notes</h4>
                            <p class="mdc-typography--body2">Shared notes and information</p>
                            <button class="mdc-button mdc-button--outlined" data-tab-switch="notes">
                                <span class="mdc-button__label">View Notes</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render shopping tab content
     * @returns {string} - HTML string
     */
    renderShoppingTab() {
        return `
            <div class="slide-up">
                <div class="d-flex justify-between align-center mb-3">
                    <h3 class="mdc-typography--headline6">Shopping List</h3>
                    <button class="mdc-button mdc-button--raised">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">add</i>
                        <span class="mdc-button__label">Add Item</span>
                    </button>
                </div>
                <div class="text-center p-4">
                    <i class="material-icons" style="font-size: 64px; color: #ccc;">shopping_cart</i>
                    <p class="mdc-typography--body1">Shopping list functionality coming soon!</p>
                </div>
            </div>
        `;
    }

    /**
     * Render todos tab content
     * @returns {string} - HTML string
     */
    renderTodosTab() {
        return `
            <div class="slide-up">
                <div class="d-flex justify-between align-center mb-3">
                    <h3 class="mdc-typography--headline6">To-Do List</h3>
                    <button class="mdc-button mdc-button--raised">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">add</i>
                        <span class="mdc-button__label">Add Task</span>
                    </button>
                </div>
                <div class="text-center p-4">
                    <i class="material-icons" style="font-size: 64px; color: #ccc;">checklist</i>
                    <p class="mdc-typography--body1">To-do list functionality coming soon!</p>
                </div>
            </div>
        `;
    }

    /**
     * Render notes tab content
     * @returns {string} - HTML string
     */
    renderNotesTab() {
        return `
            <div class="slide-up">
                <div class="d-flex justify-between align-center mb-3">
                    <h3 class="mdc-typography--headline6">Notes</h3>
                    <button class="mdc-button mdc-button--raised">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">add</i>
                        <span class="mdc-button__label">Add Note</span>
                    </button>
                </div>
                <div class="text-center p-4">
                    <i class="material-icons" style="font-size: 64px; color: #ccc;">note</i>
                    <p class="mdc-typography--body1">Notes functionality coming soon!</p>
                </div>
            </div>
        `;
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loadingState = document.getElementById('loading-state');
        loadingState?.classList.add('d-none');
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        alert(message);
    }

    /**
     * Handle invite functionality
     */
    handleInvite() {
        alert('Invite functionality coming soon!');
    }
}
