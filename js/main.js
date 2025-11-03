
const mainbox = document.getElementById("GUI");
  const linuxbox = document.getElementById("Terminal");

 function toggleMenu() {
      document.getElementById('RoboBox').classList.toggle('show');
     
    }

    function toggleTerminal() {
      document.getElementById('linux').classList.toggle('show');
      document.getElementById('normal_themes').classList.toggle('hide');
    }

    function toggleTheme() {
      document.body.classList.toggle('bg-dark');
      document.body.classList.toggle('bg-light');
      document.body.classList.toggle('text-dark');
      document.body.classList.toggle('text-light');
    }

   document.addEventListener('DOMContentLoaded', loadContent);

async function loadContent() {
  try {
    const [projects, blogs] = await Promise.all([
      fetchJSON('js/projects.json'),
      fetchJSON('js/blog.json')
    ]);

    renderProjects(projects);
    renderBlogs(blogs);
  } catch (err) {
    console.error('Failed to load content:', err);
    document.getElementById('projectRow').innerHTML =
      '<div class="col-12 text-center text-danger">Could not load Projects</div>';
    document.getElementById('blogRow').innerHTML =
      '<div class="col-12 text-center text-danger">Could not load Blogs</div>';
  }
}

// Generic fetch helper
async function fetchJSON(url) {
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.json();
}

// Render Projects
function renderProjects(projects) {
  const row = document.getElementById('projectRow');
  row.innerHTML = '';

  projects.forEach(project => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card bg-dark text-light h-100 shadow-sm border border-info overflow-hidden">
        <img 
          src="${project.image?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}" 
          class="card-img-top img-fluid object-fit-cover"
          alt="${escapeHtml(project.id)}"
          style="height: 200px; object-fit: cover;"
        />
        <div class="card-body text-center">
          <h5 class="card-title text-info">${escapeHtml(project.id)}</h5>
          <p class="card-text text-secondary">
            ${escapeHtml(project.description || 'No description available.')}
          </p>
          <a href="${project.link || '#'}" target="_blank" class="btn btn-outline-info btn-sm">View</a>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
}

// Render Blogs
function renderBlogs(blogs) {
  const row = document.getElementById('blogRow');
  row.innerHTML = '';

  blogs.forEach(blog => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.innerHTML = `
      <div class="card bg-light text-dark h-100 shadow-sm border border-primary overflow-hidden">
        <div class="card-body">
          <h5 class="card-title text-primary">${escapeHtml(blog.title)}</h5>
          <p class="card-text">${escapeHtml(blog.summary || 'No summary available.')}</p>
          <a href="${blog.link || '#'}" target="_blank" class="btn btn-outline-primary btn-sm">Read More</a>
        </div>
      </div>
    `;
    row.appendChild(col);
  });
}

// HTML escape helper
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
