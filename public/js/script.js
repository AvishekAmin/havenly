(() => {
  "use strict";
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false,
    );
  });
})();

(function initReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  revealEls.forEach((el, i) => {
    if (el.classList.contains("col")) {
      el.style.setProperty("--reveal-delay", `${(i % 8) * 80}ms`);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay =
            entry.target.style.getPropertyValue("--reveal-delay") || "0ms";
          entry.target.style.transitionDelay = delay;
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
          entry.target.addEventListener(
            "transitionend",
            () => {
              entry.target.style.transitionDelay = "";
            },
            { once: true },
          );
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  revealEls.forEach((el) => observer.observe(el));
})();

(function initNavbar() {
  const navbar = document.querySelector(".navbar, .glass-navbar");
  if (!navbar) return;

  let lastScroll = 0;
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          if (currentScroll > 50) {
            navbar.classList.add("navbar-scrolled");
          } else {
            navbar.classList.remove("navbar-scrolled");
          }
          lastScroll = currentScroll;
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
})();

document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  lazyImages.forEach((img) => {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("loaded");
    } else {
      img.addEventListener("load", () => img.classList.add("loaded"));
      img.addEventListener("error", () => img.classList.add("img-error"));
    }
  });

  document.body.classList.add("page-loaded");
});

(function initFilters() {
  const filters = document.querySelectorAll(".filter");
  if (!filters.length) return;

  const activeFilter = document.querySelector(".filter.active");
  if (activeFilter) {
    setTimeout(() => {
      activeFilter.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }, 150);
  }

  filters.forEach((filter) => {
    filter.addEventListener("click", () => {
      const category = filter.getAttribute("data-category");
      const isCurrentlyActive = filter.classList.contains("active");

      if (isCurrentlyActive) {
        window.location.href = "/listings";
      } else {
        window.location.href = `/listings?category=${encodeURIComponent(category)}`;
      }
    });
  });

  const clearBtns = document.querySelectorAll(".filter-clear-btn");
  clearBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      window.location.href = "/listings";
    });
  });
})();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

(function initCardTilt() {
  const cards = document.querySelectorAll(".listing-card");
  if (!cards.length || window.matchMedia("(pointer: coarse)").matches) return;

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;
      card.style.transform = `translateY(-9px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

(function initFlashDismiss() {
  const flashes = document.querySelectorAll(".flash-alert");
  flashes.forEach((flash) => {
    setTimeout(() => {
      flash.style.transition = "opacity 0.5s ease, transform 0.5s ease";
      flash.style.opacity = "0";
      flash.style.transform = "translateY(-8px)";
      setTimeout(() => flash.remove(), 500);
    }, 5000);
  });
})();

(function initMobileNav() {
  const offcanvas = document.getElementById("navOffcanvas");
  if (!offcanvas) return;

  const navLinks = offcanvas.querySelectorAll(".nav-link, .nav-auth-btn");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const bsOffcanvas = bootstrap.Offcanvas.getInstance(offcanvas);
      if (bsOffcanvas) bsOffcanvas.hide();
    });
  });
})();

(function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 300) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true },
  );

  btn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();

(function initNewsletter() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("newsletter-email");
    if (emailInput && emailInput.value.trim() !== "") {
      const email = emailInput.value.trim();
      emailInput.value = "";
      emailInput.placeholder = "Your email address";
      showNotification(`You will be notified to - "${email}"`);
    }
  });

  function showNotification(message) {
    let container = document.getElementById("notification-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = "toast-notification";
    notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-check toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hide");
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 3000);
  }
})();

(function initServerToasts() {
  const handleToasts = () => {
    const serverToasts = document.querySelectorAll(
      ".toast-notification.server-toast",
    );
    serverToasts.forEach((toast) => {
      setTimeout(() => {
        toast.classList.add("show");
      }, 100);

      setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
        setTimeout(() => {
          toast.remove();
        }, 400);
      }, 3100);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", handleToasts);
  } else {
    handleToasts();
  }
})();

(function initPremiumSearchBar() {
  const wrapper = document.querySelector(".premium-search-wrapper");
  if (!wrapper) return;

  const sections = wrapper.querySelectorAll(".search-section");
  const panels = wrapper.querySelectorAll(".search-panel");
  const submitBtn = document.getElementById("search-bar-submit");

  const valDest = document.getElementById("val-destination");
  const valDates = document.getElementById("val-dates");
  const valGuests = document.getElementById("val-guests");

  function showValidationToast(message) {
    let container = document.getElementById("notification-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = "toast-notification error-toast";
    notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-exclamation toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hide");
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

  function openNextMissingPanel() {
    closeAllPanels();
    const dest = searchState.destination.trim();
    const hasDates = valDates && valDates.textContent !== "Add dates";
    const hasGuests = valGuests && valGuests.textContent !== "Add guests";

    let targetSectionId = null;
    let targetPanelId = null;

    if (!dest) {
      targetSectionId = "search-dest-section";
      targetPanelId = "panel-dest";
    } else if (!hasDates) {
      targetSectionId = "search-dates-section";
      targetPanelId = "panel-dates";
    } else if (!hasGuests) {
      targetSectionId = "search-guests-section";
      targetPanelId = "panel-guests";
    }

    if (targetSectionId && targetPanelId) {
      const section = document.getElementById(targetSectionId);
      const panel = document.getElementById(targetPanelId);
      if (section && panel) {
        panel.classList.add("open");
        section.classList.add("active");
        const container = wrapper.querySelector(".premium-search-container");
        if (container) container.classList.add("active");
      }
    }
  }

  const searchState = {
    destination: "",
    checkIn: null,
    checkOut: null,
    guests: {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    },
  };
  window.premiumSearchState = searchState;

  function resetDropdownSearchUI() {
    searchState.destination = "";
    searchState.checkIn = null;
    searchState.checkOut = null;
    searchState.guests = {
      adults: 1,
      children: 0,
      infants: 0,
      pets: 0,
    };

    if (valDest) valDest.textContent = "Search destinations";
    if (valDates) valDates.textContent = "Add dates";
    if (valGuests) valGuests.textContent = "Add guests";

    const destInput = document.getElementById("dest-input");
    if (destInput) destInput.value = "";

    const calCheckinVal = document.getElementById("cal-checkin-val");
    const calCheckoutVal = document.getElementById("cal-checkout-val");
    if (calCheckinVal) calCheckinVal.textContent = "Add dates";
    if (calCheckoutVal) calCheckoutVal.textContent = "Add dates";

    if (window._searchCalendar) window._searchCalendar.reset();

    const cntAdults = document.getElementById("count-adults");
    const cntChildren = document.getElementById("count-children");
    const cntInfants = document.getElementById("count-infants");
    const cntPets = document.getElementById("count-pets");
    if (cntAdults) cntAdults.textContent = "1";
    if (cntChildren) cntChildren.textContent = "0";
    if (cntInfants) cntInfants.textContent = "0";
    if (cntPets) cntPets.textContent = "0";

    const minusButtons = wrapper.querySelectorAll(".counter-control .minus");
    minusButtons.forEach((btn) => {
      btn.disabled = true;
    });
  }
  window.resetDropdownSearchUI = resetDropdownSearchUI;

  function updateClearButtonVisibility() {
    const clearBtn = document.getElementById("search-bar-clear");
    if (!clearBtn) return;

    const hasDest = searchState.destination.trim() !== "";
    const hasDates = valDates && valDates.textContent !== "Add dates";
    const hasGuests = valGuests && valGuests.textContent !== "Add guests";

    if (hasDest || hasDates || hasGuests) {
      clearBtn.classList.add("show");
    } else {
      clearBtn.classList.remove("show");
    }
  }
  window.updateClearButtonVisibility = updateClearButtonVisibility;

  const clearBtn = document.getElementById("search-bar-clear");
  if (clearBtn) {
    clearBtn.addEventListener("click", (e) => {
      e.preventDefault();

      resetDropdownSearchUI();

      const navSearchInput = document.querySelector(
        'form[role="search"] .search-inp',
      );
      if (navSearchInput) navSearchInput.value = "";

      const filters = document.querySelectorAll(".filter");
      filters.forEach((f) => f.classList.remove("active"));

      window.history.replaceState({}, document.title, window.location.pathname);

      resetListingsFilter();

      const sectionTitleEl = document.querySelector(
        ".section-header .section-title",
      );
      const sectionSubtitleEl = document.querySelector(
        ".section-header .section-subtitle",
      );
      if (sectionTitleEl) {
        sectionTitleEl.innerHTML =
          'Find Your <span class="gradient-text">Perfect Stay</span>';
      }
      if (sectionSubtitleEl) {
        sectionSubtitleEl.textContent = "Discover handpicked luxury homes";
      }

      clearBtn.classList.remove("show");
    });
  }

  setTimeout(updateClearButtonVisibility, 200);

  function closeAllPanels() {
    panels.forEach((p) => p.classList.remove("open"));
    sections.forEach((s) => s.classList.remove("active"));
    const container = wrapper.querySelector(".premium-search-container");
    if (container) container.classList.remove("active");
  }

  sections.forEach((section) => {
    section.addEventListener("click", (e) => {
      e.stopPropagation();
      const sectionId = section.id;
      let targetPanelId = "";

      if (sectionId === "search-dest-section")
        targetPanelId = "panel-destination";
      else if (sectionId === "search-dates-section")
        targetPanelId = "panel-dates";
      else if (sectionId === "search-guests-section")
        targetPanelId = "panel-guests";

      const targetPanel = document.getElementById(targetPanelId);
      if (!targetPanel) return;
      const isOpen = targetPanel.classList.contains("open");

      closeAllPanels();

      if (!isOpen) {
        targetPanel.classList.add("open");
        section.classList.add("active");
        const container = wrapper.querySelector(".premium-search-container");
        if (container) container.classList.add("active");

        if (sectionId === "search-dest-section") {
          const input = document.getElementById("dest-input");
          if (input) setTimeout(() => input.focus(), 150);
        }
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      closeAllPanels();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllPanels();
    }
  });

  panels.forEach((panel) => {
    panel.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  const destInput = document.getElementById("dest-input");
  const popularItems = wrapper.querySelectorAll(".popular-dest-item");
  const exploreAllBtn = document.getElementById("explore-all-btn");

  function setDestination(value) {
    searchState.destination = value;
    if (valDest) valDest.textContent = value || "Search destinations";
    if (destInput) destInput.value = value;
  }
  window.setPremiumSearchDestination = setDestination;
  window.filterPremiumListings = filterListings;

  popularItems.forEach((item) => {
    item.addEventListener("click", () => {
      const val = item.getAttribute("data-value");
      setDestination(val);
      if (!validateSearchInputs()) {
        openNextMissingPanel();
        return;
      }
      closeAllPanels();
      filterListings();
    });
  });

  if (destInput) {
    destInput.addEventListener("input", (e) => {
      setDestination(e.target.value);
    });
    destInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!validateSearchInputs()) return;
        closeAllPanels();
        filterListings();
      }
    });
  }

  if (exploreAllBtn) {
    exploreAllBtn.addEventListener("click", () => {
      setDestination("");
      closeAllPanels();
      resetListingsFilter();
    });
  }

  const calCheckinVal = document.getElementById("cal-checkin-val");
  const calCheckoutVal = document.getElementById("cal-checkout-val");
  let dateSelectionStep = 1;

  const searchCalGrid = document.getElementById("search-calendar-grid");
  const searchCalTitle = document.getElementById("search-cal-month-title");
  const searchCalPrev = document.getElementById("cal-prev");
  const searchCalNext = document.getElementById("cal-next");

  if (searchCalGrid && searchCalTitle) {
    function normDate(d) {
      const n = new Date(d.getTime());
      n.setHours(0, 0, 0, 0);
      return n;
    }

    function searchCalRange(cellDate) {
      if (!searchState.checkIn) return null;
      const ci = normDate(searchState.checkIn).getTime();
      const ct = cellDate.getTime();
      if (!searchState.checkOut) {
        return ct === ci ? "start" : null;
      }
      const co = normDate(searchState.checkOut).getTime();
      if (ct === ci) return "start";
      if (ct === co) return "end";
      if (ct > ci && ct < co) return "between";
      return null;
    }

    window._searchCalendar = initCalendar({
      container: searchCalGrid,
      monthTitle: searchCalTitle,
      prevBtn: searchCalPrev,
      nextBtn: searchCalNext,
      onDayClick: function (dateObj) {
        if (dateSelectionStep === 1) {
          searchState.checkIn = dateObj;
          searchState.checkOut = null;
          if (calCheckinVal)
            calCheckinVal.textContent = formatDateForDisplay(dateObj);
          if (calCheckoutVal) calCheckoutVal.textContent = "Add dates";
          dateSelectionStep = 2;
          window._searchCalendar.renderMonth();
        } else {
          const ci = normDate(searchState.checkIn).getTime();
          const clicked = normDate(dateObj).getTime();
          if (clicked <= ci) {
            searchState.checkIn = dateObj;
            searchState.checkOut = null;
            if (calCheckinVal)
              calCheckinVal.textContent = formatDateForDisplay(dateObj);
            if (calCheckoutVal) calCheckoutVal.textContent = "Add dates";
            dateSelectionStep = 2;
            window._searchCalendar.renderMonth();
          } else {
            searchState.checkOut = dateObj;
            if (calCheckoutVal)
              calCheckoutVal.textContent = formatDateForDisplay(dateObj);
            if (valDates)
              valDates.textContent = `${formatDateForDisplay(searchState.checkIn)} – ${formatDateForDisplay(dateObj)}`;
            dateSelectionStep = 1;
            window._searchCalendar.renderMonth();
            setTimeout(() => {
              closeAllPanels();
              const hasGuests =
                valGuests && valGuests.textContent !== "Add guests";
              if (!hasGuests) {
                const guestsSection = document.getElementById(
                  "search-guests-section",
                );
                const guestsPanel = document.getElementById("panel-guests");
                if (guestsSection && guestsPanel) {
                  guestsPanel.classList.add("open");
                  guestsSection.classList.add("active");
                  const container = wrapper.querySelector(
                    ".premium-search-container",
                  );
                  if (container) container.classList.add("active");
                  showValidationToast("Please add guests.");
                }
              }
            }, 300);
          }
        }
      },
      isInRange: searchCalRange,
    });
  }

  const counters = {
    adults: document.getElementById("count-adults"),
    children: document.getElementById("count-children"),
    infants: document.getElementById("count-infants"),
    pets: document.getElementById("count-pets"),
  };

  const doneBtn = document.getElementById("guests-done-btn");

  wrapper.querySelectorAll(".counter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-type");
      const isPlus = btn.classList.contains("plus");
      let val = searchState.guests[type];

      if (isPlus) {
        val++;
      } else {
        val = Math.max(0, val - 1);
        if (type === "adults" && val === 0) {
          const otherGuests =
            searchState.guests.children +
            searchState.guests.infants +
            searchState.guests.pets;
          if (otherGuests > 0) val = 1;
        }
      }

      searchState.guests[type] = val;
      if (counters[type]) counters[type].textContent = val;

      const minusBtn = btn.parentNode.querySelector(".minus");

      if (minusBtn) {
        if (val === 0 || (type === "adults" && val === 1)) {
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

    let summary = `${totalGuests} guest${totalGuests !== 1 ? "s" : ""}`;
    if (totalInfants > 0) {
      summary += `, ${totalInfants} infant${totalInfants !== 1 ? "s" : ""}`;
    }
    if (totalPets > 0) {
      summary += `, ${totalPets} pet${totalPets !== 1 ? "s" : ""}`;
    }

    if (valGuests) valGuests.textContent = summary;
  }

  if (doneBtn) {
    doneBtn.addEventListener("click", () => {
      closeAllPanels();
    });
  }

  function resetListingsFilter() {
    const listingCols = document.querySelectorAll(".listings-grid .col");
    const emptyState = document.querySelector(".empty-state");

    listingCols.forEach((col) => {
      delete col.dataset.filteredOut;
      col.classList.remove("d-none");
    });
    if (emptyState) emptyState.classList.add("d-none");
    if (window.updateMobilePagination) {
      window.updateMobilePagination(true);
    }
  }

  function filterListings() {
    const navSearchInput = document.querySelector(
      'form[role="search"] .search-inp',
    );
    if (navSearchInput) navSearchInput.value = "";

    const destination = searchState.destination.trim();

    const hasCategory = new URLSearchParams(window.location.search).has(
      "category",
    );
    if (hasCategory && destination) {
      window.location.href = `/listings?dest=${encodeURIComponent(destination)}`;
      return;
    }
    const sectionTitleEl = document.querySelector(
      ".section-header .section-title",
    );
    const sectionSubtitleEl = document.querySelector(
      ".section-header .section-subtitle",
    );

    if (!destination) {
      resetListingsFilter();
      if (sectionTitleEl) {
        sectionTitleEl.innerHTML =
          'Find Your <span class="gradient-text">Perfect Stay</span>';
      }
      if (sectionSubtitleEl) {
        sectionSubtitleEl.textContent = "Discover handpicked luxury homes";
      }
      return;
    }

    if (sectionTitleEl) {
      sectionTitleEl.innerHTML = `${destination} <span class="gradient-text">Stays</span>`;
    }
    if (sectionSubtitleEl) {
      sectionSubtitleEl.textContent = "Discover our most popular stays";
    }

    const destinationLower = destination.toLowerCase();
    const listingCols = document.querySelectorAll(".listings-grid .col");
    const emptyState = document.querySelector(".empty-state");
    let matchedCount = 0;

    listingCols.forEach((col) => {
      const titleEl = col.querySelector(".card-title-text");
      const locationEl = col.querySelector(".location-badge span");

      const titleText = titleEl ? titleEl.textContent.toLowerCase() : "";
      const locationText = locationEl
        ? locationEl.textContent.toLowerCase()
        : "";

      if (
        titleText.includes(destinationLower) ||
        locationText.includes(destinationLower)
      ) {
        delete col.dataset.filteredOut;
        matchedCount++;
      } else {
        col.dataset.filteredOut = "true";
      }
    });

    if (window.updateMobilePagination) {
      window.updateMobilePagination(true);
    }

    if (emptyState) {
      if (matchedCount === 0) {
        emptyState.classList.remove("d-none");
        const titleEl = emptyState.querySelector(".empty-state-title");
        const textEl = emptyState.querySelector(".empty-state-text");
        if (titleEl) titleEl.textContent = "No Curated Stays Found";
        if (textEl)
          textEl.textContent = `We couldn't find any premium stays matching "${searchState.destination}".`;
      } else {
        emptyState.classList.add("d-none");
      }
    }

    const totalGuests = searchState.guests.adults + searchState.guests.children;
    let notificationMsg = `Showing stays in "${searchState.destination}"`;
    if (totalGuests > 1) {
      notificationMsg += ` for ${totalGuests} guests`;
    }

    let container = document.getElementById("notification-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = "toast-notification";
    notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-circle-check toast-icon"></i>
                <span class="toast-message">${notificationMsg}</span>
            </div>
        `;
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hide");
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 3000);
    updateClearButtonVisibility();
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (!validateSearchInputs()) {
        openNextMissingPanel();
        return;
      }
      closeAllPanels();
      filterListings();
    });
  }
})();

(function initNavbarSearch() {
  const searchForm = document.querySelector('form[role="search"]');
  if (!searchForm) return;

  const searchInput = searchForm.querySelector(".search-inp");
  if (!searchInput) return;

  function resetListings() {
    const listingCols = document.querySelectorAll(".listings-grid .col");
    const emptyState = document.querySelector(".empty-state");
    listingCols.forEach((col) => col.classList.remove("d-none"));
    if (emptyState) emptyState.classList.add("d-none");
  }

  function performSearch(query) {
    if (window.resetDropdownSearchUI) {
      window.resetDropdownSearchUI();
    }

    const cleanQuery = query.trim();
    const sectionTitleEl = document.querySelector(
      ".section-header .section-title",
    );
    const sectionSubtitleEl = document.querySelector(
      ".section-header .section-subtitle",
    );

    if (!cleanQuery) {
      resetListings();
      if (sectionTitleEl) {
        sectionTitleEl.innerHTML =
          'Find Your <span class="gradient-text">Perfect Stay</span>';
      }
      if (sectionSubtitleEl) {
        sectionSubtitleEl.textContent = "Discover handpicked luxury homes";
      }
      return;
    }

    if (sectionTitleEl) {
      sectionTitleEl.innerHTML = `${cleanQuery} <span class="gradient-text">Stays</span>`;
    }
    if (sectionSubtitleEl) {
      sectionSubtitleEl.textContent = "Discover our most popular stays";
    }

    const cleanQueryLower = cleanQuery.toLowerCase();
    const listingCols = document.querySelectorAll(".listings-grid .col");
    const emptyState = document.querySelector(".empty-state");
    let matchedCount = 0;

    listingCols.forEach((col) => {
      const titleEl = col.querySelector(".card-title-text");
      const locationEl = col.querySelector(".location-badge span");

      const titleText = titleEl ? titleEl.textContent.toLowerCase() : "";
      const locationText = locationEl
        ? locationEl.textContent.toLowerCase()
        : "";

      if (
        titleText.includes(cleanQueryLower) ||
        locationText.includes(cleanQueryLower)
      ) {
        delete col.dataset.filteredOut;
        matchedCount++;
      } else {
        col.dataset.filteredOut = "true";
      }
    });

    if (window.updateMobilePagination) {
      window.updateMobilePagination(true);
    }

    if (emptyState) {
      if (matchedCount === 0) {
        emptyState.classList.remove("d-none");
        const titleEl = emptyState.querySelector(".empty-state-title");
        const textEl = emptyState.querySelector(".empty-state-text");
        if (titleEl) titleEl.textContent = "No Match Found";
        if (textEl)
          textEl.textContent = `We couldn't find any listings matching "${query}".`;
      } else {
        emptyState.classList.add("d-none");
      }
    }

    showSearchToast(`Found ${matchedCount} listings for "${query}"`);
    if (window.updateClearButtonVisibility) {
      window.updateClearButtonVisibility();
    }
  }

  function showSearchToast(message) {
    let container = document.getElementById("notification-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "notification-container";
      document.body.appendChild(container);
    }

    const notification = document.createElement("div");
    notification.className = "toast-notification";
    notification.innerHTML = `
            <div class="toast-content">
                <i class="fa-solid fa-magnifying-glass toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
    container.appendChild(notification);

    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hide");
      setTimeout(() => {
        notification.remove();
      }, 400);
    }, 3000);
  }

  searchInput.addEventListener("search", () => {
    if (searchInput.value.trim() === "") {
      performSearch("");
    }
  });

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() === "") {
      performSearch("");
    }
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value;

    const isHomepage =
      window.location.pathname === "/" ||
      window.location.pathname === "/listings";
    const hasCategory = new URLSearchParams(window.location.search).has(
      "category",
    );

    if (!isHomepage || hasCategory) {
      window.location.href = `/listings?q=${encodeURIComponent(query)}`;
    } else {
      performSearch(query);
    }
  });

  const isHomepage =
    window.location.pathname === "/" ||
    window.location.pathname === "/listings";
  if (isHomepage) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");
    const dest = urlParams.get("dest");
    if (query) {
      searchInput.value = query;
      setTimeout(() => {
        performSearch(query);
      }, 100);

      const cleanUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
    } else if (dest) {
      setTimeout(() => {
        if (window.setPremiumSearchDestination) {
          window.setPremiumSearchDestination(dest);
        }
        if (window.filterPremiumListings) {
          window.filterPremiumListings();
        }
      }, 100);

      const cleanUrl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname;
      window.history.replaceState({ path: cleanUrl }, "", cleanUrl);
    }
  }
})();

(function initNavPlaceholder() {
  function updateNavPlaceholder() {
    const navInput = document.getElementById("nav-search-input");
    if (navInput) {
      if (window.innerWidth <= 991) {
        navInput.placeholder = "Search";
      } else {
        navInput.placeholder = "Search destinations...";
      }
    }
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateNavPlaceholder);
  } else {
    updateNavPlaceholder();
  }
  window.addEventListener("resize", updateNavPlaceholder);
})();

(function initMobileFilterWheel() {
  const filterBar = document.getElementById("filters");
  if (!filterBar) return;

  function resetFilterScroll() {
    filterBar.scrollLeft = 0;
  }
  resetFilterScroll();
  window.addEventListener("load", resetFilterScroll);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", resetFilterScroll);
  }

  filterBar.addEventListener(
    "wheel",
    (e) => {
      if (window.innerWidth <= 991 && e.deltaY !== 0) {
        e.preventDefault();
        filterBar.scrollLeft += e.deltaY * 1.5;
      }
    },
    { passive: false },
  );
})();

(function initMobilePagination() {
  const BATCH_SIZE = 10;
  let currentLimit = BATCH_SIZE;

  function applyMobilePagination(reset = false) {
    const isMobile = window.innerWidth <= 991;
    const showMoreBtn = document.getElementById("mobile-show-more-btn");
    const showMoreContainer = document.querySelector(".show-more-container");
    const listingCols = Array.from(
      document.querySelectorAll(".listings-grid .col"),
    );

    if (listingCols.length === 0) return;

    if (reset) {
      currentLimit = BATCH_SIZE;
    }

    if (!isMobile) {
      listingCols.forEach((col) => {
        if (col.dataset.filteredOut === "true") {
          col.classList.add("d-none");
        } else {
          col.classList.remove("d-none");
        }
      });
      if (showMoreContainer) showMoreContainer.classList.remove("show");
      return;
    }

    const matchedCols = listingCols.filter(
      (col) => col.dataset.filteredOut !== "true",
    );

    matchedCols.forEach((col, index) => {
      if (index < currentLimit) {
        col.classList.remove("d-none");
      } else {
        col.classList.add("d-none");
      }
    });

    listingCols.forEach((col) => {
      if (col.dataset.filteredOut === "true") {
        col.classList.add("d-none");
      }
    });

    if (showMoreContainer) {
      if (matchedCols.length > currentLimit) {
        showMoreContainer.classList.add("show");
      } else {
        showMoreContainer.classList.remove("show");
      }
    }
  }
  window.updateMobilePagination = applyMobilePagination;

  const showMoreBtn = document.getElementById("mobile-show-more-btn");
  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      currentLimit += BATCH_SIZE;
      applyMobilePagination(false);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () =>
      applyMobilePagination(true),
    );
  } else {
    applyMobilePagination(true);
  }

  window.addEventListener("resize", () => applyMobilePagination(false));
})();
