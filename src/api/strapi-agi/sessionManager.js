class SessionManager {
  constructor() {
    this.sessions = {};
  }

  async saveSession(sessionId, langchain, initialPrompt) {
    
    this.sessions[sessionId] = {
      chain: langchain,
      initialPrompt: initialPrompt
    };
  }

  async getSession(sessionId) {
    return this.sessions[sessionId];
  }

  async getHistory(sessionId) {
    if (!this.sessions[sessionId]) {
      throw new Error('Session not found');
    }
    return this.sessions[sessionId].chain.memory.chatHistory;
  }

  async clearSessionById(sessionId) {
    delete this.sessions[sessionId];
  }

  async clearAllSessions() {
    this.sessions = {};
  }

  async showAllSessions() {
    const sessionIds = Object.keys(this.sessions);
    const sessions = []
    for (const sessionId of sessionIds) {
      sessions.push(sessionId);
      console.log("Sessions: ", sessionId);
    }
    return sessions;
  }
}

module.exports = new SessionManager();