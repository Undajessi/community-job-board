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
        // toggle the mobile nav if present
        navMenu = getNavMenu();
        if (navMenu) {
            navMenu.classList.toggle('show', open);
            navMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
        // try to update visual toggle if present
        if (menuToggle) menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
            // when opening via mobile nav, trap focus inside the visible nav or panel
            trapFocus(navMenu || allMenuPanel || document.body, menuToggle || allMenuBtn);
        } else {
            releaseFocus();
            try {
                (menuToggle || allMenuBtn).focus();
            } catch (e) {}
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

    // All-options menu: populate from existing links and role items
    const allMenuBtn = document.getElementById('all-menu-btn');
    const allMenuPanel = document.getElementById('all-menu-panel');

    if (allMenuBtn && allMenuPanel) {
        function buildAllMenu() {
            allMenuPanel.innerHTML = '';

            // helper: find first anchor by case-insensitive text match
            function findAnchorByText(rx) {
                const anchors = Array.from(document.querySelectorAll('a'));
                return anchors.find(a => rx.test((a.textContent || a.innerText || '').trim()));
            }

            // desired ordered items
            const desired = [
                { name: 'Home', match: /home/i },
                { name: 'Browse Jobs', match: /browse|jobs/i },
                { name: 'Login', match: /login/i },
                { name: 'Register', match: /register/i, cta: true },
                { name: 'Profile', match: /profile/i },
                { name: 'My Jobs', match: /my\s*jobs|postings/i },
                { name: 'My Applications', match: /applications|my\s*applications/i },
                { name: 'Admin', match: /admin/i }
            ];

            const added = new Set();

            desired.forEach(function(item) {
                const anchor = findAnchorByText(item.match);
                if (anchor) {
                    const a = document.createElement('a');
                    a.href = anchor.getAttribute('href') || '#';
                    a.textContent = anchor.textContent.trim() || anchor.innerText.trim();
                    a.className = 'panel-link';
                    if (item.cta) a.classList.add('cta');
                    allMenuPanel.appendChild(a);
                    added.add(a.textContent);
                }
            });

            // include any footer quick links or other anchors not yet included
            const extraAnchors = Array.from(document.querySelectorAll('a'));
            extraAnchors.forEach(function(anchor) {
                const text = (anchor.textContent || anchor.innerText || '').trim();
                if (!text) return;
                if (added.has(text)) return;
                // skip anchors that are page-internal or empty hrefs
                const href = anchor.getAttribute('href') || '';
                if (href.startsWith('#') || href === '') return;
                const a = document.createElement('a');
                a.href = href;
                a.textContent = text;
                a.className = 'panel-link';
                if (/register/i.test(text)) a.classList.add('cta');
                allMenuPanel.appendChild(a);
                added.add(text);
            });

            // clone logout forms (so logout works from panel). Prefer server-rendered logout form if present.
            const logoutForms = document.querySelectorAll('form[th\\:action="@{/logout}"] , form[action="/logout"]');
            if (logoutForms && logoutForms.length) {
                logoutForms.forEach(function(f) {
                    try {
                        const clone = f.cloneNode(true);
                        // ensure submit button is styled
                        const btn = clone.querySelector('button[type="submit"]') || clone.querySelector('input[type="submit"]');
                        if (btn) {
                            btn.classList.add('panel-link');
                            btn.classList.add('panel-form-btn');
                        }
                        allMenuPanel.appendChild(clone);
                    } catch (e) {
                        // ignore clone errors
                    }
                });
            } else {
                // if no form, try to detect a logout link (fallback)
                const logoutLink = Array.from(document.querySelectorAll('a')).find(a => /logout/i.test(a.getAttribute('href')||''));
                if (logoutLink) {
                    const a = document.createElement('a');
                    a.href = logoutLink.getAttribute('href');
                    a.textContent = logoutLink.textContent.trim() || 'Logout';
                    a.className = 'panel-link';
                    allMenuPanel.appendChild(a);
                }
            }

            // after building, attach click handlers so navigation closes the panel
            setTimeout(function() {
                allMenuPanel.querySelectorAll('a, button').forEach(function(el) {
                    el.addEventListener('click', function() {
                        // close the panel to provide immediate visual feedback
                        allMenuPanel.classList.remove('open');
                        allMenuPanel.setAttribute('aria-hidden', 'true');
                        allMenuBtn.setAttribute('aria-expanded', 'false');
                        releaseFocus();
                        try { allMenuBtn.focus(); } catch (e) {}
                    });
                });
            }, 20);
        }

        // Toggle panel
        allMenuBtn.addEventListener('click', function(e) {
            const open = !allMenuPanel.classList.contains('open');
                if (open) {
                    buildAllMenu();
                    allMenuPanel.classList.add('open');
                    allMenuBtn.setAttribute('aria-expanded', 'true');
                    allMenuPanel.setAttribute('aria-hidden', 'false');
                    // trap focus inside panel
                    trapFocus(allMenuPanel, allMenuBtn);
                    // show mobile nav as well on small screens so Menu is the single control
                    if (window.innerWidth <= 768) setMenu(true);
                    // focus first interactive element
                    const first = allMenuPanel.querySelector('a,button');
                    if (first) first.focus();
                } else {
                    allMenuPanel.classList.remove('open');
                    allMenuBtn.setAttribute('aria-expanded', 'false');
                    allMenuPanel.setAttribute('aria-hidden', 'true');
                    // hide mobile nav too
                    if (window.innerWidth <= 768) setMenu(false);
                    releaseFocus();
                    allMenuBtn.focus();
                }
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (allMenuPanel.classList.contains('open') && !allMenuPanel.contains(e.target) && e.target !== allMenuBtn) {
                allMenuPanel.classList.remove('open');
                allMenuPanel.setAttribute('aria-hidden', 'true');
                allMenuBtn.setAttribute('aria-expanded', 'false');
                releaseFocus();
                allMenuBtn.focus();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && allMenuPanel.classList.contains('open')) {
                allMenuPanel.classList.remove('open');
                allMenuPanel.setAttribute('aria-hidden', 'true');
                allMenuBtn.setAttribute('aria-expanded', 'false');
                releaseFocus();
                allMenuBtn.focus();
            }
        });
    }
});