'use strict';

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin('open-ai')
      .service('myService')
      .getWelcomeMessage();
  },
});
