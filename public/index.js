document.addEventListener("DOMContentLoaded", () => {
    const terminalContainer = document.getElementById("terminal-container");
    const button = document.getElementById("start-button");
  
    if (terminalContainer && button) {
      button.addEventListener("click", () => {
        terminalContainer.classList.remove("hidden");
      });
    } else {
      console.error("❌ Elementy nebyly nalezeny.");
    }
  });
  