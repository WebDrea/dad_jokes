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

  // ⭐ Multiple joke sources
  const apis = [
    { url: "https://icanhazdadjoke.com/", type: "dad" },
    { url: "https://official-joke-api.appspot.com/random_joke", type: "official" },
    { url: "https://api.chucknorris.io/jokes/random", type: "chuck" },
    { url: "https://geek-jokes.sameerkumar.website/api?format=json", type: "geek" },
    { url: "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist", type: "jokeapi" }
  ];

  const choice = apis[Math.floor(Math.random() * apis.length)];

  try {
    const response = await fetch(choice.url, {
      headers: choice.type === "dad"
        ? { Accept: "application/json" }
        : {}
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();

    let joke = "";

    if (choice.type === "dad") {
      joke = data.joke;
    } 
    else if (choice.type === "official") {
      joke = `${data.setup} — ${data.punchline}`;
    } 
    else if (choice.type === "chuck") {
      joke = data.value;
    } 
    else if (choice.type === "geek") {
      joke = data.joke;
    } 
    else if (choice.type === "jokeapi") {
      joke = data.type === "single"
        ? data.joke
        : `${data.setup} — ${data.delivery}`;
    }

    jokeDisplay.textContent = joke;

    // ⭐ Animation reset
    jokeDisplay.classList.remove("pop");
    void jokeDisplay.offsetWidth;
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

// ⭐ Keyboard shortcut
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.key === " ") {
    if (document.activeElement?.tagName !== "BUTTON") getJoke();
  }
});

// ⭐ Auto load first joke
getJoke();
