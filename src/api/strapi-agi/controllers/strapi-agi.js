'use strict';

/**
 * A set of functions called "actions" for `strapi-agi`
 */

module.exports = ({strapi}) => ({
  memoryChat: async (ctx) => {
    try {
      const response = await strapi
        .service('api::strapi-agi.strapi-agi')
        .memoryChat(ctx);

      ctx.body = { data: response };
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  },
  clearAllSessions: async (ctx) => {
    try {
      const response = await strapi
        .service('api::strapi-agi.strapi-agi')
        .clearAllSessions(ctx);

      ctx.body = { data: response };
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  },
});
