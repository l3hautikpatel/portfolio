// ─── Chatbot Logic ────────────────────────────────────────────────────────────
const CHAT_BACKEND_URL = 'https://portfolio-backend-neon-alpha.vercel.app';
const SESSION_LIFETIME_MS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

let chatSessionId = null;
let chatMessagesLimitHit = false; // Flag to track if we're waiting for email fallback

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('chat-toggle-btn');
  const chatWindow = document.getElementById('chat-window');
  const closeBtn = document.getElementById('close-chat-btn');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const messagesContainer = document.getElementById('chat-messages');

  if (!toggleBtn || !chatWindow) return;

  initSession();
  loadMessages();

  // Handlers for Opening/Closing
  toggleBtn.addEventListener('click', () => {
    chatWindow.classList.toggle('hidden');
    if (!chatWindow.classList.contains('hidden')) {
      chatInput.focus();
      scrollToBottom();
      // Auto-greeting if empty
      if (messagesContainer.children.length === 0) {
        addMessage('bot', "Hi! I'm Bhautik's AI assistant. How can I help you today?");
      }
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.add('hidden');
  });

  // Sending Messages
  sendBtn.addEventListener('click', handleSend);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text) return;

    chatInput.value = '';
    
    // Add User Message
    addMessage('user', text);
    saveMessage('user', text);

    // Check if we are currently in fallback mode (asking for email)
    if (chatMessagesLimitHit) {
      if (validateEmail(text)) {
        chatMessagesLimitHit = false;
        await submitFallbackEmail(text);
      } else {
        addMessage('bot', 'Please provide a valid email address so Bhautik can reach out to you.');
        saveMessage('bot', 'Please provide a valid email address so Bhautik can reach out to you.');
      }
      return;
    }

    // Normal bot flow
    const typingMsg = addMessage('bot', 'Typing...', true);

    try {
      const response = await fetch(`${CHAT_BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, sessionId: chatSessionId })
      });

      typingMsg.remove();
      const data = await response.json();

      if (response.ok && data.success) {
        // Success
        addMessage('bot', data.reply);
        saveMessage('bot', data.reply);
      } else if (response.status === 429) {
        // Rate limit reached
        handleRateLimit();
      } else {
        // Fallback error
        const errMsg = data.error || "Sorry, I'm having trouble connecting right now.";
        addMessage('bot', errMsg);
        saveMessage('bot', errMsg);
      }
    } catch (error) {
      typingMsg.remove();
      addMessage('bot', "Sorry, I'm offline at the moment. Please try again later.");
      saveMessage('bot', "Sorry, I'm offline at the moment. Please try again later.");
    }
  }

  function handleRateLimit() {
    chatMessagesLimitHit = true;
    const fallbackMessage = "This conversation is making more meaningful way, let's connect over email and further 30 minutes chat. Please submit your email address below, and Bhautik will reach out to you.";
    addMessage('bot', fallbackMessage);
    saveMessage('bot', fallbackMessage);
  }

  async function submitFallbackEmail(email) {
    const typingMsg = addMessage('bot', 'Sending your information...', true);
    
    try {
      const response = await fetch(`${CHAT_BACKEND_URL}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: "Chatbot Visitor", 
          email: email, 
          message: "Triggered from chatbot 429 rate limit fallback. The user wants to continue the conversation." 
        })
      });

      typingMsg.remove();
      if (response.ok) {
         const thanksMsg = "Thank you! Bhautik will reach out from his side.";
         addMessage('bot', thanksMsg);
         saveMessage('bot', thanksMsg);
      } else {
         const thanksMsg = "Thank you! We have noted your email.";
         addMessage('bot', thanksMsg);
         saveMessage('bot', thanksMsg);
      }
    } catch (error) {
      typingMsg.remove();
      addMessage('bot', "Error sending email. You can use the contact form at the bottom of the page instead!");
    }
  }

  // --- Helpers ---

  function addMessage(sender, text, isTyping = false) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', sender);
    if (isTyping) msgDiv.classList.add('typing');
    
    // Parse markdown for bot messages, but keep user messages as safe text content
    if (sender === 'bot' && typeof marked !== 'undefined') {
      msgDiv.innerHTML = marked.parse(text);
    } else {
      msgDiv.textContent = text;
    }
    
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    return msgDiv;
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function initSession() {
    const savedData = localStorage.getItem('chatSessionData');
    const now = new Date().getTime();

    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (now - data.timestamp < SESSION_LIFETIME_MS) {
          chatSessionId = data.sessionId;
          return; // Session is valid
        }
      } catch (e) {
        console.error("Error parsing chat session", e);
      }
    }

    // Generate new session ID
    chatSessionId = 'session_' + now + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatSessionData', JSON.stringify({
      sessionId: chatSessionId,
      timestamp: now
    }));
    // Clear old messages for a new session
    localStorage.removeItem('chatMessages');
  }

  function saveMessage(sender, text) {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('chatMessages')) || [];
    } catch (e) {}
    history.push({ sender, text });
    localStorage.setItem('chatMessages', JSON.stringify(history));
  }

  function loadMessages() {
    let history = [];
    try {
      history = JSON.parse(localStorage.getItem('chatMessages')) || [];
    } catch (e) {}
    
    history.forEach(msg => {
      addMessage(msg.sender, msg.text);
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});
