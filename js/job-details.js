// job-details.js

// Fetch job ID from URL
const urlParams = new URLSearchParams(window.location.search);
const jobId = parseInt(urlParams.get("id"), 10);

// Get all jobs
const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
const job = jobs[jobId];

// Elements
const jobDetailsSection = document.getElementById("job-details");
const form = document.getElementById("application-form");

// Display job details
if (job) {
  jobDetailsSection.innerHTML = `
    <div class="job-card details">
      <h2>${job.title}</h2>
      <p><strong>Category:</strong> ${job.category}</p>
      <p><strong>Location:</strong> ${job.location}</p>
      <p><strong>Type:</strong> ${job.type || "Not specified"}</p>
      <p><strong>Posted by:</strong> ${job.employer || "Anonymous"}</p>
      <p><strong>Description:</strong></p>
      <p>${job.description}</p>
    </div>
  `;
} else {
  jobDetailsSection.innerHTML = `<p>Job not found.</p>`;
  document.getElementById("application-section").style.display = "none";
}

// Handle application submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const applications = JSON.parse(localStorage.getItem("applications")) || [];

  const newApp = {
    jobId,
    jobTitle: job.title,
    name: document.getElementById("applicant-name").value,
    email: document.getElementById("applicant-email").value,
    message: document.getElementById("applicant-message").value,
    date: new Date().toLocaleString(),
  };

  applications.push(newApp);
  localStorage.setItem("applications", JSON.stringify(applications));

  alert("✅ Application submitted successfully!");
  form.reset();
});
