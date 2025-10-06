// assets/js/main.js
const el = id => document.getElementById(id);
const qInput = el('q');
const locInput = el('location');
const typeSelect = el('type');
const btn = el('searchBtn');
const results = el('results');

function renderJobs(jobs){
  results.innerHTML = '';
  if(!jobs.length){
    results.innerHTML = '<p class="muted">No jobs found.</p>';
    return;
  }
  for(const j of jobs){
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(j.title)}</h3>
      <div class="meta">${escapeHtml(j.company)} · ${escapeHtml(j.location || '—')} · ${escapeHtml(j.type || '')}</div>
      <div class="desc">${escapeHtml(j.description || '')}</div>
      <div class="footer-small">Posted: ${escapeHtml(j.posted_at || '')}</div>
    `;
    results.appendChild(card);
  }
}

function escapeHtml(s){
  if(!s) return '';
  return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
}

async function fetchJobs(){
  const params = new URLSearchParams();
  if(qInput.value.trim()) params.set('q', qInput.value.trim());
  if(locInput.value.trim()) params.set('location', locInput.value.trim());
  if(typeSelect.value) params.set('type', typeSelect.value);

  try{
    const res = await fetch('/api.php?'+params.toString());
    const data = await res.json();
    if(data.ok) renderJobs(data.jobs);
    else results.innerHTML = '<p class="muted">Error: ' + (data.error || 'unknown') + '</p>';
  }catch(e){
    results.innerHTML = '<p class="muted">Network error</p>';
  }
}

let timer = null;
qInput.addEventListener('input', ()=>{
  clearTimeout(timer);
  timer = setTimeout(fetchJobs, 300);
});
btn.addEventListener('click', fetchJobs);

// initial load
fetchJobs();
