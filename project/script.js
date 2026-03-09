// DOM Elements
const ideaInput = document.getElementById('ideaInput');
const authorSelect = document.getElementById('authorSelect');
const postBtn = document.getElementById('postBtn');
const ideaBoard = document.getElementById('ideaBoard');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');

// State management
let ideas = [];

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('.icon');
    icon.textContent = theme === 'light' ? '🌙' : '☀️';
}

// Data Initialization
function init() {
    initTheme();
    const savedIdeas = localStorage.getItem('groupIdeas');
    if (savedIdeas) {
        ideas = JSON.parse(savedIdeas);
    }
    renderIdeas();
}

// Save ideas to localStorage
function saveToStorage() {
    localStorage.setItem('groupIdeas', JSON.stringify(ideas));
}

// Function to render the board
function renderIdeas() {
    ideaBoard.innerHTML = '';
    
    if (ideas.length === 0) {
        emptyState.classList.remove('hidden');
    } else {
        emptyState.classList.add('hidden');
        
        // Render ideas in reverse chronological order (newest first)
        const sortedIdeas = [...ideas].sort((a, b) => b.id - a.id);
        
        sortedIdeas.forEach(idea => {
            const ideaCard = createIdeaCard(idea);
            ideaBoard.appendChild(ideaCard);
            
            // Check for overflow after adding to the DOM to show/hide "Read more"
            const content = ideaCard.querySelector('.content');
            const readMoreBtn = ideaCard.querySelector('.read-more-btn');
            
            if (content.scrollHeight > content.clientHeight) {
                readMoreBtn.style.display = 'block';
            }
        });
    }
}

// Helper to create the idea card element
function createIdeaCard(idea) {
    const card = document.createElement('div');
    card.className = 'idea-card';
    card.id = `idea-${idea.id}`;
    
    // Get first letter for avatar
    const initial = idea.author.charAt(0);
    
    card.innerHTML = `
        <button class="delete-btn" title="Delete Idea" onclick="deleteIdea(${idea.id})">&times;</button>
        <div class="content-wrapper">
            <div class="content">${escapeHtml(idea.text)}</div>
            <button class="read-more-btn" onclick="toggleReadMore(${idea.id})">Read more</button>
        </div>
        <div class="footer">
            <div class="author-tag">
                <div class="avatar">${initial}</div>
                <span class="author-name">${idea.author}</span>
            </div>
            <div class="timestamp">${idea.timestamp}</div>
        </div>
    `;
    
    return card;
}

// Function to toggle "Read more"
function toggleReadMore(id) {
    const card = document.getElementById(`idea-${id}`);
    const btn = card.querySelector('.read-more-btn');
    const isExpanded = card.classList.toggle('expanded');
    
    btn.textContent = isExpanded ? 'Show less' : 'Read more';
}

// Function to add a new idea
function postIdea() {
    const text = ideaInput.value.trim();
    const author = authorSelect.value;
    
    if (!text) {
        alert("Please enter an idea first!");
        return;
    }
    
    if (!author) {
        alert("Please select a contributor name!");
        return;
    }
    
    const newIdea = {
        id: Date.now(),
        text: text,
        author: author,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })
    };
    
    ideas.push(newIdea);
    saveToStorage();
    renderIdeas();
    
    // Reset inputs
    ideaInput.value = '';
}

// Function to delete an idea
function deleteIdea(id) {
    if (confirm("Are you sure you want to delete this idea?")) {
        ideas = ideas.filter(idea => idea.id !== id);
        saveToStorage();
        renderIdeas();
    }
}

// Utility to escape HTML and prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Event Listeners
postBtn.addEventListener('click', postIdea);
themeToggle.addEventListener('click', toggleTheme);

// Allow posting with Ctrl+Enter or Cmd+Enter
ideaInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        postIdea();
    }
});

// Initialize on load
init();
