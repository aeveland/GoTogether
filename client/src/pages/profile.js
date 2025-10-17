/**
 * Profile Page Component
 * User profile management and settings
 */
import { ApiService } from '../utils/api.js';
import { AuthService } from '../utils/auth.js';

export class ProfilePage {
    constructor(props = {}) {
        this.props = props;
        this.apiService = new ApiService();
        this.authService = new AuthService();
        this.profile = null;
        this.isLoading = true;
        this.isEditing = false;
        
        // Bind methods
        this.handleEdit = this.handleEdit.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    /**
     * Render the profile page
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
                    <h1 class="app-bar-title ml-3">Profile</h1>
                </div>
                <div class="app-bar-actions">
                    <button class="mdc-button" id="logout-btn">
                        <span class="mdc-button__ripple"></span>
                        <i class="material-icons mdc-button__icon">logout</i>
                        <span class="mdc-button__label">Logout</span>
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
                    <p class="mt-2">Loading profile...</p>
                </div>

                <!-- Profile Content -->
                <div id="profile-content" class="d-none">
                    <div class="form-container">
                        <div class="text-center mb-4">
                            <div class="profile-avatar">
                                <i class="material-icons" style="font-size: 80px; color: var(--mdc-theme-primary);">account_circle</i>
                            </div>
                        </div>

                        <!-- Profile Form -->
                        <form id="profile-form">
                            <div class="form-field">
                                <label class="mdc-text-field mdc-text-field--filled" style="width: 100%;">
                                    <span class="mdc-text-field__ripple"></span>
                                    <span class="mdc-floating-label">Full Name</span>
                                    <input class="mdc-text-field__input" type="text" id="name" name="name" disabled>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <div class="form-field">
                                <label class="mdc-text-field mdc-text-field--filled" style="width: 100%;">
                                    <span class="mdc-text-field__ripple"></span>
                                    <span class="mdc-floating-label">Email</span>
                                    <input class="mdc-text-field__input" type="email" id="email" name="email" disabled>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <div class="form-field">
                                <label class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea" style="width: 100%;">
                                    <span class="mdc-text-field__ripple"></span>
                                    <span class="mdc-floating-label">Bio</span>
                                    <textarea class="mdc-text-field__input" id="bio" name="bio" rows="3" disabled></textarea>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <div class="form-field">
                                <label class="mdc-text-field mdc-text-field--filled" style="width: 100%;">
                                    <span class="mdc-text-field__ripple"></span>
                                    <span class="mdc-floating-label">Camper Type</span>
                                    <select class="mdc-text-field__input" id="camper-type" name="camperType" disabled>
                                        <option value="">Select camper type</option>
                                        <option value="tent">Tent</option>
                                        <option value="trailer">Trailer</option>
                                        <option value="rv">RV</option>
                                        <option value="cabin">Cabin</option>
                                        <option value="other">Other</option>
                                    </select>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <div class="form-field">
                                <label class="mdc-text-field mdc-text-field--filled mdc-text-field--textarea" style="width: 100%;">
                                    <span class="mdc-text-field__ripple"></span>
                                    <span class="mdc-floating-label">Dietary Preferences</span>
                                    <textarea class="mdc-text-field__input" id="dietary-preferences" name="dietaryPreferences" rows="2" disabled></textarea>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <div class="form-field">
                                <label class="mdc-text-field mdc-text-field--filled" style="width: 100%;">
                                    <span class="mdc-text-field__ripple"></span>
                                    <span class="mdc-floating-label">Group Size</span>
                                    <input class="mdc-text-field__input" type="number" id="group-size" name="groupSize" min="1" max="20" disabled>
                                    <span class="mdc-line-ripple"></span>
                                </label>
                            </div>

                            <!-- Form Actions -->
                            <div class="form-actions" id="form-actions">
                                <button type="button" class="mdc-button mdc-button--outlined" id="edit-btn">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon">edit</i>
                                    <span class="mdc-button__label">Edit Profile</span>
                                </button>
                            </div>

                            <!-- Edit Mode Actions -->
                            <div class="form-actions d-none" id="edit-actions">
                                <button type="button" class="mdc-button" id="cancel-btn">
                                    <span class="mdc-button__ripple"></span>
                                    <span class="mdc-button__label">Cancel</span>
                                </button>
                                <button type="submit" class="mdc-button mdc-button--raised" id="save-btn">
                                    <span class="mdc-button__ripple"></span>
                                    <i class="material-icons mdc-button__icon">save</i>
                                    <span class="mdc-button__label">Save Changes</span>
                                </button>
                            </div>
                        </form>

                        <!-- Account Settings -->
                        <div class="mt-4 pt-4" style="border-top: 1px solid #e0e0e0;">
                            <h3 class="mdc-typography--headline6 mb-3">Account Settings</h3>
                            
                            <button class="mdc-button mdc-button--outlined mb-2" style="width: 100%;" id="change-password-btn">
                                <span class="mdc-button__ripple"></span>
                                <i class="material-icons mdc-button__icon">lock</i>
                                <span class="mdc-button__label">Change Password</span>
                            </button>
                            
                            <button class="mdc-button mdc-button--outlined" style="width: 100%; color: #d32f2f; border-color: #d32f2f;" id="delete-account-btn">
                                <span class="mdc-button__ripple"></span>
                                <i class="material-icons mdc-button__icon">delete_forever</i>
                                <span class="mdc-button__label">Delete Account</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add event listeners
        this.attachEventListeners(container);
        
        // Load profile data
        this.loadProfile();

        return container;
    }

    /**
     * Attach event listeners
     * @param {HTMLElement} container - The container element
     */
    attachEventListeners(container) {
        const logoutBtn = container.querySelector('#logout-btn');
        const editBtn = container.querySelector('#edit-btn');
        const saveBtn = container.querySelector('#save-btn');
        const cancelBtn = container.querySelector('#cancel-btn');
        const changePasswordBtn = container.querySelector('#change-password-btn');
        const deleteAccountBtn = container.querySelector('#delete-account-btn');
        const profileForm = container.querySelector('#profile-form');

        logoutBtn?.addEventListener('click', () => this.authService.logout());
        editBtn?.addEventListener('click', this.handleEdit);
        saveBtn?.addEventListener('click', this.handleSave);
        cancelBtn?.addEventListener('click', this.handleCancel);
        changePasswordBtn?.addEventListener('click', this.handleChangePassword.bind(this));
        deleteAccountBtn?.addEventListener('click', this.handleDeleteAccount.bind(this));
        profileForm?.addEventListener('submit', this.handleSave);
    }

    /**
     * Load profile data from API
     */
    async loadProfile() {
        try {
            this.profile = await this.apiService.getProfile();
            this.renderProfile();
        } catch (error) {
            console.error('Failed to load profile:', error);
            this.showError('Failed to load profile. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    /**
     * Render profile data in form
     */
    renderProfile() {
        if (!this.profile) return;

        const profileContent = document.getElementById('profile-content');
        profileContent?.classList.remove('d-none');

        // Populate form fields
        document.getElementById('name').value = this.profile.name || '';
        document.getElementById('email').value = this.profile.email || '';
        document.getElementById('bio').value = this.profile.bio || '';
        document.getElementById('camper-type').value = this.profile.camper_type || '';
        document.getElementById('dietary-preferences').value = this.profile.dietary_preferences || '';
        document.getElementById('group-size').value = this.profile.group_size || 1;
    }

    /**
     * Handle edit mode
     */
    handleEdit() {
        this.isEditing = true;
        
        // Enable form fields
        const inputs = document.querySelectorAll('#profile-form input, #profile-form textarea, #profile-form select');
        inputs.forEach(input => {
            if (input.id !== 'email') { // Email should not be editable
                input.disabled = false;
            }
        });

        // Toggle action buttons
        document.getElementById('form-actions')?.classList.add('d-none');
        document.getElementById('edit-actions')?.classList.remove('d-none');
    }

    /**
     * Handle save changes
     * @param {Event} event - Form submit event
     */
    async handleSave(event) {
        event.preventDefault();
        
        if (!this.isEditing) return;

        try {
            const formData = new FormData(event.target);
            const profileData = {
                name: formData.get('name'),
                bio: formData.get('bio'),
                camper_type: formData.get('camperType'),
                dietary_preferences: formData.get('dietaryPreferences'),
                group_size: parseInt(formData.get('groupSize')) || 1
            };

            await this.apiService.updateProfile(profileData);
            
            // Update local profile data
            this.profile = { ...this.profile, ...profileData };
            
            // Exit edit mode
            this.handleCancel();
            
            this.showSuccess('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            this.showError('Failed to update profile. Please try again.');
        }
    }

    /**
     * Handle cancel edit
     */
    handleCancel() {
        this.isEditing = false;
        
        // Disable form fields
        const inputs = document.querySelectorAll('#profile-form input, #profile-form textarea, #profile-form select');
        inputs.forEach(input => {
            input.disabled = true;
        });

        // Restore original values
        this.renderProfile();

        // Toggle action buttons
        document.getElementById('edit-actions')?.classList.add('d-none');
        document.getElementById('form-actions')?.classList.remove('d-none');
    }

    /**
     * Handle change password
     */
    handleChangePassword() {
        alert('Change password functionality coming soon!');
    }

    /**
     * Handle delete account
     */
    handleDeleteAccount() {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            alert('Delete account functionality coming soon!');
        }
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
     * Show success message
     * @param {string} message - Success message
     */
    showSuccess(message) {
        alert(message);
    }
}
