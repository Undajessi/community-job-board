// assets/js/main.js
const el = id => document.getElementById(id);
const qInput = el('q');
const locInput = el('location');
const typeSelect = el('type');
const perPageSelect = el('per_page');
const btn = el('searchBtn');
const results = el('results');
const prevBtn = el('prevPage');
const nextBtn = el('nextPage');
const pageInfo = el('pageInfo');

let currentPage = 1;
let totalResults = 0;

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
  params.set('page', String(currentPage));
  params.set('per_page', perPageSelect.value || '10');

  try{
    const res = await fetch('/api.php?'+params.toString());
    const data = await res.json();
    if(data.ok) {
      renderJobs(data.jobs);
      totalResults = data.meta?.total || 0;
      updatePagination(data.meta);
    }
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
btn.addEventListener('click', ()=>{ currentPage = 1; fetchJobs(); });
prevBtn.addEventListener('click', ()=>{ if(currentPage>1){ currentPage--; fetchJobs(); }});
nextBtn.addEventListener('click', ()=>{ currentPage++; fetchJobs(); });
perPageSelect.addEventListener('change', ()=>{ currentPage = 1; fetchJobs(); });

function updatePagination(meta){
  const page = meta?.page || currentPage;
  const per = meta?.per_page || parseInt(perPageSelect.value||10,10);
  const total = meta?.total || totalResults;
  const pages = Math.max(1, Math.ceil(total / per));
  currentPage = page;
  pageInfo.textContent = `Page ${page} of ${pages} (${total} results)`;
  prevBtn.disabled = page <= 1;
  nextBtn.disabled = page >= pages;
}

// initial load
fetchJobs();
