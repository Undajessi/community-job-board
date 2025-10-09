const jobs = [
  { title: "Web Developer", category: "IT", location: "Windhoek" },
  { title: "Teacher", category: "Education", location: "Katutura" },
  { title: "Shop Assistant", category: "Retail", location: "Swakopmund" }
];

function displayJobs(list) {
  const container = document.getElementById("job-list");
  container.innerHTML = "";
  list.forEach(job => {
    const div = document.createElement("div");
    div.classList.add("job-card");
    div.innerHTML = `<h3>${job.title}</h3><p>${job.category} - ${job.location}</p>`;
    container.appendChild(div);
  });
}

document.getElementById("search-btn").addEventListener("click", () => {
  const keyword = document.getElementById("keyword").value.toLowerCase();
  const category = document.getElementById("category").value;
  const filtered = jobs.filter(j => 
    j.title.toLowerCase().includes(keyword) && 
    (category === "" || j.category === category)
  );
  displayJobs(filtered);
});

displayJobs(jobs);
