module.exports = {
  routes: [
    { 
      method: 'POST',
      path: '/open-agi/memory-chat', 
      handler: 'strapi-agi.memoryChat',
    },
    {
      method: 'POST',
      path: '/open-agi/clear-all-sessions',
      handler: 'strapi-agi.clearAllSessions',
    }
  ],
};
