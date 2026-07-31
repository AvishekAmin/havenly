// ============================================
// Havenly — Shared Calendar Engine
// Dynamically renders month grids with
// navigation, past-date disabling, and
// range-selection support.
// ============================================

/**
 * Format a Date object into "D Mon YYYY" for display / pipeline.
 * Example: new Date(2026, 7, 5) → "5 Aug 2026"
 * ONLY use at display/pipeline boundaries.
 */
function formatDateForDisplay(dateObj) {
    const MONTHS_SHORT = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const day = dateObj.getDate();
    const mon = MONTHS_SHORT[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    return `${day} ${mon} ${year}`;
}

/**
 * Initialise a dynamic calendar inside the given container elements.
 *
 * @param {Object} config
 * @param {HTMLElement} config.container    - The .calendar-grid element
 * @param {HTMLElement} config.monthTitle   - The .calendar-month-title element
 * @param {HTMLElement} config.prevBtn      - Previous month button
 * @param {HTMLElement} config.nextBtn      - Next month button
 * @param {Function}    config.onDayClick   - Called with (dateObj) when a valid day is clicked
 * @param {Function}   [config.isInRange]   - Optional. Called with (dateObj) → returns
 *                                            'start'|'end'|'between'|null for range highlighting
 * @returns {{ reset: Function, renderMonth: Function, getCurrentMonth: Function }}
 */
function initCalendar(config) {
    const {
        container,
        monthTitle,
        prevBtn,
        nextBtn,
        onDayClick,
        isInRange
    } = config;

    if (!container || !monthTitle) return null;

    const MONTHS_FULL = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Today at midnight for comparisons
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Current displayed month/year
    const now = new Date();
    let displayYear = now.getFullYear();
    let displayMonth = now.getMonth(); // 0-indexed

    /**
     * Render the calendar grid for the current displayMonth/displayYear.
     */
    function renderMonth() {
        // Update title
        monthTitle.textContent = `${MONTHS_FULL[displayMonth]} ${displayYear}`;

        // Clear grid
        container.innerHTML = '';

        // Day-of-week header labels
        DAY_LABELS.forEach(label => {
            const el = document.createElement('div');
            el.className = 'calendar-day-label';
            el.textContent = label;
            container.appendChild(el);
        });

        // First day of month (0=Sun … 6=Sat)
        const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();

        // Number of days in this month
        const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

        // Number of days in previous month (for leading empties)
        const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

        // Leading empty cells (show previous month's trailing days, greyed out)
        for (let i = 0; i < firstDayOfWeek; i++) {
            const el = document.createElement('div');
            el.className = 'calendar-day empty';
            el.textContent = daysInPrevMonth - firstDayOfWeek + 1 + i;
            container.appendChild(el);
        }

        // Actual day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const el = document.createElement('div');
            el.className = 'calendar-day';
            el.textContent = day;

            const cellDate = new Date(displayYear, displayMonth, day);
            cellDate.setHours(0, 0, 0, 0);

            // Disable past dates
            if (cellDate < today) {
                el.classList.add('disabled');
            } else {
                // Attach click handler for valid dates
                el.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (onDayClick) {
                        onDayClick(new Date(displayYear, displayMonth, day));
                    }
                });
            }

            // Apply range highlighting if callback provided
            if (isInRange) {
                const rangeStatus = isInRange(cellDate);
                if (rangeStatus === 'start') {
                    el.classList.add('selected', 'range-start');
                } else if (rangeStatus === 'end') {
                    el.classList.add('selected', 'range-end');
                } else if (rangeStatus === 'between') {
                    el.classList.add('range-between');
                }
            }

            container.appendChild(el);
        }

        // Trailing empty cells to fill the last week row
        const totalCells = firstDayOfWeek + daysInMonth;
        const trailingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= trailingCells; i++) {
            const el = document.createElement('div');
            el.className = 'calendar-day empty';
            el.textContent = i;
            container.appendChild(el);
        }
    }

    // Navigation: Previous month (always enabled — past months can be viewed)
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            displayMonth--;
            if (displayMonth < 0) {
                displayMonth = 11;
                displayYear--;
            }
            renderMonth();
        });
    }

    // Navigation: Next month
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            displayMonth++;
            if (displayMonth > 11) {
                displayMonth = 0;
                displayYear++;
            }
            renderMonth();
        });
    }

    // Initial render
    renderMonth();

    // Public API
    return {
        /** Reset to current month and re-render */
        reset() {
            const now = new Date();
            displayYear = now.getFullYear();
            displayMonth = now.getMonth();
            renderMonth();
        },
        /** Force a re-render of the currently displayed month (e.g. after selection changes) */
        renderMonth,
        /** Get the currently displayed { year, month } */
        getCurrentMonth() {
            return { year: displayYear, month: displayMonth };
        }
    };
}
