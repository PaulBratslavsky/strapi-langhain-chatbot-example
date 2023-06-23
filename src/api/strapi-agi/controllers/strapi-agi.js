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
  getSessionById: async (ctx) => {
    try {
      const response = await strapi
        .service('api::strapi-agi.strapi-agi')
        .getSessionById(ctx);

      ctx.body = { data: response };
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  },
  deleteSessionById: async (ctx) => {
    try {
      const response = await strapi
        .service('api::strapi-agi.strapi-agi')
        .deleteSessionById(ctx);
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
  getAllSessions: async (ctx) => {
    try {
      const response = await strapi
        .service('api::strapi-agi.strapi-agi')
        .getAllSessions(ctx);

      ctx.body = { data: response };
    } catch (err) {
      console.log(err.message);
      throw new Error(err.message);
    }
  },
});
