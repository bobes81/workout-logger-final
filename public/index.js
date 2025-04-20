document.addEventListener("DOMContentLoaded", () => {
  const terminal = document.getElementById("terminal");
  const terminalContainer = document.getElementById("terminal-container");
  const button = document.getElementById("start-button");

  if (terminal && terminalContainer && button) {
    button.addEventListener("click", async () => {
      terminalContainer.classList.remove("hidden");
      terminal.innerText = "Loading...\n";

      try {
        const response = await fetch("/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: "start" }),
        });

        const text = await response.text();
        terminal.innerText = text;
      } catch (error) {
        terminal.innerText = "Error: Could not connect to server.\n" + error;
      }
    });
  } else {
    console.error("❌ Element #terminal, #terminal-container, or #start-button not found");
  }
});