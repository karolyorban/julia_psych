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
    const contentLinks = document.querySelectorAll('a[href^="#"]');
    const contentSections = document.querySelectorAll('.content-section');
    const header = document.querySelector('header');
    const homeSection = document.getElementById('home_section');
    const hamburger = document.querySelector('.hamburger');
    const dropdownNav = document.querySelector('.dropdown-nav');

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
        if (window.location.hash) {
            const hashSection = window.location.hash.substring(1);
            if (document.getElementById(hashSection)) {
                return hashSection;
            }
        }
        return config.defaultSection;
    }

    // Show a specific section
    function showSection(targetId, addToHistory = true) {
        if (targetId === 'home_section') {
            showHomeSection(addToHistory);
            return;
        }

        const targetSection = document.getElementById(targetId);
        if (!targetSection) {
            console.warn(`Section with ID ${targetId} not found`);
            return;
        }

        currentSection = targetId;

        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        targetSection.classList.add('active');
        targetSection.style.display = 'block';
        scrollToSection(targetSection);

        if (addToHistory && !isPopState) {
            updateHistory(targetId);
        }

        // Close dropdown menu when a section is selected
        closeDropdown();
    }

    function showHomeSection(addToHistory) {
        currentSection = 'home_section';

        contentSections.forEach(section => {
            section.classList.remove('active');
            section.style.display = 'none';
        });

        homeSection.classList.add('active');
        homeSection.style.display = 'block';
        window.scrollTo({
            top: 0,
            behavior: config.scrollBehavior
        });

        if (addToHistory && !isPopState) {
            updateHistory('home_section');
        }

        // Close dropdown menu when home is selected
        closeDropdown();
    }

    function scrollToSection(section) {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });

        setTimeout(() => {
            const targetPosition = section.offsetTop - config.scrollOffset;
            window.scrollTo({
                top: targetPosition > 0 ? targetPosition : 0,
                behavior: config.scrollBehavior
            });
        }, 10);
    }

    function updateHistory(sectionId) {
        if (config.useHashInURL) {
            history.pushState({ section: sectionId }, '', `#${sectionId}`);
        } else {
            history.pushState({ section: sectionId }, '', window.location.pathname);
        }
    }

    function handleLinkClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        
        if (targetId === 'home_section' || document.getElementById(targetId)) {
            showSection(targetId);
        }
    }

    function handlePopState(e) {
        isPopState = true;
        const targetId = e.state?.section || config.defaultSection;
        showSection(targetId, false);
        isPopState = false;
    }

    function handleScroll() {
        if (window.scrollY > 5) {
            header?.classList.add('scrolled');
        } else {
            header?.classList.remove('scrolled');
        }
    }

    // Dropdown menu functions
    function toggleDropdown() {
        hamburger.classList.toggle('active');
        dropdownNav.classList.toggle('active');
    }

    function closeDropdown() {
        hamburger.classList.remove('active');
        dropdownNav.classList.remove('active');
    }

    function handleDocumentClick(e) {
        if (!dropdownNav.contains(e.target) && !hamburger.contains(e.target)) {
            closeDropdown();
        }
    }

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

        // Hamburger menu
        if (hamburger) {
            hamburger.addEventListener('click', function(e) {
                e.stopPropagation();
                toggleDropdown();
            });
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', handleDocumentClick);

        // Prevent dropdown from closing when clicking inside
        if (dropdownNav) {
            dropdownNav.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }

    function setupScrollHandler() {
        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }

    // Start the application
    init();
});