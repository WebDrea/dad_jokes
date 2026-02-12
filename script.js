const jokeButton = document.getElementById("jokeButton");
const copyButton = document.getElementById("copyButton");
const jokeDisplay = document.getElementById("jokeDisplay");
const loadingIndicator = document.getElementById("loadingIndicator");

function setLoading(isLoading) {
  loadingIndicator.hidden = !isLoading;
  jokeDisplay.style.display = isLoading ? "none" : "block";
  jokeButton.disabled = isLoading;
  jokeButton.classList.toggle("disabled", isLoading);
}

async function getJoke() {
  setLoading(true);

  try {
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    jokeDisplay.textContent = data.joke;

    // little pop animation
    jokeDisplay.classList.remove("pop");
    void jokeDisplay.offsetWidth; // reflow
    jokeDisplay.classList.add("pop");
  } catch (error) {
    jokeDisplay.textContent = "Oops! Something went wrong. Try again!";
    console.error("Error fetching joke:", error);
  } finally {
    setLoading(false);
  }
}

async function copyJoke() {
  const text = jokeDisplay.textContent.trim();
  if (!text) return;

  try {
    await navigator.clipboard.writeText(text);
    copyButton.textContent = "Copied!";
    setTimeout(() => (copyButton.textContent = "Copy"), 900);
  } catch {
    copyButton.textContent = "Copy failed";
    setTimeout(() => (copyButton.textContent = "Copy"), 900);
  }
}

jokeButton.addEventListener("click", getJoke);
copyButton.addEventListener("click", copyJoke);

// Keyboard support
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    // avoid triggering when focused on a button (it already handles it)
    if (document.activeElement?.tagName !== "BUTTON") getJoke();
  }
});

// Load one automatically on page open
getJoke();
