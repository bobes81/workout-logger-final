document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal-output");
    const button = document.getElementById("start-button");
  
    button.addEventListener("click", async () => {
      terminal.innerText = "Loading Workout Logger...\n";
  
      try {
        const response = await fetch("/run", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ input: "start" }),
        });
  
        const result = await response.text();
        terminal.innerText = result;
      } catch (error) {
        terminal.innerText = "Error: Could not connect to server.\n" + error;
      }
    });
  });