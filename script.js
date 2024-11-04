// Select the button, display area, and loading indicator
const jokeButton = document.getElementById("jokeButton");
const jokeDisplay = document.getElementById("jokeDisplay");
const loadingIndicator = document.getElementById("loadingIndicator");

// Function to fetch a joke from the API
async function getJoke() {
  // Show the loading indicator and hide the joke display
  loadingIndicator.style.display = "block";
  jokeDisplay.style.display = "none";

  try {
    // API endpoint for random dad jokes
    const response = await fetch("https://icanhazdadjoke.com/", {
      headers: { Accept: "application/json" }
    });
    const data = await response.json();
    jokeDisplay.innerText = data.joke;
  } catch (error) {
    jokeDisplay.innerText = "Oops! Something went wrong. Try again!";
    console.error("Error fetching joke:", error);
  }

  // Hide the loading indicator and show the joke display
  loadingIndicator.style.display = "none";
  jokeDisplay.style.display = "block";
}

// Event listener for button click
jokeButton.addEventListener("click", getJoke);
