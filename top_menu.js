document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        defaultSection: 'home_section',
        scrollOffset: document.querySelector('header')?.offsetHeight || 0,
        scrollBehavior: 'smooth',
        useHashInURL: false
    };

    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const contentLinks = document.querySelectorAll('a[href^="#"]'); // Select all anchor links
    const contentSections = document.querySelectorAll('.content-section');
    const header = document.querySelector('header');
    const homeSection = document.getElementById('home_section');

    // State management
    let isPopState = false;
    let currentSection = config.defaultSection;

    // Initialize the page
    function init() {
        // Set up initial state
        const initialSection = getInitialSection();
        currentSection = initialSection;
        
        // Show the initial section
        showSection(initialSection, false);
        
        // Set up event listeners
        setupEventListeners();
        
        // Initialize scroll handler
        setupScrollHandler();
    }

    // Determine the initial section to show
    function getInitialSection() {
        // Check for hash in URL first
        if (window.location.hash) {
            const hashSection = window.location.hash.substring(1);
            if (document.getElementById(hashSection)) {
                return hashSection;
            }
        }
        
        // Default to home section
        return config.defaultSection;
    }

    // Show a specific section
    function showSection(targetId, addToHistory = true) {
        // Special handling for home section
        if (targetId === 'home_section') {
            showHomeSection(addToHistory);
            return;
        }

        // Validate target exists
        const targetSection = document.getElementById(targetId);
        if (!targetSection) {
            console.warn(`Section with ID ${targetId} not found`);
            return;
        }

        // Update current section
        currentSection = targetId;

        // Hide all sections first
        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        // Show the target section
        targetSection.classList.add('active');
        targetSection.style.display = 'block';

        // Scroll to section
        scrollToSection(targetSection);

        // Update history if needed
        if (addToHistory && !isPopState) {
            updateHistory(targetId);
        }
    }

    // Special handling for home section
    function showHomeSection(addToHistory) {
    currentSection = 'home_section';

    // Hide all sections first
    contentSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });

    // Show only the home section
    homeSection.classList.add('active');
    homeSection.style.display = 'block'; // or 'block' depending on your layout

    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: config.scrollBehavior
    });

    // Update history if needed
    if (addToHistory && !isPopState) {
        updateHistory('home_section');
    }
}

    // Scroll to a section with optional offset
    function scrollToSection(section) {
        // First scroll to top to ensure consistent behavior
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });

        // Then scroll to the section
        setTimeout(() => {
            const targetPosition = section.offsetTop - config.scrollOffset;
            window.scrollTo({
                top: targetPosition > 0 ? targetPosition : 0,
                behavior: config.scrollBehavior
            });
        }, 10);
    }

    // Update browser history
    function updateHistory(sectionId) {
        if (config.useHashInURL) {
            history.pushState({ section: sectionId }, '', `#${sectionId}`);
        } else {
            history.pushState({ section: sectionId }, '', window.location.pathname);
        }
    }

    // Handle link clicks
    function handleLinkClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        
        // Only proceed if this is a valid section link
        if (targetId === 'home_section' || document.getElementById(targetId)) {
            showSection(targetId);
        }
    }

    // Handle popstate (back/forward navigation)
    function handlePopState(e) {
        isPopState = true;
        const targetId = e.state?.section || config.defaultSection;
        showSection(targetId, false);
        isPopState = false;
    }

    // Handle scroll events for header styling
    function handleScroll() {
        if (window.scrollY > 5) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    // Set up all event listeners
    function setupEventListeners() {
        // Navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', handleLinkClick);
        });

        // All anchor links
        contentLinks.forEach(link => {
            const targetId = link.getAttribute('href').substring(1);
            if (targetId === 'home_section' || document.getElementById(targetId)) {
                link.addEventListener('click', handleLinkClick);
            }
        });

        // Browser navigation
        window.addEventListener('popstate', handlePopState);
    }

    // Set up scroll handler
    function setupScrollHandler() {
        window.addEventListener('scroll', handleScroll);
        // Trigger once to set initial state
        handleScroll();
    }

    // Start the application
    init();
});