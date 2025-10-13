// admin.js

// Load jobs from localStorage
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// Assign status if not present
jobs = jobs.map(job => ({ ...job, status: job.status || "pending" }));
localStorage.setItem("jobs", JSON.stringify(jobs));

// Display jobs
function loadAdminJobs() {
  const pendingContainer = document.getElementById("pending-jobs");
  const approvedContainer = document.getElementById("approved-jobs");
  
  pendingContainer.innerHTML = "";
  approvedContainer.innerHTML = "";

  jobs.forEach((job, index) => {
    const jobCard = document.createElement("div");
    jobCard.classList.add("job-card");
    jobCard.innerHTML = `
      <h3>${job.title}</h3>
      <p>${job.category} | ${job.location}</p>
      <p>${job.description}</p>
      <p>Status: <strong>${job.status}</strong></p>
    `;

    // Add moderation buttons
    if (job.status === "pending") {
      const approveBtn = document.createElement("button");
      approveBtn.textContent = "Approve";
      approveBtn.onclick = () => approveJob(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteJob(index);

      jobCard.appendChild(approveBtn);
      jobCard.appendChild(deleteBtn);
      pendingContainer.appendChild(jobCard);
    } else {
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.onclick = () => deleteJob(index);

      jobCard.appendChild(deleteBtn);
      approvedContainer.appendChild(jobCard);
    }
  });
}

// Approve job
function approveJob(index) {
  jobs[index].status = "approved";
  localStorage.setItem("jobs", JSON.stringify(jobs));
  loadAdminJobs();
  mockEmailAlert(jobs[index]);
  alert(`"${jobs[index].title}" has been approved!`);
}

// Delete job
function deleteJob(index) {
  if (confirm("Are you sure you want to delete this job?")) {
    const deletedJob = jobs.splice(index, 1)[0];
    localStorage.setItem("jobs", JSON.stringify(jobs));
    loadAdminJobs();
    alert(`"${deletedJob.title}" was deleted.`);
  }
}

// Mock email alert
function mockEmailAlert(job) {
  console.log(`
  📨 Mock Email Sent
  -------------------------
  To: employer@example.com
  Subject: Job "${job.title}" Approved!
  Message: Congratulations! Your job post has been approved and is now live.
  `);
}

$.get("/api/jobs", function (data) {
  jobs = data;
  loadAdminJobs(); // Reuse your existing display logic
});
