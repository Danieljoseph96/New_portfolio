window.onload = () => {
  const terminal = document.getElementById('terminal');
  const contentDisplay = document.getElementById('card-content');

  const leftCursor = document.getElementById('left-cursor');
  let input = '';
  let commandHistory = [];
  let historyIndex = -1;
  let currentCardIndex = 0;

  // Available commands with descriptions
  const commands = {
    help: 'Show available commands',
    about: 'Show about information',
    home: 'Show home card',
    projects: 'Show projects card',
    certificates: 'Show certificates card', 
    gallery: 'Show gallery card',
    blog: 'Show blog card',
    ls: 'List all available cards',
    clear: 'Clear terminal screen',
    next: 'Show next card',
    prev: 'Show previous card'
  };

  // Card content mapping (HTML strings for dynamic display)
const cardContents = {
  'home': `
    <div class="d-flex flex-column justify-content-center align-items-center h-100">
      <h1 class="text-success border-success">Home</h1>
      <p class="text-light">Welcome to my portfolio</p>
    
    </div>
  `,
  'projects': `
    <div class="d-flex flex-column justify-content-center align-items-center h-100 p-3">
      <h2 class="text-success mb-3">Projects</h2>
      <div class="d-flex flex-column gap-3 w-100">
        <div class="project-card p-3 border border-success rounded">
          <img src="image/project1.jpg" class="img-fluid mb-2" alt="Project One">
          <h3 class="text-success">Project One</h3>
          <p>A web application for managing tasks efficiently.</p>
          <a href="#" class="text-success text-decoration-none">View Project</a>
        </div>
        <div class="project-card p-3 border border-success rounded">
          <img src="image/project2.jpg" class="img-fluid mb-2" alt="Project Two">
          <h3 class="text-success">Project Two</h3>
          <p>A cybersecurity tool for vulnerability assessment.</p>
          <a href="#" class="text-success text-decoration-none">View Project</a>
        </div>
      </div>
    </div>
  `,
  'certificates': `
    <div class="d-flex flex-column justify-content-center align-items-center h-100 p-3">
      <h2 class="text-success mb-3">Certificates</h2>
      <div class="d-flex flex-wrap justify-content-center gap-3">
        <div class="certificate-placeholder border border-success p-4 text-center">
          <img src="image/cert1.jpg" class="img-fluid mb-2" alt="Certificate 1">
          <p class="text-success">Certificate 1</p>
        </div>
        <div class="certificate-placeholder border border-success p-4 text-center">
          <img src="image/cert2.jpg" class="img-fluid mb-2" alt="Certificate 2">
          <p class="text-success">Certificate 2</p>
        </div>
      </div>
    </div>
  `,
  'gallery': `
    <div class="d-flex flex-column justify-content-center align-items-center h-100 p-3">
      <h2 class="text-success mb-3">Gallery</h2>
      <div class="d-flex flex-wrap justify-content-center gap-3">
        <div class="gallery-placeholder border border-success p-4 text-center">
          <img src="image/gallery1.jpg" class="img-fluid mb-2" alt="Gallery Image 1">
          <p class="text-success">Gallery Image 1</p>
        </div>
        <div class="gallery-placeholder border border-success p-4 text-center">
          <img src="image/gallery2.jpg" class="img-fluid mb-2" alt="Gallery Image 2">
          <p class="text-success">Gallery Image 2</p>
        </div>
      </div>
    </div>
  `,
  'blog': `
    <div class="d-flex flex-column justify-content-center align-items-center h-100 p-3">
      <h2 class="text-success mb-3">Blog Posts</h2>
      <div class="d-flex flex-column gap-3 w-100">
        <div class="blog-card p-3 border border-success rounded">
          <img src="image/blog1.jpg" class="img-fluid mb-2" alt="Understanding Web Security">
          <h3 class="text-success">Understanding Web Security</h3>
          <p>An in-depth look at common web vulnerabilities and how to mitigate them.</p>
          <a href="#" class="text-success text-decoration-none">Read More</a>
        </div>
        <div class="blog-card p-3 border border-success rounded">
          <img src="image/blog2.jpg" class="img-fluid mb-2" alt="Getting Started with Penetration Testing">
          <h3 class="text-success">Getting Started with Penetration Testing</h3>
          <p>A beginner's guide to penetration testing methodologies and tools.</p>
          <a href="#" class="text-success text-decoration-none">Read More</a>
        </div>
      </div>
    </div>
  `
};
  // Card order for next/prev
  const cardOrder = ['home', 'projects', 'certificates', 'gallery', 'blog'];

  function executeCommand(cmd) {
    const cleanCmd = cmd.trim().toLowerCase();
    
    // Refresh the display after each command with fade effect
    contentDisplay.classList.remove('fade-in');
    contentDisplay.innerHTML = '';
    setTimeout(() => {
      contentDisplay.classList.add('fade-in');
      switch(cleanCmd) {
        case 'help':
          showHelp();
          break;
          
        case 'about':
          showAbout();
          break;

       case 'tour':
  const x = ['home', 'projects', 'certificates', 'gallery', 'blog'];

  for (let i = 0; i < x.length; i++) {
    setTimeout(() => {
      showCard(x[i]);
    }, i * 2000);
  }

  break;

          
        case 'home':
        case 'projects':
        case 'certificates':
        case 'gallery':
        case 'blog':
          showCard(cleanCmd);
          break;
          
        case 'ls':
          listCards();
          break;
          
        case 'clear':
          clearTerminal();
          break;
          
        case 'next':
          showNextCard();
          break;
          
        case 'prev':
          showPrevCard();
          break;
          
        default:
          contentDisplay.innerHTML = `<div class="text-danger">Command not found: ${cmd}. Type 'help' for available commands.</div>`;
      }
    }, 50);
  }

  function showHelp() {
    let helpText = '<div class="text-success">Available commands:</div>';
    for (const [cmd, desc] of Object.entries(commands)) {
      helpText += `<div class="ms-2">• <span class="text-warning">${cmd}</span> - ${desc}</div>`;
    }
    helpText += `<div class="mt-2 text-info">Use arrow keys (← →) for quick navigation</div>`;
    contentDisplay.innerHTML = helpText;
  }

  function showAbout() {
    const aboutText = `
      <div class="text-success">Daniel Joseph M L</div>
      <div class="ms-2">• Freelance Web Developer</div>
      <div class="ms-2">• Cybersecurity SOC Analyst & Pentester</div>
      <div class="ms-2">• Web Security Specialist</div>
      <div class="mt-2 text-info">Passionate about building secure and efficient web applications.</div>
    `;
    contentDisplay.innerHTML = aboutText;
  }

  function showCard(cardName) {
    if (cardContents[cardName]) {
      contentDisplay.innerHTML = cardContents[cardName];
      currentCardIndex = cardOrder.indexOf(cardName);
    }
  }

  function listCards() {
    let cardList = '<div class="text-success">Available cards:</div>';
    cardOrder.forEach(card => {
      cardList += `<div class="ms-2">• <span class="text-warning">${card}</span></div>`;
    });
    contentDisplay.innerHTML = cardList;
  }

  function clearTerminal() {
    const prompt = terminal.querySelector('div:last-child');
    terminal.innerHTML = '';
    if (prompt) {
      terminal.appendChild(prompt);
    }
    contentDisplay.innerHTML = '<div class="text-success">Terminal cleared</div>';
  }

  function showNextCard() {
    currentCardIndex = (currentCardIndex + 1) % cardOrder.length;
    const nextCard = cardOrder[currentCardIndex];
    showCard(nextCard);
  }

  function showPrevCard() {
    currentCardIndex = (currentCardIndex - 1 + cardOrder.length) % cardOrder.length;
    const prevCard = cardOrder[currentCardIndex];
    showCard(prevCard);
  }

  function updatePrompt() {
    const cursor = document.getElementById('cursor');
    cursor.innerHTML = input + '<span class="cursor-animation">|</span>';
    // Mirror input to left side
    leftCursor.innerHTML = input + '<span class="cursor-animation">|</span>';
  }

  document.addEventListener('keydown', (e) => {
    const cursor = document.getElementById('cursor');
    
    // Handle command history with up/down arrows
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex === -1) {
          historyIndex = commandHistory.length - 1;
        } else if (historyIndex > 0) {
          historyIndex--;
        }
        input = commandHistory[historyIndex] || '';
        updatePrompt();
      }
      return;
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          input = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          input = '';
        }
        updatePrompt();
      }
      return;
    }

    if (e.key === 'Backspace') {
      input = input.slice(0, -1);
      updatePrompt();
    } else if (e.key === 'Enter') {
      // Execute command
      if (input.trim()) {
        terminal.innerHTML += `<div>daniel@local:~$ ${input}</div>`;
        executeCommand(input);
        commandHistory.push(input);
        // Limit history to last 3 commands
        if (commandHistory.length > 3) {
          commandHistory.shift();
        }
        historyIndex = commandHistory.length;
      } 
      
      // Add new prompt with cursor
      terminal.innerHTML += `<div>daniel@local:~$ </div>`;
      const lastPrompt = terminal.lastElementChild;
      lastPrompt.innerHTML += `<span id="cursor"></span>`;
      input = '';
      updatePrompt();
      
      // Scroll to bottom
      terminal.scrollTop = terminal.scrollHeight;
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
      input += e.key;
      updatePrompt();
    }
  });

  // Keyboard navigation for cards
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      showPrevCard();
    } else if (e.key === 'ArrowRight') {
      showNextCard();
    }
  });

  // Initial fade-in on page load and cursor setup
  setTimeout(() => {
    document.getElementById('content-display').classList.add('fade-in');
    updatePrompt(); // Ensure cursor is set initially
  }, 100);
};