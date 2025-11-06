// ===== Existing Code (Keep) =====
const mainbox = document.getElementById("GUI");
const linuxbox = document.getElementById("Terminal");

function toggleMenu() {
  document.getElementById('RoboBox').classList.toggle('show');
}

function toggleTerminal() {
  document.getElementById('linux').classList.toggle('show');
  document.getElementById('normal_themes').classList.toggle('hide');
}



document.addEventListener('DOMContentLoaded', () => {
  loadContent();
  initTerminal(); // <-- Added: Initialize terminal when DOM is ready
});
//----------------------------------------------------------------------

// ===== Content Loader =====
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

// Render Projects with Expandable Modal and Staggered Animation
function renderProjects(projects) {
  const row = document.getElementById('projectRow');
  if (!row) return;
  row.innerHTML = '';

  projects.forEach((project, index) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.style.opacity = '0';
    col.style.transform = 'translateY(20px)';
    col.style.transition = 'all 0.5s ease';
    
    col.innerHTML = `
      <div class="card bg-dark text-light h-100 shadow-sm border border-info overflow-hidden project-card hover-scale">
        <div class="card-image-container position-relative">
          <img 
            src="${project.image?.[0] || 'https://via.placeholder.com/400x200?text=No+Image'}" 
            class="card-img-top img-fluid object-fit-cover"
            alt="${escapeHtml(project.id)}"
            style="height: 200px; object-fit: cover; cursor: pointer; transition: transform 0.3s ease;"
          />
          <div class="image-overlay position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center opacity-0" style="transition: opacity 0.3s ease;">
            <span class="text-info fs-1">👁️</span>
          </div>
        </div>
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title text-info">${escapeHtml(project.name)}</h5>
          <p class="card-text text-secondary flex-grow-1">
            ${escapeHtml(project.content || 'No description available.')}
          </p>
          <div class="mt-auto">
            ${project.link ? `
              <a href="${project.link}" target="_blank" class="btn btn-outline-success btn-sm">
                Live Demo
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    row.appendChild(col);

    // Staggered animation
    setTimeout(() => {
      col.style.opacity = '1';
      col.style.transform = 'translateY(0)';
    }, index * 100);

    // Add hover effects
    const card = col.querySelector('.project-card');
    const img = col.querySelector('img');
    const overlay = col.querySelector('.image-overlay');
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
      img.style.transform = 'scale(1.05)';
      overlay.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      img.style.transform = 'scale(1)';
      overlay.style.opacity = '0';
    });

    // Click on image to open modal
    img.addEventListener('click', () => openProjectModal(index));
  });

  // Store projects globally for modal access
  window.projectsData = projects;
}

// Render Blogs with Expandable Modal and Staggered Animation
function renderBlogs(blogs) {
  const row = document.getElementById('blogRow');
  if (!row) return;
  row.innerHTML = '';

  blogs.forEach((blog, index) => {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4 mb-4';
    col.style.opacity = '0';
    col.style.transform = 'translateY(20px)';
    col.style.transition = 'all 0.5s ease';
    
    col.innerHTML = `
      <div class="card bg-light text-dark h-100 shadow-sm border border-primary overflow-hidden blog-card hover-scale">
        <div class="card-body d-flex flex-column">
          <div class="blog-header mb-3">
            <h5 class="card-title text-primary">${escapeHtml(blog.name)}</h5>
            ${blog.date ? `<small class="text-muted publish-date">Published: ${formatDate(blog.date)}</small>` : ''}
          </div>
          <p class="card-text text-muted flex-grow-1">
            ${escapeHtml(blog.Content || 'No summary available.')}
          </p>
          <div class="mt-auto">
           
            ${blog.link ? `
              <a href="${blog.link}" target="_blank" class="btn btn-outline-success btn-sm">
                Read Full
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;
    row.appendChild(col);

    // Staggered animation
    setTimeout(() => {
      col.style.opacity = '1';
      col.style.transform = 'translateY(0)';
    }, index * 100);

    // Add hover effects
    const card = col.querySelector('.blog-card');
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Store blogs globally for modal access
  window.blogsData = blogs;
}

// Project Modal Function - FIXED CLOSE BUTTONS
function openProjectModal(index) {
  const project = window.projectsData[index];
  if (!project) return;

  // Show loading state on button
  const buttons = document.querySelectorAll(`.expand-btn`);
  buttons.forEach(btn => {
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    if (text && spinner) {
      text.classList.add('d-none');
      spinner.classList.remove('d-none');
    }
  });

  // Remove existing modals
  const existingModals = document.querySelectorAll('.modal-backdrop, #projectModal, #blogModal');
  existingModals.forEach(element => {
    element.remove();
  });

  const modalId = 'projectModal';
  const modalHtml = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true" data-bs-backdrop="static">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-dark text-light border border-info modal-glow">
          <div class="modal-header border-info">
            <h5 class="modal-title text-info" id="${modalId}Label">
              <i class="fas fa-rocket me-2"></i>${escapeHtml(project.id)}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onclick="closeModal('${modalId}')"></button>
          </div>
          <div class="modal-body">
            ${project.image?.[0] ? `
              <div class="text-center mb-4">
                <img 
                  src="${project.image[0]}" 
                  class="img-fluid rounded shadow"
                  alt="${escapeHtml(project.id)}"
                  style="max-height: 300px; width: auto;"
                  onload="this.style.opacity='1'"
                  style="opacity:0; transition: opacity 0.3s ease;"
                />
              </div>
            ` : ''}
            
            <div class="info-section mb-4">
              <h6 class="text-warning section-title">
                <i class="fas fa-info-circle me-2"></i>Description
              </h6>
              <p class="section-content">${escapeHtml((project.content || 'No description available.').slice(0,300))}
</p>
            </div>

            ${project.technologies ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="fas fa-code me-2"></i>Technologies
                </h6>
                <div class="d-flex flex-wrap gap-2">
                  ${project.technologies.map(tech => 
                    `<span class="badge bg-info text-dark tech-badge">${escapeHtml(tech)}</span>`
                  ).join('')}
                </div>
              </div>
            ` : ''}

            ${project.features ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="fas fa-star me-2"></i>Key Features
                </h6>
                <ul class="feature-list">
                  ${project.features.map(feature => 
                    `<li class="feature-item">${escapeHtml(feature)}</li>`
                  ).join('')}
                </ul>
              </div>
            ` : ''}

            ${project.github || project.demo || project.link ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="fas fa-link me-2"></i>Links
                </h6>
                <div class="d-flex gap-2 flex-wrap">
                  ${project.github ? `
                    <a href="${project.github}" target="_blank" class="btn btn-outline-secondary btn-sm">
                      <i class="fab fa-github me-1"></i> GitHub
                    </a>
                  ` : ''}
                  ${project.demo ? `
                    <a href="${project.demo}" target="_blank" class="btn btn-outline-success btn-sm">
                      <i class="fas fa-external-link-alt me-1"></i> Live Demo
                    </a>
                  ` : ''}
                  ${project.link && !project.demo ? `
                    <a href="${project.link}" target="_blank" class="btn btn-outline-success btn-sm">
                      <i class="fas fa-external-link-alt me-1"></i> View Project
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : ''}

            ${project.date ? `
              <div class="text-muted small text-center">
                <i class="fas fa-calendar me-1"></i>Created: ${formatDate(project.date)}
              </div>
            ` : ''}
          </div>
          <div class="modal-footer border-info">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" onclick="closeModal('${modalId}')">
              <i class="fas fa-times me-1"></i>Close
            </button>
            ${project.link ? `
              <a href="${project.link}" target="_blank" class="btn btn-outline-info">
                <i class="fas fa-external-link-alt me-1"></i>Open Project
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Initialize and show modal with delay for animation
  setTimeout(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        keyboard: true,
        backdrop: true
      });
      
      modal.show();

      // Reset button states
      setTimeout(() => {
        const buttons = document.querySelectorAll(`.expand-btn`);
        buttons.forEach(btn => {
          const text = btn.querySelector('.btn-text');
          const spinner = btn.querySelector('.btn-spinner');
          if (text && spinner) {
            text.classList.remove('d-none');
            spinner.classList.add('d-none');
          }
        });
      }, 500);

      // Handle modal hidden event
      modalElement.addEventListener('hidden.bs.modal', function() {
        setTimeout(() => {
          if (document.body.contains(modalElement)) {
            modalElement.remove();
          }
          // Remove backdrop
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
          // Remove modal-open class
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 300);
      });
    }
  }, 100);
}

// Blog Modal Function - FIXED CLOSE BUTTONS
function openBlogModal(index) {
  const blog = window.blogsData[index];
  if (!blog) return;

  // Show loading state on button
  const buttons = document.querySelectorAll(`.expand-btn`);
  buttons.forEach(btn => {
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    if (text && spinner) {
      text.classList.add('d-none');
      spinner.classList.remove('d-none');
    }
  });

  // Remove existing modals
  const existingModals = document.querySelectorAll('.modal-backdrop, #projectModal, #blogModal');
  existingModals.forEach(element => {
    element.remove();
  });

  const modalId = 'blogModal';
  
  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Initialize and show modal with delay for animation
  setTimeout(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        keyboard: true,
        backdrop: true
      });
      
      modal.show();

      

      // Handle modal hidden event
      modalElement.addEventListener('hidden.bs.modal', function() {
        setTimeout(() => {
          if (document.body.contains(modalElement)) {
            modalElement.remove();
          }
          // Remove backdrop
          const backdrops = document.querySelectorAll('.modal-backdrop');
          backdrops.forEach(backdrop => backdrop.remove());
          // Remove modal-open class
          document.body.classList.remove('modal-open');
          document.body.style.overflow = '';
          document.body.style.paddingRight = '';
        }, 300);
      });
    }
  }, 100);
}

// Close Modal Function
function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  console.log("Erro")
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    }
  }
}

// Date formatting helper
function formatDate(dateString) {
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (error) {
    return dateString;
  }
}

// HTML escape helper
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Make functions globally available
window.openProjectModal = openProjectModal;
window.openBlogModal = openBlogModal;
window.closeModal = closeModal;
window.formatDate = formatDate;
window.escapeHtml = escapeHtml;
///--------------------------------------------------------------------+

//----------------------------------------------------------------------

// HTML escape helper
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// ===== NEW: Terminal Command System =====
function initTerminal() {
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  if (!input || !output) return; // if no terminal present, skip

  const commands = {
    help: `
      <div>Available commands:</div>
      <ul>
        <li><b>help</b> - Show available commands</li>
        <li><b>about</b> - About me</li>
        <li><b>blog</b> - Open my blog</li>
        <li><b>list projects</b> - List all projects</li>
        <li><b>list blogs</b> - List blog articles</li>
        <li><b>clear</b> - Clear terminal</li>
      </ul>
    `,
    about: `Hi 👋, I'm <b>Daniel Joseph M L</b> — a web developer passionate about creating interactive experiences.`,
    blog: `Opening blog... <a href="https://yourbloglink.com" target="_blank">Click here</a>`,
  };

  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const cmd = input.value.trim().toLowerCase();
      if (cmd) {
        await processCommand(cmd);
      }
      input.value = "";
    }
  });

  async function processCommand(cmd) {
    // clear previous output before new response
    output.innerHTML = "";
    const commandLine = `<div><span class="text-info">daniel@localhost:~$</span> ${cmd}</div>`;
    output.innerHTML += commandLine;

    if (cmd === "clear") {
      output.innerHTML = "";
      return;
    }

    // Handle list commands
    if (cmd === "list projects") {
      await listProjects();
      return;
    }
    if (cmd === "list blogs") {
      await listBlogs();
      return;
    }

    // Default response
    const response = commands[cmd] || `<div>Command not found: <b>${cmd}</b>. Type <b>help</b>.</div>`;
    output.innerHTML += `<div>${response}</div>`;
    output.scrollTop = output.scrollHeight;
  }

  // Load and show projects
  async function listProjects() {
    try {
      const res = await fetch("js/projects.json", { cache: "no-store" });
      const data = await res.json();
      let html = "<div class='fw-bold text-info mb-2'>Project List:</div><ul>";
      data.forEach(p => {
        html += `<li><b>${escapeHtml(p.id)}</b> — ${escapeHtml(p.description || 'No description')}</li>`;
      });
      html += "</ul>";
      output.innerHTML += html;
    } catch (err) {
      output.innerHTML += `<div class="text-danger">Error loading projects.json</div>`;
    }
  }

  // Load and show blogs
  async function listBlogs() {
    try {
      const res = await fetch("js/blog.json", { cache: "no-store" });
      const data = await res.json();
      let html = "<div class='fw-bold text-info mb-2'>Blog Articles:</div><ul>";
      data.forEach(b => {
        html += `<li><a href="${b.link}" target="_blank">${escapeHtml(b.title)}</a></li>`;
      });
      html += "</ul>";
      output.innerHTML += html;
    } catch (err) {
      output.innerHTML += `<div class="text-danger">Error loading blog.json</div>`;
    }
  }
}



document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");
  const infoPanel = document.getElementById("info-panel");

  const commands = {
    help: `
      <div>Available commands:</div>
      <ul>
        <li><b>help</b> - Show available commands</li>
        <li><b>about</b> - Show about section</li>
        <li><b>projects</b> - List projects</li>
        <li><b>blog</b> - Show recent blogs</li>
        <li><b>clear</b> - Clear terminal</li>
      </ul>
    `,
    about: `👨‍💻 Daniel Joseph M L — a creative web developer who builds responsive interfaces and interactive web tools.`,
    blog: `Check my latest articles: <a href="https://yourbloglink.com" target="_blank">yourbloglink.com</a>`,
  };

  input.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      const cmd = input.value.trim().toLowerCase();
      if (cmd) await runCommand(cmd);
      input.value = "";
    }
  });

  async function runCommand(cmd) {
    // Print user input line
    output.innerHTML += `<div><span class="text-info">daniel@localhost:~$</span> ${cmd}</div>`;
    output.scrollTop = output.scrollHeight;

    // Clear command
    if (cmd === "clear") {
      output.innerHTML = "";
      infoPanel.innerHTML = `<p class="text-muted">Awaiting command...</p>`;
      return;
    }

    // Handle built-in commands
    if (commands[cmd]) {
      const response = commands[cmd];
      output.innerHTML += `<div>${response}</div>`;
      updateInfoPanel(cmd, response);
    } else if (cmd === "projects") {
      const res = await fetch("js/projects.json");
      const data = await res.json();
      const projectList = data.map(p => `<li>${p.id} — ${p.description}</li>`).join("");
      const html = `<ul>${projectList}</ul>`;
      output.innerHTML += html;
      updateInfoPanel("projects", html);
    } else {
      const notFound = `<div>Command not found: <b>${cmd}</b></div>`;
      output.innerHTML += notFound;
      updateInfoPanel("error", notFound);
    }

    output.scrollTop = output.scrollHeight;
  }

  function updateInfoPanel(type, content) {
    infoPanel.classList.add("active");
    infoPanel.innerHTML = `<div>${content}</div>`;
    setTimeout(() => infoPanel.classList.remove("active"), 1500);
  }
});
