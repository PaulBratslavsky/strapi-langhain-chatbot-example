module.exports = {
  routes: [
    { // Path defined with an URL parameter
      method: 'POST',
      path: '/memory-chat', 
      handler: 'strapi-agi.memoryChat',
    },
  ],
};
