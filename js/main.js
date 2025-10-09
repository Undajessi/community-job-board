document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle — resolve nav by aria-controls so markup changes won't break behaviour
    const menuToggle = document.querySelector('.menu-toggle');
    const getNavMenu = () => {
        if (!menuToggle) return document.querySelector('nav ul');
        const id = menuToggle.getAttribute('aria-controls');
        return id ? document.getElementById(id) : document.querySelector('nav ul');
    };
    let navMenu = getNavMenu();

    function setMenu(open) {
        if (!menuToggle) return;
        navMenu = getNavMenu();
        if (!navMenu) return;
        navMenu.classList.toggle('show', open);
        menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            trapFocus(navMenu, menuToggle);
        } else {
            releaseFocus();
            try { menuToggle.focus(); } catch (e) {}
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
            setMenu(!isOpen);
            // animate icon
            menuToggle.classList.toggle('open', !isOpen);
        });

        const refreshNavMenu = () => { navMenu = getNavMenu(); };

        // close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') setMenu(false);
        });

        // close when clicking outside nav (but allow clicks on header brand/top-links)
        document.addEventListener('click', function(e) {
            refreshNavMenu();
            const brand = document.querySelector('.brand-group');
            if (!navMenu || !menuToggle) return;
            if (navMenu.contains(e.target) || menuToggle.contains(e.target)) return;
            if (brand && brand.contains(e.target)) return; // ignore header interactions
            setMenu(false);
            menuToggle.classList.remove('open');
        });

        // close menu on nav link click (mobile) — attach and reattach if nav changes
        function closeOnNavLink() { setMenu(false); menuToggle.classList.remove('open'); }
        const attachNavLinkHandlers = () => {
            refreshNavMenu();
            if (!navMenu) return;
            navMenu.querySelectorAll('a').forEach(function(link) {
                link.removeEventListener('click', closeOnNavLink);
                link.addEventListener('click', closeOnNavLink);
            });
        };

        attachNavLinkHandlers();

        // Reset menu on resize (useful when switching device/orientation)
        let lastIsMobile = window.innerWidth <= 768;
        window.addEventListener('resize', function() {
            const isMobile = window.innerWidth <= 768;
            if (isMobile !== lastIsMobile) {
                setMenu(false);
                menuToggle.classList.remove('open');
                releaseFocus();
                refreshNavMenu();
                attachNavLinkHandlers();
                lastIsMobile = isMobile;
            }
        });
    }

    // Focus trap helpers
    var lastFocusedBeforeTrap = null;
    var focusableSelectors = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
    var currentTrap = null;

    function trapFocus(container, returnFocusEl) {
        lastFocusedBeforeTrap = document.activeElement;
        currentTrap = container;
        var focusable = Array.from(container.querySelectorAll(focusableSelectors)).filter(function(el){ return el.offsetParent !== null; });
        if (focusable.length) focusable[0].focus();

        function handleKey(e) {
            if (!currentTrap) return;
            if (e.key === 'Tab') {
                var focusable = Array.from(currentTrap.querySelectorAll(focusableSelectors)).filter(function(el){ return el.offsetParent !== null; });
                if (!focusable.length) return;
                var first = focusable[0];
                var last = focusable[focusable.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }

        document.addEventListener('keydown', handleKey);
        // store handler so we can remove it
        container._trapHandler = handleKey;
    }

    function releaseFocus() {
        if (currentTrap) {
            var handler = currentTrap._trapHandler;
            if (handler) document.removeEventListener('keydown', handler);
            currentTrap._trapHandler = null;
            currentTrap = null;
        }
        if (lastFocusedBeforeTrap) {
            try { lastFocusedBeforeTrap.focus(); } catch (e) {}
            lastFocusedBeforeTrap = null;
        }
    }
    
    // Job search form validation
    const searchForm = document.querySelector('.search-box form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const searchInput = this.querySelector('input[name="keyword"]');
            if (searchInput.value.trim() === '') {
                e.preventDefault();
                alert('Please enter a search keyword');
            }
        });
    }
    
    // Job application form validation
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', function(e) {
            const coverLetter = document.getElementById('coverLetter');
            if (coverLetter && coverLetter.value.trim().length < 50) {
                e.preventDefault();
                alert('Cover letter should be at least 50 characters long');
                coverLetter.focus();
            }
        });
    }
    
    // Job posting form validation
    const jobForm = document.getElementById('job-form');
    if (jobForm) {
        jobForm.addEventListener('submit', function(e) {
            const title = document.getElementById('title');
            const description = document.getElementById('description');
            const location = document.getElementById('location');
            const category = document.getElementById('category');
            
            let isValid = true;
            
            if (title && title.value.trim() === '') {
                isValid = false;
                highlightField(title);
            }
            
            if (description && description.value.trim().length < 100) {
                isValid = false;
                highlightField(description);
            }
            
            if (location && location.value.trim() === '') {
                isValid = false;
                highlightField(location);
            }
            
            if (category && category.value.trim() === '') {
                isValid = false;
                highlightField(category);
            }
            
            if (!isValid) {
                e.preventDefault();
                alert('Please fill all required fields properly');
            }
        });
    }
    
    // Field highlighting helper function
    function highlightField(field) {
        field.classList.add('error');
        field.addEventListener('input', function() {
            this.classList.remove('error');
        });
    }
    
    // Filter jobs by category or location
    const filterSelects = document.querySelectorAll('.job-filter select');
    if (filterSelects) {
        filterSelects.forEach(function(select) {
            select.addEventListener('change', function() {
                const form = this.closest('form');
                if (form) {
                    form.submit();
                }
            });
        });
    }
    
    // Show/hide elements based on user role
    const userRoleElements = document.querySelectorAll('[data-role]');
    const currentRole = document.body.dataset.userRole;
    
    if (userRoleElements && currentRole) {
        userRoleElements.forEach(function(element) {
            const requiredRole = element.dataset.role;
            if (requiredRole !== currentRole) {
                element.style.display = 'none';
            }
        });
    }
    
    // Handle pagination
    const paginationLinks = document.querySelectorAll('.pagination a');
    if (paginationLinks) {
        paginationLinks.forEach(function(link) {
            link.addEventListener('click', function(e) {
                if (link.classList.contains('disabled')) {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    if (tooltips) {
        tooltips.forEach(function(tooltip) {
            tooltip.addEventListener('mouseenter', function() {
                const text = this.dataset.tooltip;
                const tip = document.createElement('div');
                tip.className = 'tooltip';
                tip.textContent = text;
                document.body.appendChild(tip);
                
                const rect = this.getBoundingClientRect();
                tip.style.left = rect.left + 'px';
                tip.style.top = (rect.bottom + 10) + 'px';
                
                this.addEventListener('mouseleave', function() {
                    tip.remove();
                });
            });
        });
    }
    
    // Handle flash messages auto-hide
    const flashMessages = document.querySelectorAll('.flash-message');
    if (flashMessages) {
        flashMessages.forEach(function(message) {
            setTimeout(function() {
                message.classList.add('fade-out');
                setTimeout(function() {
                    message.remove();
                }, 500);
            }, 5000);
            
            const closeBtn = message.querySelector('.close');
            if (closeBtn) {
                closeBtn.addEventListener('click', function() {
                    message.remove();
                });
            }
        });
    }
});