function formatDateForDisplay(dateObj) {
  const MONTHS_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = dateObj.getDate();
  const mon = MONTHS_SHORT[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${mon} ${year}`;
}

function initCalendar(config) {
  const { container, monthTitle, prevBtn, nextBtn, onDayClick, isInRange } =
    config;

  if (!container || !monthTitle) return null;

  const MONTHS_FULL = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const now = new Date();
  let displayYear = now.getFullYear();
  let displayMonth = now.getMonth();

  function renderMonth() {
    monthTitle.textContent = `${MONTHS_FULL[displayMonth]} ${displayYear}`;
    container.innerHTML = "";

    DAY_LABELS.forEach((label) => {
      const el = document.createElement("div");
      el.className = "calendar-day-label";
      el.textContent = label;
      container.appendChild(el);
    });

    const firstDayOfWeek = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      const el = document.createElement("div");
      el.className = "calendar-day empty";
      el.textContent = daysInPrevMonth - firstDayOfWeek + 1 + i;
      container.appendChild(el);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const el = document.createElement("div");
      el.className = "calendar-day";
      el.textContent = day;

      const cellDate = new Date(displayYear, displayMonth, day);
      cellDate.setHours(0, 0, 0, 0);

      if (cellDate < today) {
        el.classList.add("disabled");
      } else {
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onDayClick) {
            onDayClick(new Date(displayYear, displayMonth, day));
          }
        });
      }

      if (isInRange) {
        const rangeStatus = isInRange(cellDate);
        if (rangeStatus === "start") {
          el.classList.add("selected", "range-start");
        } else if (rangeStatus === "end") {
          el.classList.add("selected", "range-end");
        } else if (rangeStatus === "between") {
          el.classList.add("range-between");
        }
      }

      container.appendChild(el);
    }

    const totalCells = firstDayOfWeek + daysInMonth;
    const trailingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    for (let i = 1; i <= trailingCells; i++) {
      const el = document.createElement("div");
      el.className = "calendar-day empty";
      el.textContent = i;
      container.appendChild(el);
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      displayMonth--;
      if (displayMonth < 0) {
        displayMonth = 11;
        displayYear--;
      }
      renderMonth();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      displayMonth++;
      if (displayMonth > 11) {
        displayMonth = 0;
        displayYear++;
      }
      renderMonth();
    });
  }

  renderMonth();

  return {
    reset() {
      const now = new Date();
      displayYear = now.getFullYear();
      displayMonth = now.getMonth();
      renderMonth();
    },

    renderMonth,

    getCurrentMonth() {
      return { year: displayYear, month: displayMonth };
    },
  };
}
