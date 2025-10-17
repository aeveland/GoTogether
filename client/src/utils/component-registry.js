/**
 * Component registry for managing page components
 * Allows for dynamic component loading and rendering
 */
export class ComponentRegistry {
    constructor() {
        this.components = new Map();
    }

    /**
     * Register a component class with a name
     * @param {string} name - Component name
     * @param {class} ComponentClass - Component class constructor
     */
    register(name, ComponentClass) {
        this.components.set(name, ComponentClass);
    }

    /**
     * Get a component class by name
     * @param {string} name - Component name
     * @returns {class|null} - Component class or null if not found
     */
    get(name) {
        return this.components.get(name) || null;
    }

    /**
     * Check if a component is registered
     * @param {string} name - Component name
     * @returns {boolean} - True if component exists
     */
    has(name) {
        return this.components.has(name);
    }

    /**
     * Get all registered component names
     * @returns {Array<string>} - Array of component names
     */
    getNames() {
        return Array.from(this.components.keys());
    }
}
