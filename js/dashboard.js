// dashboard.js

const jobForm = document.getElementById("postJobForm");
const jobContainer = document.getElementById("job-container");

// Load jobs from localStorage
function loadJobs() {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  displayJobs(jobs);
}

function displayJobs(jobs) {
  if (!jobContainer) return;
  jobContainer.innerHTML = "";

  if (jobs.length === 0) {
    jobContainer.innerHTML = "<p>No jobs posted yet.</p>";
    return;
  }

  jobs.forEach((job, index) => {
    const card = document.createElement("div");
    card.classList.add("job-card");
    card.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.category} | ${job.location}</p>
      <p>${job.description}</p>
      <button onclick="editJob(${index})">Edit</button>
      <button onclick="deleteJob(${index})">Delete</button>
    `;
    jobContainer.appendChild(card);
  });
}

// Post new job
if (jobForm) {
  jobForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const category = document.getElementById("category").value;
    const description = document.getElementById("description").value;

    const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.push({ title, location, category, description });
    localStorage.setItem("jobs", JSON.stringify(jobs));

    alert("Job posted successfully!");
    jobForm.reset();
    loadJobs();
  });
}

// Delete job
function deleteJob(index) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  jobs.splice(index, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  loadJobs();
}

// Edit job (simplified)
function editJob(index) {
  const jobs = JSON.parse(localStorage.getItem("jobs")) || [];
  const job = jobs[index];

    document.getElementById("title").value = job.title;
    document.getElementById("location").value = job.location;
    document.getElementById("category").value = job.category;
    document.getElementById("description").value = job.description;

    jobs.splice(index, 1);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    loadJobs();
}

window.onload = loadJobs;
