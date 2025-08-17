// Article renderer class
class ArticleRenderer {
    constructor() {
        // Initialize rendering system
    }

    renderArticle(articleData) {
        let html = '';
        
        // Article header
        html += this.renderHeader(articleData);
        
        // Introduction
        if (articleData.content.introduction) {
            html += this.renderIntroduction(articleData.content.introduction);
        }
        
        // Main sections
        if (articleData.content.sections) {
            html += this.renderSections(articleData.content.sections);
        }
        
        // Exercises
        if (articleData.content.exercises && articleData.content.exercises.length > 0) {
            html += this.renderExercises(articleData.content.exercises);
        }
        
        // Applications
        if (articleData.content.applications && articleData.content.applications.length > 0) {
            html += this.renderApplications(articleData.content.applications);
        }
        
        // References
        if (articleData.content.references && articleData.content.references.length > 0) {
            html += this.renderReferences(articleData.content.references);
        }
        
        return html;
    }
    
    renderHeader(articleData) {
        return `
            <div class="article-header">
                <h1>${articleData.title}</h1>
                <div class="article-meta">
                    <span class="category">${articleData.category}</span>
                    <span class="subcategory">${articleData.subcategory}</span>
                    <span class="difficulty difficulty-${articleData.difficulty.toLowerCase().replace(' ', '-')}">${articleData.difficulty}</span>
                    <span class="time-to-read">⏱️ ${articleData.timeToRead}</span>
                </div>
                ${articleData.tags ? `<div class="tags">
                    ${articleData.tags.map(tag => `<span class="tag">#${tag}</span>`).join('')}
                </div>` : ''}
            </div>
        `;
    }
    
    renderIntroduction(intro) {
        let html = `<div class="introduction">`;
        
        if (intro.title) {
            html += `<h2>${intro.title}</h2>`;
        }
        
        if (intro.text) {
            html += `<p>${intro.text}</p>`;
        }
        
        if (intro.formula) {
            html += `<div class="formula">${intro.formula}</div>`;
        }
        
        if (intro.points) {
            html += `<ul>`;
            intro.points.forEach(point => {
                html += `<li>${point}</li>`;
            });
            html += `</ul>`;
        }
        
        if (intro.note) {
            html += `<div class="note"><strong>Lưu ý:</strong> ${intro.note}</div>`;
        }
        
        html += `</div>`;
        return html;
    }
    
    renderSections(sections) {
        let html = '';
        
        sections.forEach(section => {
            html += `<div class="section">`;
            html += `<h2>${section.title}</h2>`;
            
            section.content.forEach(item => {
                html += this.renderContentItem(item);
            });
            
            html += `</div>`;
        });
        
        return html;
    }
    
    renderContentItem(item) {
        switch (item.type) {
            case 'text':
                return `<p>${item.content}</p>`;
                
            case 'subtitle':
                return `<h3>${item.content}</h3>`;
                
            case 'code':
                return `<pre><code class="language-${item.language || 'text'}">${this.escapeHtml(item.content)}</code></pre>`;
                
            case 'formula':
                return `<div class="formula">${item.content}</div>`;
                
            case 'example':
                return `<div class="example">
                    <p>${item.content}</p>
                    ${item.formula ? `<div class="formula">${item.formula}</div>` : ''}
                </div>`;
                
            case 'operations':
                return this.renderOperations(item);
                
            case 'complexity':
                return `<div class="complexity"><strong>Độ phức tạp:</strong> ${item.content}</div>`;
                
            case 'problem':
                return `<div class="problem">${item.content}</div>`;
                
            case 'algorithm':
                return this.renderAlgorithm(item);
                
            case 'derivation':
                return this.renderDerivation(item);
                
            case 'invariants':
                return `<div class="invariants">
                    <strong>Bất biến:</strong>
                    ${item.content.map(inv => `<div class="formula">${inv}</div>`).join('')}
                </div>`;
                
            case 'updates':
                return `<div class="updates">
                    ${item.content.map(upd => `<div class="formula">${upd}</div>`).join('')}
                </div>`;
                
            case 'conclusion':
                return `<div class="conclusion"><strong>Kết luận:</strong> ${item.content}</div>`;
                
            case 'note':
                return `<div class="note"><strong>Lưu ý:</strong> ${item.content}</div>`;
                
            default:
                return `<p>${item.content || ''}</p>`;
        }
    }
    
    renderOperations(item) {
        let html = `<div class="operations">`;
        if (item.title) {
            html += `<h4>${item.title}</h4>`;
        }
        
        item.operations.forEach(op => {
            html += `<div class="operation">`;
            html += `<h5>${op.name}</h5>`;
            if (op.description) {
                html += `<p>${op.description}</p>`;
            }
            html += `<pre><code class="language-cpp">${this.escapeHtml(op.code)}</code></pre>`;
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }
    
    renderAlgorithm(item) {
        let html = `<div class="algorithm">`;
        if (item.title) {
            html += `<h4>${item.title}</h4>`;
        }
        
        html += `<ol>`;
        item.steps.forEach(step => {
            html += `<li>${step}</li>`;
        });
        html += `</ol>`;
        
        html += `</div>`;
        return html;
    }
    
    renderDerivation(item) {
        let html = `<div class="derivation">`;
        html += `<h4>${item.title}</h4>`;
        
        item.steps.forEach(step => {
            html += `<div class="derivation-step">${step}</div>`;
        });
        
        if (item.result) {
            html += `<div class="derivation-result">
                <strong>Kết quả:</strong>
                <div class="formula">${item.result}</div>
            </div>`;
        }
        
        html += `</div>`;
        return html;
    }
    
    renderExercises(exercises) {
        let html = `<div class="exercises">
            <h2>💪 Bài tập luyện tập</h2>
            <div class="exercise-list">`;
            
        exercises.forEach(exercise => {
            html += `<div class="exercise-item">
                <h4><a href="${exercise.url}" target="_blank">${exercise.title}</a></h4>
                <span class="platform">${exercise.platform}</span>
            </div>`;
        });
        
        html += `</div></div>`;
        return html;
    }
    
    renderApplications(applications) {
        let html = `<div class="applications">
            <h2>🔧 Ứng dụng</h2>
            <div class="application-list">`;
            
        applications.forEach(app => {
            html += `<div class="application-item">
                <h4>${app.title}</h4>
                <p>${app.description}</p>
            </div>`;
        });
        
        html += `</div></div>`;
        return html;
    }
    
    renderReferences(references) {
        let html = `<div class="references">
            <h2>📚 Tham khảo</h2>
            <ul>`;
            
        references.forEach(ref => {
            html += `<li><a href="${ref.url}" target="_blank">${ref.title}</a></li>`;
        });
        
        html += `</ul></div>`;
        return html;
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Main application class
class AlgorithmApp {
    constructor() {
        this.renderer = new ArticleRenderer();
        this.currentArticle = '';
        this.cache = new Map();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showWelcome();
    }

    setupEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('hashchange', this.handleHashChange.bind(this));
        
        if (window.location.hash) {
            this.handleHashChange();
        }
    }

    handleResize() {
        if (window.innerWidth <= 768) {
            this.addMobileMenuToggle();
        }
    }

    addMobileMenuToggle() {
        if (document.querySelector('.mobile-menu-toggle')) return;
        
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = '☰';
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1001;
            background: var(--accent-color);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            font-size: 18px;
            cursor: pointer;
        `;
        
        toggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');
        });
        
        document.body.appendChild(toggle);
    }

    handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            this.loadArticle(hash);
        }
    }

    showWelcome() {
        document.getElementById('welcome').style.display = 'block';
        document.getElementById('article-content').style.display = 'none';
        this.updateActiveNavItem('');
    }

    async loadArticle(articleId) {
        try {
            this.showLoading();
            
            // Check cache first
            if (this.cache.has(articleId)) {
                this.renderArticle(this.cache.get(articleId), articleId);
                return;
            }

            // Fetch article content
            const response = await fetch(`content/${articleId}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load article: ${articleId}`);
            }
            
            const articleData = await response.json();
            
            // Cache the content
            this.cache.set(articleId, articleData);
            
            // Render article
            this.renderArticle(articleData, articleId);
            
            // Update URL hash
            window.location.hash = articleId;
            
        } catch (error) {
            console.error('Error loading article:', error);
            this.showError(`Không thể tải bài viết: ${articleId}`, error.message);
        }
    }

    showLoading() {
        const content = document.getElementById('article-content');
        content.innerHTML = '<div class="loading"></div>';
        content.style.display = 'block';
        document.getElementById('welcome').style.display = 'none';
    }

    renderArticle(articleData, articleId) {
        const content = document.getElementById('article-content');
        
        // Render article using the renderer
        const html = this.renderer.renderArticle(articleData);
        
        // Set content
        content.innerHTML = html;
        content.style.display = 'block';
        document.getElementById('welcome').style.display = 'none';
        
        // Update active navigation item
        this.updateActiveNavItem(articleId);
        
        // Re-render MathJax
        if (window.MathJax) {
            MathJax.typesetPromise([content]).catch((err) => {
                console.log('MathJax typeset failed: ' + err.message);
            });
        }
        
        // Highlight code
        if (window.Prism) {
            Prism.highlightAllUnder(content);
        }
        
        // Scroll to top
        content.scrollIntoView({ behavior: 'smooth' });
        
        // Store current article
        this.currentArticle = articleId;
    }

    showError(message, details = '') {
        const content = document.getElementById('article-content');
        content.innerHTML = `
            <div class="error-message" style="
                text-align: center;
                padding: 40px;
                color: #ef4444;
                background: #fef2f2;
                border: 1px solid #fecaca;
                border-radius: 8px;
                margin: 20px 0;
            ">
                <h2>❌ Lỗi</h2>
                <p>${message}</p>
                ${details ? `<p style="font-size: 0.9em; color: #666; margin-top: 10px;">${details}</p>` : ''}
                <button onclick="app.showWelcome()" style="
                    background: var(--accent-color);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">Về trang chủ</button>
            </div>
        `;
        content.style.display = 'block';
        document.getElementById('welcome').style.display = 'none';
    }

    updateActiveNavItem(articleId) {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-subsection a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current item
        if (articleId) {
            const activeLink = document.querySelector(`[onclick="loadArticle('${articleId}')"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    }

    // Search functionality (for future enhancement)
    search(query) {
        const results = [];
        this.cache.forEach((articleData, articleId) => {
            const text = JSON.stringify(articleData).toLowerCase();
            if (text.includes(query.toLowerCase())) {
                results.push({
                    id: articleId,
                    title: articleData.title,
                    category: articleData.category,
                    subcategory: articleData.subcategory
                });
            }
        });
        return results;
    }
}

// Global function for onclick handlers
function loadArticle(articleId) {
    app.loadArticle(articleId);
}

// Initialize the application
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new AlgorithmApp();
});

// Fallback for older browsers
if (typeof fetch === 'undefined') {
    window.fetch = function(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve({
                        ok: true,
                        text: () => Promise.resolve(xhr.responseText),
                        json: () => Promise.resolve(JSON.parse(xhr.responseText))
                    });
                } else {
                    reject(new Error(`HTTP ${xhr.status}`));
                }
            };
            xhr.onerror = () => reject(new Error('Network error'));
            xhr.send();
        });
    };
}
