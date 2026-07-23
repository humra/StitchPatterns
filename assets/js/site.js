document.addEventListener("DOMContentLoaded", () => {
  initialiseGallery();
  initialiseSizeCalculators();
  initialisePatternSorting();
  initialiseTagFilters();
  initialiseThreadSystemToggle();
});

function initialiseGallery() {
  const mainImage = document.querySelector("[data-gallery-main]");
  const thumbnails = document.querySelectorAll("[data-gallery-thumb]");

  if (!mainImage || thumbnails.length === 0) {
    return;
  }

  thumbnails.forEach((button) => {
    button.addEventListener("click", () => {
      mainImage.src = button.dataset.full;
      mainImage.alt = button.dataset.alt || "";

      thumbnails.forEach((thumbnail) => {
        const isSelected = thumbnail === button;
        thumbnail.classList.toggle("is-active", isSelected);
        thumbnail.setAttribute("aria-pressed", String(isSelected));
      });
    });
  });
}

function initialiseSizeCalculators() {
  const calculators = document.querySelectorAll("[data-size-calculator]");

  calculators.forEach((calculator) => {
    const widthStitches = Number(calculator.dataset.widthStitches);
    const heightStitches = Number(calculator.dataset.heightStitches);
    const select = calculator.querySelector("[data-aida-select]");
    const centimetres = calculator.querySelector("[data-size-centimetres]");
    const inches = calculator.querySelector("[data-size-inches]");

    if (
      !Number.isFinite(widthStitches) ||
      !Number.isFinite(heightStitches) ||
      !select ||
      !centimetres ||
      !inches
    ) {
      return;
    }

    const format = (value) =>
      value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

    const updateDimensions = () => {
      const aidaCount = Number(select.value);

      if (!Number.isFinite(aidaCount) || aidaCount <= 0) {
        return;
      }

      const widthInches = widthStitches / aidaCount;
      const heightInches = heightStitches / aidaCount;

      inches.textContent =
        `${format(widthInches)} × ${format(heightInches)} in`;

      centimetres.textContent =
        `${format(widthInches * 2.54)} × ${format(heightInches * 2.54)} cm`;
    };

    select.addEventListener("change", updateDimensions);
    updateDimensions();
  });
}

function initialisePatternSorting() {
  const grid = document.querySelector("[data-pattern-grid]");
  const sort = document.querySelector("[data-pattern-sort]");

  if (!grid || !sort) {
    return;
  }

  const sortPatterns = () => {
    const cards = Array.from(
      grid.querySelectorAll(".pattern-card")
    );

    cards.sort((first, second) => {
      const firstTitle = first.dataset.title || "";
      const secondTitle = second.dataset.title || "";

      const firstDate = Number(
        first.dataset.dateAdded || 0
      );

      const secondDate = Number(
        second.dataset.dateAdded || 0
      );

      switch (sort.value) {
        case "oldest":
          return firstDate - secondDate;

        case "title-asc":
          return firstTitle.localeCompare(secondTitle);

        case "title-desc":
          return secondTitle.localeCompare(firstTitle);

        case "newest":
        default:
          return secondDate - firstDate;
      }
    });

    cards.forEach((card) => {
      grid.appendChild(card);
    });
  };

  sort.addEventListener("change", sortPatterns);

  // Ensure the selected sorting is applied on page load.
  sortPatterns();
}

function initialiseTagFilters() {
  const filterContainer = document.querySelector("[data-tag-filters]");
  const cards = document.querySelectorAll(".pattern-card");

  if (!filterContainer || cards.length === 0) {
    return;
  }

  const buttons = filterContainer.querySelectorAll("[data-tag-filter]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedTag = button.dataset.tagFilter;

      buttons.forEach((item) => {
        item.classList.toggle("is-active", item === button);
      });

      cards.forEach((card) => {
        const tags = card.dataset.tags
          .split(",")
          .map((tag) => tag.trim());

        card.hidden =
          selectedTag !== "all" && !tags.includes(selectedTag);
      });
    });
  });
}

function initialiseThreadSystemToggle() {
  const threadTables = document.querySelectorAll("[data-thread-table]");

  threadTables.forEach((threadTable) => {
    const buttons = threadTable.querySelectorAll(
      "[data-thread-system-button]"
    );

    if (buttons.length === 0) {
      return;
    }

    const setThreadSystem = (system) => {
      threadTable.dataset.threadSystem = system;

      buttons.forEach((button) => {
        const isActive =
          button.dataset.threadSystemButton === system;

        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
    };

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        setThreadSystem(
          button.dataset.threadSystemButton
        );
      });
    });

    setThreadSystem("anchor");
  });
}