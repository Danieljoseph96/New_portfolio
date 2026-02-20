document.addEventListener('DOMContentLoaded', () => {
  loadContent();
  initTerminal();
});

// ===== Content Loader =====
async function loadContent() {
  try {
    const profileData = await fetchJSON('js/my_profile.json');
    
    // Update page content with profile data
    updatePersonalInfo(profileData.resume.personal);
    updateSummary(profileData.resume.summary);
    renderSkills(profileData.resume.skills);
    renderExperience(profileData.resume.experience);
    renderEducation(profileData.resume.education);
    renderCertifications(profileData.resume.certifications);
    renderProjects(profileData.resume.projects);
    renderBlogs(profileData.resume.blog);
    
  } catch (err) {
    console.error('Failed to load content:', err);
    showErrorMessages();
  }
}

// Generic fetch helper
async function fetchJSON(url) {
  const resp = await fetch(url, { cache: 'no-store' });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${url}`);
  return resp.json();
}

// ===== Content Renderers =====

// Update personal information
function updatePersonalInfo(personal) {
  // Update name in home section
  const heading = document.getElementById('heading');
  if (heading) {
    heading.textContent = `${personal.name.first.toUpperCase()} ${personal.name.middle.toUpperCase()} ${personal.name.last.toUpperCase()}`;
  }
  
  // Update title
  const titleElement = document.querySelector('#home .lead');
  if (titleElement) {
    titleElement.textContent = personal.title;
  }
  
  // Update contact info if contact section exists
  updateContactInfo(personal.contact);
}

function updateContactInfo(contact) {

 // console.log('Contact info:', contact);
  
}

function updateSummary(summary) {
  const aboutSection = document.querySelector('#about p');
  if (aboutSection) {
    aboutSection.textContent = summary;
  }
}

// Render Skills
function renderSkills(skills) {
  const skillsContainer = document.querySelector('#skills .row');
  if (!skillsContainer) return;
  
  // Clear existing content
  skillsContainer.innerHTML = '';
  
  // Programming Skills
  if (skills.programming && skills.programming.length > 0) {
    skillsContainer.appendChild(createSkillCard('Programming', skills.programming, 'code'));
  }
  
  // Frontend Skills
  if (skills.frontend) {
    const frontendSkills = [
      ...(skills.frontend.languages || []),
      ...(skills.frontend.frameworks || []),
      ...(skills.frontend.styling || [])
    ];
    if (frontendSkills.length > 0) {
      skillsContainer.appendChild(createSkillCard('Frontend', frontendSkills, 'layout-wtf'));
    }
  }
  
  // Backend Skills
  if (skills.backend) {
    const backendSkills = [
      ...(skills.backend.frameworks || []),
      ...(skills.backend.concepts || [])
    ];
    if (backendSkills.length > 0) {
      skillsContainer.appendChild(createSkillCard('Backend', backendSkills, 'server'));
    }
  }
  
  // Database Skills
  if (skills.databases) {
    const dbSkills = [
      ...(skills.databases.relational || []),
      ...(skills.databases.cloud || [])
    ];
    if (dbSkills.length > 0) {
      skillsContainer.appendChild(createSkillCard('Databases', dbSkills, 'database'));
    }
  }
  
  // Cybersecurity Skills
  if (skills.cybersecurity) {
    const cyberSkills = [
      ...(skills.cybersecurity.tools || []),
      ...(skills.cybersecurity.certifications || []),
      ...(skills.cybersecurity.platforms || [])
    ];
    if (cyberSkills.length > 0) {
      skillsContainer.appendChild(createSkillCard('Cybersecurity', cyberSkills, 'shield-lock'));
    }
  }
  
  // DevOps Skills
  if (skills.devops) {
    const devopsSkills = [
      ...(skills.devops.tools || []),
      ...(skills.devops.deployment || [])
    ];
    if (devopsSkills.length > 0) {
      skillsContainer.appendChild(createSkillCard('DevOps', devopsSkills, 'gear'));
    }
  }
}

function createSkillCard(title, skills, icon) {
  const col = document.createElement('div');
  col.className = 'col-md-6 col-lg-4';
  
  col.innerHTML = `
    <div class="card bg-secondary border-0 h-100">
      <div class="card-body">
        <h3 class="h5 card-title text-info">
          <i class="bi bi-${icon} me-2"></i>${title}
        </h3>
        <div class="d-flex flex-wrap gap-2 mt-3">
          ${skills.map(skill => `<span class="badge bg-dark">${escapeHtml(skill)}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
  
  return col;
}

// Render Experience
function renderExperience(experience) {
  const timeline = document.querySelector('.timeline');
  if (!timeline) return;
  
  timeline.innerHTML = '';
  
  experience.forEach(exp => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    timelineItem.innerHTML = `
      <div class="timeline-date">${exp.period.start} – ${exp.period.end}</div>
      <div class="timeline-content">
        <h3 class="h5">${escapeHtml(exp.role)}</h3>
        <p class="text-muted">${escapeHtml(exp.company)}</p>
        <ul>
          ${exp.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
        </ul>
        ${exp.technologies && exp.technologies.length > 0 ? `
          <div class="mt-3">
            <strong>Technologies:</strong>
            <div class="d-flex flex-wrap gap-1 mt-1">
              ${exp.technologies.map(tech => `<span class="badge bg-info text-dark">${escapeHtml(tech)}</span>`).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;
    
    timeline.appendChild(timelineItem);
  });
}

// Render Education
function renderEducation(education) {
  const educationContainer = document.querySelector('#about .education-list');
  if (!educationContainer) return;
  
  educationContainer.innerHTML = '';
  
  education.forEach(edu => {
    const eduItem = document.createElement('li');
    eduItem.className = 'mb-2';
    
    eduItem.innerHTML = `
      <strong>${escapeHtml(edu.degree)}</strong><br>
      ${escapeHtml(edu.institution)} • ${edu.year}
      ${edu.status === 'ongoing' ? '<span class="badge bg-warning text-dark ms-2">Ongoing</span>' : ''}
    `;
    
    educationContainer.appendChild(eduItem);
  });
}

// Render Certifications
function renderCertifications(certifications) {
  const certContainer = document.querySelector('#about .certifications-list');
  if (!certContainer) return;
  
  certContainer.innerHTML = '';
  
  certifications.forEach(cert => {
    const certItem = document.createElement('li');
    certItem.className = 'mb-2';
    
    certItem.innerHTML = `
      ${escapeHtml(cert.name)} – ${escapeHtml(cert.issuer)}
      ${cert.year ? ` • ${cert.year}` : ''}
    `;
    
    certContainer.appendChild(certItem);
  });
}

// Render Projects (Updated for new JSON structure)
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
        <div class="card-body text-center d-flex flex-column">
          <h5 class="card-title text-info">${escapeHtml(project.name)}</h5>
          <p class="card-text text-secondary flex-grow-1">
            ${escapeHtml(project.description || 'No description available.')}
          </p>
          <div class="mt-3">
            <div class="d-flex flex-wrap gap-1 justify-content-center mb-2">
              ${project.technologies.map(tech => `<span class="badge bg-info text-dark">${escapeHtml(tech)}</span>`).join('')}
            </div>
          </div>
          <div class="mt-auto">
            <button onclick="openProjectModal(${index})" class="btn btn-outline-info btn-sm me-2">
              View Details
            </button>
            ${project.demo || project.repository ? `
              <div class="mt-2">
                ${project.demo ? `
                  <a href="${project.demo}" target="_blank" class="btn btn-outline-success btn-sm me-1">
                    Live Demo
                  </a>
                ` : ''}
                ${project.repository ? `
                  <a href="${project.repository}" target="_blank" class="btn btn-outline-secondary btn-sm">
                    Code
                  </a>
                ` : ''}
              </div>
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
    
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
    });
  });

  // Store projects globally for modal access
  window.projectsData = projects;
}

// Render Blogs (Updated for new JSON structure)
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
            <h5 class="card-title text-primary">${escapeHtml(blog.title)}</h5>
            ${blog.published ? `<small class="text-muted publish-date">Published: ${formatDate(blog.published)}</small>` : ''}
          </div>
          <p class="card-text text-muted flex-grow-1">
            ${escapeHtml(blog.description || 'No summary available.')}
          </p>
          <div class="mt-3">
            <div class="d-flex flex-wrap gap-1 mb-2">
              ${blog.tags.map(tag => `<span class="badge bg-primary">${escapeHtml(tag)}</span>`).join('')}
            </div>
          </div>
          <div class="mt-auto">
            <button onclick="openBlogModal(${index})" class="btn btn-outline-primary btn-sm me-2">
              Read More
            </button>
            ${blog.url ? `
              <a href="${blog.url}" target="_blank" class="btn btn-outline-success btn-sm">
                Visit Blog
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

// ===== Modal Functions =====

// Project Modal Function (Updated for new JSON structure)
function openProjectModal(index) {
  const project = window.projectsData[index];
  if (!project) return;

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
              <i class="bi bi-rocket-takeoff me-2"></i>${escapeHtml(project.name)}
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close" onclick="closeModal('${modalId}')"></button>
          </div>
          <div class="modal-body">
            <div class="info-section mb-4">
              <h6 class="text-warning section-title">
                <i class="bi bi-info-circle me-2"></i>Description
              </h6>
              <p class="section-content">${escapeHtml(project.description || 'No description available.')}</p>
            </div>

            ${project.technologies && project.technologies.length > 0 ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="bi bi-code me-2"></i>Technologies
                </h6>
                <div class="d-flex flex-wrap gap-2">
                  ${project.technologies.map(tech => 
                    `<span class="badge bg-info text-dark tech-badge">${escapeHtml(tech)}</span>`
                  ).join('')}
                </div>
              </div>
            ` : ''}

            ${project.features && project.features.length > 0 ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="bi bi-stars me-2"></i>Key Features
                </h6>
                <ul class="feature-list">
                  ${project.features.map(feature => 
                    `<li class="feature-item">${escapeHtml(feature)}</li>`
                  ).join('')}
                </ul>
              </div>
            ` : ''}

            ${project.highlights && project.highlights.length > 0 ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="bi bi-lightning me-2"></i>Highlights
                </h6>
                <ul class="feature-list">
                  ${project.highlights.map(highlight => 
                    `<li class="feature-item">${escapeHtml(highlight)}</li>`
                  ).join('')}
                </ul>
              </div>
            ` : ''}

            ${project.repository || project.demo ? `
              <div class="info-section mb-4">
                <h6 class="text-warning section-title">
                  <i class="bi bi-link me-2"></i>Links
                </h6>
                <div class="d-flex gap-2 flex-wrap">
                  ${project.repository ? `
                    <a href="${project.repository}" target="_blank" class="btn btn-outline-secondary btn-sm">
                      <i class="bi bi-github me-1"></i> GitHub
                    </a>
                  ` : ''}
                  ${project.demo ? `
                    <a href="${project.demo}" target="_blank" class="btn btn-outline-success btn-sm">
                      <i class="bi bi-box-arrow-up-right me-1"></i> Live Demo
                    </a>
                  ` : ''}
                </div>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer border-info">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" onclick="closeModal('${modalId}')">
              <i class="bi bi-x me-1"></i>Close
            </button>
            ${project.demo ? `
              <a href="${project.demo}" target="_blank" class="btn btn-outline-info">
                <i class="bi bi-box-arrow-up-right me-1"></i>Open Project
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Initialize and show modal
  setTimeout(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Handle modal hidden event
      modalElement.addEventListener('hidden.bs.modal', function() {
        setTimeout(() => {
          if (document.body.contains(modalElement)) {
            modalElement.remove();
          }
          cleanupModal();
        }, 300);
      });
    }
  }, 100);
}

// Blog Modal Function (Updated for new JSON structure)
function openBlogModal(index) {
  const blog = window.blogsData[index];
  if (!blog) return;

  // Remove existing modals
  const existingModals = document.querySelectorAll('.modal-backdrop, #projectModal, #blogModal');
  existingModals.forEach(element => {
    element.remove();
  });

  const modalId = 'blogModal';
  const modalHtml = `
    <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}Label" aria-hidden="true">
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content bg-light text-dark border border-primary">
          <div class="modal-header border-primary">
            <h5 class="modal-title text-primary" id="${modalId}Label">
              <i class="bi bi-journal-text me-2"></i>${escapeHtml(blog.title)}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onclick="closeModal('${modalId}')"></button>
          </div>
          <div class="modal-body">
            ${blog.published ? `
              <div class="text-muted mb-3">
                <i class="bi bi-calendar me-1"></i>Published: ${formatDate(blog.published)}
              </div>
            ` : ''}
            
            <div class="info-section mb-4">
              <h6 class="text-primary section-title">
                <i class="bi bi-card-text me-2"></i>Description
              </h6>
              <p class="section-content">${escapeHtml(blog.description)}</p>
            </div>

            <div class="info-section mb-4">
              <h6 class="text-primary section-title">
                <i class="bi bi-file-text me-2"></i>Content
              </h6>
              <p class="section-content">${escapeHtml(blog.content)}</p>
            </div>

            ${blog.tags && blog.tags.length > 0 ? `
              <div class="info-section mb-4">
                <h6 class="text-primary section-title">
                  <i class="bi bi-tags me-2"></i>Tags
                </h6>
                <div class="d-flex flex-wrap gap-2">
                  ${blog.tags.map(tag => `<span class="badge bg-primary">${escapeHtml(tag)}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer border-primary">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" onclick="closeModal('${modalId}')">
              <i class="bi bi-x me-1"></i>Close
            </button>
            ${blog.url ? `
              <a href="${blog.url}" target="_blank" class="btn btn-primary">
                <i class="bi bi-box-arrow-up-right me-1"></i>Read Full Article
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    </div>
  `;

  // Add modal to body
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Initialize and show modal
  setTimeout(() => {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();

      // Handle modal hidden event
      modalElement.addEventListener('hidden.bs.modal', function() {
        setTimeout(() => {
          if (document.body.contains(modalElement)) {
            modalElement.remove();
          }
          cleanupModal();
        }, 300);
      });
    }
  }, 100);
}

// Close Modal Function
function closeModal(modalId) {
  const modalElement = document.getElementById(modalId);
  if (modalElement) {
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();
    } else {
      modalElement.remove();
      cleanupModal();
    }
  }
}

function cleanupModal() {
  // Remove backdrop
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach(backdrop => backdrop.remove());
  // Remove modal-open class
  document.body.classList.remove('modal-open');
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
}

// ===== Utility Functions =====

// Date formatting helper
function formatDate(dateString) {
  try {
    if (!dateString) return 'Not specified';
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

// Error handling
function showErrorMessages() {
  const projectRow = document.getElementById('projectRow');
  const blogRow = document.getElementById('blogRow');
  
  if (projectRow) {
    projectRow.innerHTML = '<div class="col-12 text-center text-danger">Could not load Projects</div>';
  }
  if (blogRow) {
    blogRow.innerHTML = '<div class="col-12 text-center text-danger">Could not load Blogs</div>';
  }
}

// Make functions globally available
window.openProjectModal = openProjectModal;
window.openBlogModal = openBlogModal;
window.closeModal = closeModal;
window.formatDate = formatDate;
window.escapeHtml = escapeHtml;

// ===== Terminal System =====
function initTerminal() {
  const input = document.getElementById("terminal-input");
  const output = document.getElementById("terminal-output");

  if (!input || !output) return;

  const commands = {
    help: `
      <div>Available commands:</div>
      <ul>
        <li><b>help</b> - Show available commands</li>
        <li><b>about</b> - About me</li>
        <li><b>skills</b> - Show technical skills</li>
        <li><b>experience</b> - Show work experience</li>
        <li><b>projects</b> - List projects</li>
        <li><b>blog</b> - Show recent blogs</li>
        <li><b>contact</b> - Contact information</li>
        <li><b>clear</b> - Clear terminal</li>
      </ul>
    `,
    about: `👨‍💻 <b>Daniel Joseph M L</b> — Full Stack Developer & Cybersecurity Specialist with 5+ years of IT experience. CEH-certified and passionate about building secure web applications.`,
    skills: `💻 <b>Technical Skills:</b> Python, JavaScript, Django, React, Cybersecurity tools, and more. Type 'help' for detailed categories.`,
    experience: `💼 <b>Experience:</b> Technical Assistant at Election Commission of India, Computer Technician, and IT Apprentice with diverse technical expertise.`,
    contact: `📧 <b>Contact:</b> mldaniel020@gmail.com | +91-8078036982 | GitHub: Danieljoseph96`
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
    const commandLine = `<div><span class="text-info">daniel@localhost:~$</span> ${cmd}</div>`;
    output.innerHTML += commandLine;

    if (cmd === "clear") {
      output.innerHTML = "";
      return;
    }

    // Handle commands that need data from JSON
    if (cmd === "projects") {
      await listProjects();
      return;
    }
    if (cmd === "blog") {
      await listBlogs();
      return;
    }

    // Default response
    const response = commands[cmd] || `<div>Command not found: <b>${cmd}</b>. Type <b>help</b> for available commands.</div>`;
    output.innerHTML += `<div>${response}</div>`;
    output.scrollTop = output.scrollHeight;
  }

  // Load and show projects from JSON
  async function listProjects() {
    try {
      const profileData = await fetchJSON('js/my_profile.json');
      const projects = profileData.resume.projects;
      
      let html = "<div class='fw-bold text-info mb-2'>📁 Project List:</div><ul>";
      projects.forEach(p => {
        html += `<li><b>${escapeHtml(p.name)}</b> — ${escapeHtml(p.description)}</li>`;
      });
      html += "</ul>";
      output.innerHTML += html;
    } catch (err) {
      output.innerHTML += `<div class="text-danger">Error loading projects</div>`;
    }
  }

  // Load and show blogs from JSON
  async function listBlogs() {
    try {
      const profileData = await fetchJSON('js/my_profile.json');
      const blogs = profileData.resume.blog;
      
      let html = "<div class='fw-bold text-info mb-2'>📝 Blog Articles:</div><ul>";
      blogs.forEach(b => {
        html += `<li><a href="${b.url}" target="_blank" class="text-info">${escapeHtml(b.title)}</a> — ${escapeHtml(b.description)}</li>`;
      });
      html += "</ul>";
      output.innerHTML += html;
    } catch (err) {
      output.innerHTML += `<div class="text-danger">Error loading blogs</div>`;
    }
  }
}


///loading animation to customise 
