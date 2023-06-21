module.exports = {
  routes: [
    { 
      method: 'POST',
      path: '/open-agi/memory-chat', 
      handler: 'strapi-agi.memoryChat',
    },
    {
      method: 'POST',
      path: '/open-agi/delete-session-by-id/:sessionId',
      handler: 'strapi-agi.deleteSessionById',
    },
    {
      method: 'POST',
      path: '/open-agi/clear-all-sessions',
      handler: 'strapi-agi.clearAllSessions',
    },
    {
      method: 'GET',
      path: '/open-agi/get-all-sessions',
      handler: 'strapi-agi.getAllSessions',
    }
  ],
};
