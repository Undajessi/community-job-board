document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('show');
        });
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