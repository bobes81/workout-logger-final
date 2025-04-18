const term = document.querySelector("textarea");

term.addEventListener("keydown", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    const input = term.value.split("\n").pop();

    const response = await fetch("/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input }),
    });

    const data = await response.text();
    term.value += "\n" + data;
  }
});