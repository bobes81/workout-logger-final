document.addEventListener("DOMContentLoaded", () => {
    const terminal = document.getElementById("terminal");
    const button = document.getElementById("start-button");
  
    if (terminal && button) {
      button.addEventListener("click", async () => {
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
      console.error("❌ Element terminal or button not found");
    }
  });

