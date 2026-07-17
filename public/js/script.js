// ============================================
// Havenly — Production Script v3.0
// Final Polish Pass
// ============================================

// 1. BOOTSTRAP FORM VALIDATION (preserved exactly)
(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// 2. TAX TOGGLE (removed as GST is now always visible)

// 3. SCROLL REVEAL — IntersectionObserver with proper stagger by DOM position
(function initReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // Assign CSS custom property --reveal-delay based on DOM order within grid
    revealEls.forEach((el, i) => {
        if (el.classList.contains('col')) {
            el.style.setProperty('--reveal-delay', `${(i % 8) * 80}ms`);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.style.getPropertyValue('--reveal-delay') || '0ms';
                entry.target.style.transitionDelay = delay;
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
                // Clear delay after animation so hover transitions aren't delayed
                entry.target.addEventListener('transitionend', () => {
                    entry.target.style.transitionDelay = '';
                }, { once: true });
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => observer.observe(el));
})();

// 4. NAVBAR SCROLL EFFECT + hide on scroll down, show on scroll up
(function initNavbar() {
    const navbar = document.querySelector('.navbar, .glass-navbar');
    if (!navbar) return;

    let lastScroll = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const currentScroll = window.scrollY;
                if (currentScroll > 50) {
                    navbar.classList.add('navbar-scrolled');
                } else {
                    navbar.classList.remove('navbar-scrolled');
                }
                lastScroll = currentScroll;
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
})();

// 5. LAZY IMAGE LOADING — fade-in on load
document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', () => img.classList.add('loaded'));
            img.addEventListener('error', () => img.classList.add('img-error'));
        }
    });

    // Mark page as fully loaded
    document.body.classList.add('page-loaded');
});

// 6. FILTER ACTIVE STATE + smooth scroll into view on mobile
(function initFilters() {
    const filters = document.querySelectorAll('.filter');
    if (!filters.length) return;

    // Scroll active filter into view on page load
    const activeFilter = document.querySelector('.filter.active');
    if (activeFilter) {
        setTimeout(() => {
            activeFilter.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }, 150);
    }

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.getAttribute('data-category');
            const isCurrentlyActive = filter.classList.contains('active');
            
            if (isCurrentlyActive) {
                window.location.href = '/listings';
            } else {
                window.location.href = `/listings?category=${encodeURIComponent(category)}`;
            }
        });
    });

    // Handle clear filter button clicks with stopPropagation
    const clearBtns = document.querySelectorAll('.filter-clear-btn');
    clearBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.location.href = '/listings';
        });
    });
})();

// 7. SMOOTH SCROLL for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// 8. CARD TILT MICRO-INTERACTION — subtle 3D tilt on mouse-move
(function initCardTilt() {
    const cards = document.querySelectorAll('.listing-card');
    if (!cards.length || window.matchMedia('(pointer: coarse)').matches) return;

    cards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -4;
            const rotateY = ((x - centerX) / centerX) * 4;
            card.style.transform = `translateY(-9px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
})();

// 9. FLASH MESSAGE AUTO-DISMISS after 5 seconds
(function initFlashDismiss() {
    const flashes = document.querySelectorAll('.flash-alert');
    flashes.forEach(flash => {
        setTimeout(() => {
            flash.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            flash.style.opacity = '0';
            flash.style.transform = 'translateY(-8px)';
            setTimeout(() => flash.remove(), 500);
        }, 5000);
    });
})();

// 10. NAVBAR MOBILE — close offcanvas on nav-link click
(function initMobileNav() {
    const offcanvas = document.getElementById('navOffcanvas');
    if (!offcanvas) return;

    const navLinks = offcanvas.querySelectorAll('.nav-link, .nav-auth-btn');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
            if (bsOffcanvas) bsOffcanvas.hide();
        });
    });
})();

// 11. BACK TO TOP BUTTON
(function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
})();

// 12. NEWSLETTER SUBSCRIPTION
(function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        if (emailInput && emailInput.value.trim() !== '') {
            const email = emailInput.value.trim();
            emailInput.value = '';
            emailInput.placeholder = 'Your email address';
            showNotification(`You will be notified to - "${email}"`);
        }
    });

    function showNotification(message) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-check toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
        container.appendChild(notification);

        // Slide in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Slide out and remove
        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    }
})();

// 13. SERVER TOAST AUTO-DISMISS
(function initServerToasts() {
    const handleToasts = () => {
        const serverToasts = document.querySelectorAll('.toast-notification.server-toast');
        serverToasts.forEach(toast => {
            // Trigger entrance animation shortly after page load
            setTimeout(() => {
                toast.classList.add('show');
            }, 100);

            // Wait 3 seconds, then hide and remove
            setTimeout(() => {
                toast.classList.remove('show');
                toast.classList.add('hide');
                setTimeout(() => {
                    toast.remove();
                }, 400);
            }, 3100);
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleToasts);
    } else {
        handleToasts();
    }
})();

// 14. PREMIUM SEARCH & FILTERS BAR INTERACTION
(function initPremiumSearchBar() {
    const wrapper = document.querySelector('.premium-search-wrapper');
    if (!wrapper) return;

    const sections = wrapper.querySelectorAll('.search-section');
    const panels = wrapper.querySelectorAll('.search-panel');
    const submitBtn = document.getElementById('search-bar-submit');

    // Values in collapsed bar
    const valDest = document.getElementById('val-destination');
    const valDates = document.getElementById('val-dates');
    const valGuests = document.getElementById('val-guests');

    function showValidationToast(message) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = 'toast-notification error-toast';
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-exclamation toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3500);
    }

    function validateSearchInputs() {
        const dest = searchState.destination.trim();
        const hasDates = valDates && valDates.textContent !== "Add dates";
        const hasGuests = valGuests && valGuests.textContent !== "Add guests";

        if (!dest) {
            showValidationToast("Please add a destination first.");
            return false;
        }

        if (!hasDates && !hasGuests) {
            showValidationToast("Please add check-in, check-out dates and guests.");
            return false;
        }
        if (!hasDates) {
            showValidationToast("Please add check-in and check-out dates.");
            return false;
        }
        if (!hasGuests) {
            showValidationToast("Please add guests.");
            return false;
        }

        return true;
    }

    const searchState = {
        destination: '',
        checkIn: '7 Jul 2026',
        checkOut: '18 Jul 2026',
        guests: {
            adults: 1,
            children: 0,
            infants: 0,
            pets: 0
        }
    };
    window.premiumSearchState = searchState;

    function resetDropdownSearchUI() {
        searchState.destination = '';
        searchState.checkIn = '7 Jul 2026';
        searchState.checkOut = '18 Jul 2026';
        searchState.guests = {
            adults: 1,
            children: 0,
            infants: 0,
            pets: 0
        };

        if (valDest) valDest.textContent = 'Search destinations';
        if (valDates) valDates.textContent = 'Add dates';
        if (valGuests) valGuests.textContent = 'Add guests';

        const destInput = document.getElementById('dest-input');
        if (destInput) destInput.value = '';

        const calDays = wrapper.querySelectorAll('.calendar-day:not(.empty)');
        calDays.forEach(d => d.classList.remove('selected', 'range-start', 'range-end', 'range-between'));

        const calCheckinVal = document.getElementById('cal-checkin-val');
        const calCheckoutVal = document.getElementById('cal-checkout-val');
        if (calCheckinVal) calCheckinVal.textContent = '7 Jul 2026';
        if (calCheckoutVal) calCheckoutVal.textContent = '18 Jul 2026';

        const cntAdults = document.getElementById('count-adults');
        const cntChildren = document.getElementById('count-children');
        const cntInfants = document.getElementById('count-infants');
        const cntPets = document.getElementById('count-pets');
        if (cntAdults) cntAdults.textContent = '1';
        if (cntChildren) cntChildren.textContent = '0';
        if (cntInfants) cntInfants.textContent = '0';
        if (cntPets) cntPets.textContent = '0';

        const minusButtons = wrapper.querySelectorAll('.counter-control .minus');
        minusButtons.forEach(btn => {
            btn.disabled = true;
        });
    }
    window.resetDropdownSearchUI = resetDropdownSearchUI;

    function updateClearButtonVisibility() {
        const clearBtn = document.getElementById('search-bar-clear');
        if (!clearBtn) return;

        const hasDest = searchState.destination.trim() !== "";
        const hasDates = valDates && valDates.textContent !== "Add dates";
        const hasGuests = valGuests && valGuests.textContent !== "Add guests";

        if (hasDest || hasDates || hasGuests) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
    }
    window.updateClearButtonVisibility = updateClearButtonVisibility;

    const clearBtn = document.getElementById('search-bar-clear');
    if (clearBtn) {
        clearBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            resetDropdownSearchUI();

            const navSearchInput = document.querySelector('form[role="search"] .search-inp');
            if (navSearchInput) navSearchInput.value = '';

            const filters = document.querySelectorAll('.filter');
            filters.forEach(f => f.classList.remove('active'));

            window.history.replaceState({}, document.title, window.location.pathname);

            resetListingsFilter();

            const sectionTitleEl = document.querySelector('.section-header .section-title');
            const sectionSubtitleEl = document.querySelector('.section-header .section-subtitle');
            if (sectionTitleEl) {
                sectionTitleEl.innerHTML = 'Find Your <span class="gradient-text">Perfect Stay</span>';
            }
            if (sectionSubtitleEl) {
                sectionSubtitleEl.textContent = 'Discover handpicked luxury homes';
            }

            clearBtn.classList.remove('show');
        });
    }

    setTimeout(updateClearButtonVisibility, 200);

    // Helper: close all panels and remove active classes from sections
    function closeAllPanels() {
        panels.forEach(p => p.classList.remove('open'));
        sections.forEach(s => s.classList.remove('active'));
        const container = wrapper.querySelector('.premium-search-container');
        if (container) container.classList.remove('active');
    }

    // Toggle panels
    sections.forEach(section => {
        section.addEventListener('click', (e) => {
            e.stopPropagation();
            const sectionId = section.id;
            let targetPanelId = '';

            if (sectionId === 'search-dest-section') targetPanelId = 'panel-destination';
            else if (sectionId === 'search-dates-section') targetPanelId = 'panel-dates';
            else if (sectionId === 'search-guests-section') targetPanelId = 'panel-guests';

            const targetPanel = document.getElementById(targetPanelId);
            if (!targetPanel) return;
            const isOpen = targetPanel.classList.contains('open');

            closeAllPanels();

            if (!isOpen) {
                targetPanel.classList.add('open');
                section.classList.add('active');
                const container = wrapper.querySelector('.premium-search-container');
                if (container) container.classList.add('active');
                
                // Focus on destination input if it is the destination panel
                if (sectionId === 'search-dest-section') {
                    const input = document.getElementById('dest-input');
                    if (input) setTimeout(() => input.focus(), 150);
                }
            }
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            closeAllPanels();
        }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeAllPanels();
        }
    });

    // Prevent panel clicks from closing themselves
    panels.forEach(panel => {
        panel.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });

    // 1. DESTINATION SELECTION
    const destInput = document.getElementById('dest-input');
    const popularItems = wrapper.querySelectorAll('.popular-dest-item');
    const exploreAllBtn = document.getElementById('explore-all-btn');

    function setDestination(value) {
        searchState.destination = value;
        if (valDest) valDest.textContent = value || 'Search destinations';
        if (destInput) destInput.value = value;
    }
    window.setPremiumSearchDestination = setDestination;
    window.filterPremiumListings = filterListings;

    popularItems.forEach(item => {
        item.addEventListener('click', () => {
            const val = item.getAttribute('data-value');
            setDestination(val);
            if (!validateSearchInputs()) {
                closeAllPanels();
                // Open dates panel to prompt the user
                const datesSection = document.getElementById('search-dates-section');
                const datesPanel = document.getElementById('panel-dates');
                if (datesSection && datesPanel) {
                    datesPanel.classList.add('open');
                    datesSection.classList.add('active');
                    const container = wrapper.querySelector('.premium-search-container');
                    if (container) container.classList.add('active');
                }
                return;
            }
            closeAllPanels();
            filterListings();
        });
    });

    if (destInput) {
        destInput.addEventListener('input', (e) => {
            setDestination(e.target.value);
        });
        destInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (!validateSearchInputs()) return;
                closeAllPanels();
                filterListings();
            }
        });
    }

    if (exploreAllBtn) {
        exploreAllBtn.addEventListener('click', () => {
            setDestination('');
            closeAllPanels();
            // Reset client side filter (show all listings)
            resetListingsFilter();
        });
    }

    // 2. DATES CALENDAR SELECTION (Simulation)
    const calDays = wrapper.querySelectorAll('.calendar-day:not(.empty)');
    const calCheckinVal = document.getElementById('cal-checkin-val');
    const calCheckoutVal = document.getElementById('cal-checkout-val');
    let dateSelectionStep = 1; // 1 = selecting checkin, 2 = selecting checkout

    calDays.forEach(day => {
        day.addEventListener('click', () => {
            const dayNum = parseInt(day.getAttribute('data-day'));
            if (isNaN(dayNum)) return;

            if (dateSelectionStep === 1) {
                // Remove all selections
                calDays.forEach(d => d.classList.remove('selected', 'range-start', 'range-end', 'range-between'));
                
                day.classList.add('selected', 'range-start');
                searchState.checkIn = `${dayNum} Jul 2026`;
                if (calCheckinVal) calCheckinVal.textContent = searchState.checkIn;
                dateSelectionStep = 2;
            } else {
                const checkInDay = parseInt(searchState.checkIn.split(' ')[0]);
                if (dayNum < checkInDay) {
                    // Reset to checkin if checkout is before checkin
                    calDays.forEach(d => d.classList.remove('selected', 'range-start', 'range-end', 'range-between'));
                    day.classList.add('selected', 'range-start');
                    searchState.checkIn = `${dayNum} Jul 2026`;
                    if (calCheckinVal) calCheckinVal.textContent = searchState.checkIn;
                    dateSelectionStep = 2;
                } else {
                    day.classList.add('selected', 'range-end');
                    searchState.checkOut = `${dayNum} Jul 2026`;
                    if (calCheckoutVal) calCheckoutVal.textContent = searchState.checkOut;
                    
                    // Highlight days in between
                    calDays.forEach(d => {
                        const dNum = parseInt(d.getAttribute('data-day'));
                        if (dNum > checkInDay && dNum < dayNum) {
                            d.classList.add('range-between');
                        }
                    });

                    if (valDates) valDates.textContent = `${searchState.checkIn.split(' ')[0]} - ${searchState.checkOut}`;
                    dateSelectionStep = 1;
                    
                    // Close panel automatically after selection complete
                    setTimeout(closeAllPanels, 400);
                }
            }
        });
    });

    // 3. GUESTS SELECTION
    const counters = {
        adults: document.getElementById('count-adults'),
        children: document.getElementById('count-children'),
        infants: document.getElementById('count-infants'),
        pets: document.getElementById('count-pets')
    };

    const doneBtn = document.getElementById('guests-done-btn');

    wrapper.querySelectorAll('.counter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-type');
            const isPlus = btn.classList.contains('plus');
            let val = searchState.guests[type];

            if (isPlus) {
                val++;
            } else {
                val = Math.max(0, val - 1);
                // Adults minimum is 1 if children/infants/pets are present
                if (type === 'adults' && val === 0) {
                    const otherGuests = searchState.guests.children + searchState.guests.infants + searchState.guests.pets;
                    if (otherGuests > 0) val = 1;
                }
            }

            searchState.guests[type] = val;
            if (counters[type]) counters[type].textContent = val;

            // Enable/disable buttons based on value rules
            const minusBtn = btn.parentNode.querySelector('.minus');

            if (minusBtn) {
                if (val === 0 || (type === 'adults' && val === 1)) {
                    minusBtn.disabled = true;
                } else {
                    minusBtn.disabled = false;
                }
            }

            updateGuestsSummary();
        });
    });

    function updateGuestsSummary() {
        const totalGuests = searchState.guests.adults + searchState.guests.children;
        const totalInfants = searchState.guests.infants;
        const totalPets = searchState.guests.pets;

        let summary = `${totalGuests} guest${totalGuests !== 1 ? 's' : ''}`;
        if (totalInfants > 0) {
            summary += `, ${totalInfants} infant${totalInfants !== 1 ? 's' : ''}`;
        }
        if (totalPets > 0) {
            summary += `, ${totalPets} pet${totalPets !== 1 ? 's' : ''}`;
        }

        if (valGuests) valGuests.textContent = summary;
    }

    if (doneBtn) {
        doneBtn.addEventListener('click', () => {
            closeAllPanels();
        });
    }

    // CLIENT SIDE FILTERING LOGIC ON SEARCH
    function resetListingsFilter() {
        const listingCols = document.querySelectorAll('.listings-grid .col');
        const emptyState = document.querySelector('.empty-state');
        
        listingCols.forEach(col => col.classList.remove('d-none'));
        if (emptyState) emptyState.classList.add('d-none');
    }

    function filterListings() {
        // Clear navbar search input when performing dropdown search
        const navSearchInput = document.querySelector('form[role="search"] .search-inp');
        if (navSearchInput) navSearchInput.value = '';

        const destination = searchState.destination.trim();

        // Redirect if category filter is active to start fresh with all listings
        const hasCategory = new URLSearchParams(window.location.search).has('category');
        if (hasCategory && destination) {
            window.location.href = `/listings?dest=${encodeURIComponent(destination)}`;
            return;
        }
        const sectionTitleEl = document.querySelector('.section-header .section-title');
        const sectionSubtitleEl = document.querySelector('.section-header .section-subtitle');

        if (!destination) {
            resetListingsFilter();
            if (sectionTitleEl) {
                sectionTitleEl.innerHTML = 'Find Your <span class="gradient-text">Perfect Stay</span>';
            }
            if (sectionSubtitleEl) {
                sectionSubtitleEl.textContent = 'Discover handpicked luxury homes';
            }
            return;
        }

        if (sectionTitleEl) {
            sectionTitleEl.innerHTML = `${destination} <span class="gradient-text">Stays</span>`;
        }
        if (sectionSubtitleEl) {
            sectionSubtitleEl.textContent = 'Discover our most popular stays';
        }

        const destinationLower = destination.toLowerCase();
        const listingCols = document.querySelectorAll('.listings-grid .col');
        const emptyState = document.querySelector('.empty-state');
        let matchedCount = 0;

        listingCols.forEach(col => {
            const titleEl = col.querySelector('.card-title-text');
            const locationEl = col.querySelector('.location-badge span');

            const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
            const locationText = locationEl ? locationEl.textContent.toLowerCase() : '';

            if (titleText.includes(destinationLower) || locationText.includes(destinationLower)) {
                col.classList.remove('d-none');
                matchedCount++;
            } else {
                col.classList.add('d-none');
            }
        });

        // Show/hide empty state based on matches
        if (emptyState) {
            if (matchedCount === 0) {
                emptyState.classList.remove('d-none');
                const titleEl = emptyState.querySelector('.empty-state-title');
                const textEl = emptyState.querySelector('.empty-state-text');
                if (titleEl) titleEl.textContent = 'No Curated Stays Found';
                if (textEl) textEl.textContent = `We couldn't find any premium stays matching "${searchState.destination}".`;
            } else {
                emptyState.classList.add('d-none');
            }
        }

        // Show toast notification
        const totalGuests = searchState.guests.adults + searchState.guests.children;
        let notificationMsg = `Showing stays in "${searchState.destination}"`;
        if (totalGuests > 1) {
            notificationMsg += ` for ${totalGuests} guests`;
        }

        // Create container if not exists to mount toast notification
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-check toast-icon"></i>
                <span class="toast-message">${notificationMsg}</span>
            </div>
        `;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
        updateClearButtonVisibility();
    }

    if (submitBtn) {
        submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!validateSearchInputs()) return;
            closeAllPanels();
            filterListings();
        });
    }
})();

// 15. NAVBAR SEARCH & FILTERING
(function initNavbarSearch() {
    const searchForm = document.querySelector('form[role="search"]');
    if (!searchForm) return;

    const searchInput = searchForm.querySelector('.search-inp');
    if (!searchInput) return;

    // Helper: Reset all listings to visible
    function resetListings() {
        const listingCols = document.querySelectorAll('.listings-grid .col');
        const emptyState = document.querySelector('.empty-state');
        listingCols.forEach(col => col.classList.remove('d-none'));
        if (emptyState) emptyState.classList.add('d-none');
    }

    // Helper: Perform search/filter on listing cards
    function performSearch(query) {
        // Clear all dropdown search fields (destination, dates, guests) when performing navbar search
        if (window.resetDropdownSearchUI) {
            window.resetDropdownSearchUI();
        }

        const cleanQuery = query.trim();
        const sectionTitleEl = document.querySelector('.section-header .section-title');
        const sectionSubtitleEl = document.querySelector('.section-header .section-subtitle');

        if (!cleanQuery) {
            resetListings();
            if (sectionTitleEl) {
                sectionTitleEl.innerHTML = 'Find Your <span class="gradient-text">Perfect Stay</span>';
            }
            if (sectionSubtitleEl) {
                sectionSubtitleEl.textContent = 'Discover handpicked luxury homes';
            }
            return;
        }

        if (sectionTitleEl) {
            sectionTitleEl.innerHTML = `${cleanQuery} <span class="gradient-text">Stays</span>`;
        }
        if (sectionSubtitleEl) {
            sectionSubtitleEl.textContent = 'Discover our most popular stays';
        }

        const cleanQueryLower = cleanQuery.toLowerCase();
        const listingCols = document.querySelectorAll('.listings-grid .col');
        const emptyState = document.querySelector('.empty-state');
        let matchedCount = 0;

        listingCols.forEach(col => {
            const titleEl = col.querySelector('.card-title-text');
            const locationEl = col.querySelector('.location-badge span');

            const titleText = titleEl ? titleEl.textContent.toLowerCase() : '';
            const locationText = locationEl ? locationEl.textContent.toLowerCase() : '';

            if (titleText.includes(cleanQueryLower) || locationText.includes(cleanQueryLower)) {
                col.classList.remove('d-none');
                matchedCount++;
            } else {
                col.classList.add('d-none');
            }
        });

        // Update or show empty state if nothing matched
        if (emptyState) {
            if (matchedCount === 0) {
                emptyState.classList.remove('d-none');
                const titleEl = emptyState.querySelector('.empty-state-title');
                const textEl = emptyState.querySelector('.empty-state-text');
                if (titleEl) titleEl.textContent = 'No Match Found';
                if (textEl) textEl.textContent = `We couldn't find any listings matching "${query}".`;
            } else {
                emptyState.classList.add('d-none');
            }
        }

        // Show toast notification
        showSearchToast(`Found ${matchedCount} listings for "${query}"`);
        if (window.updateClearButtonVisibility) {
            window.updateClearButtonVisibility();
        }
    }

    // Helper: Create and display a custom toast notification
    function showSearchToast(message) {
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.className = 'toast-notification';
        notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-magnifying-glass toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
        container.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            notification.classList.add('hide');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 3000);
    }

    // Clear search and restore listings when native 'x' is clicked or input is manually cleared
    searchInput.addEventListener('search', () => {
        if (searchInput.value.trim() === '') {
            performSearch('');
        }
    });

    searchInput.addEventListener('input', () => {
        if (searchInput.value.trim() === '') {
            performSearch('');
        }
    });

    // Handle form submission
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = searchInput.value;
        
        // Check if we are on the homepage/listings page
        const isHomepage = window.location.pathname === '/' || window.location.pathname === '/listings';
        const hasCategory = new URLSearchParams(window.location.search).has('category');
        
        if (!isHomepage || hasCategory) {
            // Redirect to home page with query parameter
            window.location.href = `/listings?q=${encodeURIComponent(query)}`;
        } else {
            // Filter locally
            performSearch(query);
        }
    });

    // Check for query parameter on load (if on home page)
    const isHomepage = window.location.pathname === '/' || window.location.pathname === '/listings';
    if (isHomepage) {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('q');
        const dest = urlParams.get('dest');
        if (query) {
            searchInput.value = query;
            // Delay slightly to wait for scroll reveal transitions to complete
            setTimeout(() => {
                performSearch(query);
            }, 100);

            // Clean query parameter from URL bar without reloading
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        } else if (dest) {
            // Populate and search dropdown
            setTimeout(() => {
                if (window.setPremiumSearchDestination) {
                    window.setPremiumSearchDestination(dest);
                }
                if (window.filterPremiumListings) {
                    window.filterPremiumListings();
                }
            }, 100);

            // Clean query parameter from URL bar without reloading
            const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.replaceState({ path: cleanUrl }, '', cleanUrl);
        }
    }
})();