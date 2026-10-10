document.addEventListener("DOMContentLoaded", () => {
  const pages = document.querySelectorAll(".page");
  const navButtons = document.querySelectorAll(".nav-link");
  const pageButtons = document.querySelectorAll("[data-page]");
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  const year = document.getElementById("year");
  const educationList = document.getElementById("educationList");
  const projectList = document.getElementById("projectList");
  const educationDetailPanels = {
    uplb: document.getElementById("educationDetailUplb"),
    caraga: document.getElementById("educationDetailCaraga"),
    certificates: document.getElementById("educationDetailCertificates")
  };
  const projectDetailPanels = {
    nickel: document.getElementById("projectDetailNickel"),
    fragmentation: document.getElementById("projectDetailFragmentation"),
    waste: document.getElementById("projectDetailWaste"),
    insects: document.getElementById("projectDetailInsects"),
    costBenefit: document.getElementById("projectDetailCostBenefit")
  };
  let activeEducationTrigger = null;
  let activeProjectTrigger = null;

  // Automatically update the copyright year.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  function typeText(element) {
    const text = element.dataset.text || element.textContent.trim();
    element.textContent = "";
    element.classList.remove("done");

    let index = 0;
    const tick = () => {
      if (index <= text.length) {
        element.textContent = text.slice(0, index);
        index += 1;
        setTimeout(tick, 90);
      } else {
        element.classList.add("done");
      }
    };

    tick();
  }

  document.querySelectorAll(".typewriter").forEach(typeText);

  document.querySelectorAll(".education-photo").forEach((image) => {
    const placeholder = image.previousElementSibling;

    if (!placeholder) {
      return;
    }

    const updatePhotoState = () => {
      const isLoaded =
        image.hasAttribute("src") && image.complete && image.naturalWidth > 0;

      image.hidden = !isLoaded;
      placeholder.hidden = isLoaded;
    };

    image.addEventListener("load", updatePhotoState);
    image.addEventListener("error", updatePhotoState);
    updatePhotoState();
  });

  // Show one section and hide the rest.
  function showPage(pageId) {
    const targetPage = document.getElementById(pageId);

    // Do nothing if the requested section does not exist.
    if (!targetPage || !targetPage.classList.contains("page")) {
      return;
    }

    if (educationList) {
      educationList.hidden = false;
      Object.values(educationDetailPanels).forEach((panel) => {
        if (panel) {
          panel.hidden = true;
        }
      });
      activeEducationTrigger = null;
    }

    if (projectList) {
      projectList.hidden = false;
      Object.values(projectDetailPanels).forEach((panel) => {
        if (panel) {
          panel.hidden = true;
        }
      });
      document.querySelectorAll("[data-project-open]").forEach((button) => {
        button.setAttribute("aria-expanded", "false");
      });
      activeProjectTrigger = null;
    }

    pages.forEach((page) => {
      const isActive = page.id === pageId;

      page.hidden = !isActive;
      page.classList.toggle("active", isActive);
    });

    // Update the selected navigation item.
    navButtons.forEach((button) => {
      const isActive = button.dataset.page === pageId;

      button.classList.toggle("active", isActive);

      if (isActive) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    });

    // Close the mobile navigation after selecting a section.
    if (primaryNav) {
      primaryNav.classList.remove("open");
    }

    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
    }

    // Return to the top when switching sections.
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth"
    });
  }

  // Attach navigation behavior to every section button.
  pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      showPage(button.dataset.page);
    });
  });

  document.querySelectorAll("[data-education-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = educationDetailPanels[button.dataset.educationDetail];

      if (!educationList || !panel) {
        return;
      }

      activeEducationTrigger = button;
      educationList.hidden = true;
      Object.values(educationDetailPanels).forEach((detailPanel) => {
        if (detailPanel) {
          detailPanel.hidden = detailPanel !== panel;
        }
      });
      panel.querySelectorAll(".education-photo").forEach((image) => {
        if (!image.hasAttribute("src")) {
          image.src = image.dataset.src;
        }
      });

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
      const heading = panel.querySelector("h1");
      if (heading) {
        heading.focus({ preventScroll: true });
      }
    });
  });

  document.querySelectorAll(".education-back").forEach((button) => {
    button.addEventListener("click", () => {
      Object.values(educationDetailPanels).forEach((panel) => {
        if (panel) {
          panel.hidden = true;
        }
      });
      educationList.hidden = false;
      window.scrollTo({ top: 0, behavior: "auto" });
      if (activeEducationTrigger) {
        activeEducationTrigger.focus({ preventScroll: true });
      }
      activeEducationTrigger = null;
    });
  });

  document.querySelectorAll("[data-project-open]").forEach((button) => {
    button.setAttribute("aria-expanded", "false");
    button.addEventListener("click", () => {
      const panel = projectDetailPanels[button.dataset.projectOpen];

      if (!projectList || !panel) {
        return;
      }

      activeProjectTrigger = button;
      projectList.hidden = true;
      Object.values(projectDetailPanels).forEach((detailPanel) => {
        if (detailPanel) {
          detailPanel.hidden = detailPanel !== panel;
        }
      });
      button.setAttribute("aria-expanded", "true");

      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth"
      });
      const heading = panel.querySelector("h2");
      if (heading) {
        heading.focus({ preventScroll: true });
      }
    });
  });

  document.querySelectorAll(".project-back").forEach((button) => {
    button.addEventListener("click", () => {
      Object.values(projectDetailPanels).forEach((panel) => {
        if (panel) {
          panel.hidden = true;
        }
      });
      projectList.hidden = false;
      window.scrollTo({ top: 0, behavior: "auto" });
      if (activeProjectTrigger) {
        activeProjectTrigger.setAttribute("aria-expanded", "false");
        activeProjectTrigger.focus({ preventScroll: true });
      }
      activeProjectTrigger = null;
    });
  });

  // Toggle the mobile navigation menu.
  if (menuToggle && primaryNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
    });
  }

  // Display About by default.
  showPage("about");
});