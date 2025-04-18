const terminal = document.getElementById("terminal");
const button = document.getElementById("start-button");

button.addEventListener("click", async () => {
  terminal.value = "Loading...\n";

  try {
    const response = await fetch("/run", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: "start" }),
    });

    const text = await response.text();
    terminal.value = text;
  } catch (error) {
    terminal.value = "Error: Could not connect to server.\n" + error;
  }
});
