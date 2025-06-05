// Modern JavaScript with ES6+ features

// Chat functionality
class StatsChat {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.userInput = document.getElementById('userQuestion');
        this.sendButton = document.getElementById('sendQuestion');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.handleUserMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleUserMessage();
            }
        });
    }

    handleUserMessage() {
        const message = this.userInput.value.trim();
        if (message) {
            this.addMessage('user', message);
            this.simulateResponse(message);
            this.userInput.value = '';
        }
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `message-${type}`);
        messageDiv.innerHTML = `
            <div class="message-content">
                <span class="message-text">${content}</span>
                <span class="message-time">${this.getCurrentTime()}</span>
            </div>
        `;
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    getCurrentTime() {
        return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }    async sendToFlowise(message) {
        try {
            const response = await axios.post('http://localhost:3000/api/v1/prediction/flow', {
                question: message
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error calling Flowise:', error);
            return 'Sorry, I encountered an error. Please try again.';
        }
    }

    async simulateResponse(message) {
        this.addMessage('bot', '...thinking...');
        const response = await this.sendToFlowise(message);
        
        // Remove the thinking message
        this.chatMessages.removeChild(this.chatMessages.lastChild);
        
        this.addMessage('bot', response);
    }
}

// Feature cards animation
class FeatureCards {
    constructor() {
        this.cards = document.querySelectorAll('.feature-card');
        this.initializeObserver();
    }

    initializeObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, options);

        this.cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            observer.observe(card);
        });
    }
}

// Initialize components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const chat = new StatsChat();
    const features = new FeatureCards();

    // Add smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Performance optimization with debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize events with debouncing
const handleResize = debounce(() => {
    // Add responsive adjustments if needed
    console.log('Window resized');
}, 250);
