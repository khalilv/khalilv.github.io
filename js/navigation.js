/**
 * Navigation Script for Khalil Virji Website
 * Handles mobile menu toggle, scrolling, and active link highlighting
 */

$(document).ready(function() {

    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================

    $('#hamburgerBtn').click(function() {
        $('#sidebarNav').toggleClass('active');
        $(this).toggleClass('active');
    });

    // Close mobile menu when clicking outside
    $(document).click(function(event) {
        const nav = $('#sidebarNav');
        const hamburger = $('#hamburgerBtn');

        // If click is outside nav and hamburger, close menu
        if (!nav.is(event.target) && nav.has(event.target).length === 0 &&
            !hamburger.is(event.target) && hamburger.has(event.target).length === 0) {
            nav.removeClass('active');
            hamburger.removeClass('active');
        }
    });

    // Close menu on ESC key
    $(document).keyup(function(e) {
        if (e.key === "Escape") {
            $('#sidebarNav').removeClass('active');
            $('#hamburgerBtn').removeClass('active');
        }
    });

    // ========================================
    // SCROLL TO ANCHORS
    // ========================================

    $('.nav-links a[href^="#"]').click(function(e) {
        e.preventDefault();

        const targetId = $(this).attr('href');
        const target = $(targetId);

        if (target.length) {
            // Close mobile menu if open
            $('#sidebarNav').removeClass('active');
            $('#hamburgerBtn').removeClass('active');

            // Instant scroll to target
            window.scrollTo(0, target.offset().top - 100);
        }
    });

    // ========================================
    // ACTIVE LINK HIGHLIGHTING ON SCROLL
    // ========================================

    // Get all sections that have an ID
    const sections = $('h4[id], li[id]');
    const navLinks = $('.nav-links a[href^="#"]');

    // Throttle function to improve performance
    function throttle(func, wait) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;

            const later = function() {
                timeout = null;
                func.apply(context, args);
            };

            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
        };
    }

    // Update active link based on scroll position
    function updateActiveLink() {
        let currentSection = '';

        sections.each(function() {
            const sectionTop = $(this).offset().top;
            const sectionHeight = $(this).outerHeight();
            const scrollPosition = $(window).scrollTop() + 200; // Offset for better UX

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = $(this).attr('id');
            }
        });

        // Remove all active classes
        navLinks.removeClass('active');

        // Add active class to current section's nav link
        if (currentSection) {
            $('.nav-links a[href="#' + currentSection + '"]').addClass('active');
        } else {
            // If at top, activate "About"
            if ($(window).scrollTop() < 200) {
                $('.nav-links a[href="#about"]').addClass('active');
            }
        }
    }

    // Initial check
    updateActiveLink();

    // Update on scroll (throttled for performance)
    $(window).scroll(throttle(updateActiveLink, 100));

    // ========================================
    // INTERSECTION OBSERVER (Modern Alternative)
    // ========================================

    // Use Intersection Observer API if available (more performant)
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-100px 0px -60% 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');

                    // Remove all active classes
                    navLinks.removeClass('active');

                    // Add active class to current section's nav link
                    if (id) {
                        $('.nav-links a[href="#' + id + '"]').addClass('active');
                    }
                }
            });
        }, observerOptions);

        // Observe all sections
        sections.each(function() {
            observer.observe(this);
        });

        // If using Intersection Observer, unbind scroll event to avoid duplication
        $(window).off('scroll');
    }

});
