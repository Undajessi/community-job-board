// main.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Community Job Board frontend loaded.");

  // Example placeholder function for backend calls
  async function fetchJobs() {
    try {
      const response = await fetch("/api/jobs"); // adjust URL when backend is ready
      if (response.ok) {
        const data = await response.json();
        console.log("Jobs loaded:", data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  }

  // Uncomment to test when backend is live
  // fetchJobs();
});
