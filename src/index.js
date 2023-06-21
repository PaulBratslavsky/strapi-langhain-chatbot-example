'use strict';

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */

  register({ strapi }) {
    strapi.sessionStore = {
      sessions: {},

      saveSession: async (sessionId, langchain, initialPrompt) => {
        strapi.sessionStore.sessions[sessionId] = {
          chain: langchain,
          initialPrompt: initialPrompt
        };
      },

      getSession: async (sessionId) => {
        return strapi.sessionStore.sessions[sessionId];
      },

      getHistory: async (session) => {
        return await strapi.sessionStore.sessions[session].chain.memory.chatHistory
      },

      clearSessionById: async (sessionId) => {
        delete strapi.sessionStore.sessions[sessionId];
      },

      clearAllSessions: async () => {
        strapi.sessionStore.sessions = {};
      },

      showAllSessions: async () => {
        const sessions = Object.keys(strapi.sessionStore.sessions);
        for (const session of sessions) {
          console.log(session);
        }
      }
    };
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */

  bootstrap({ strapi }) {
    // console.log("Bootstraping open-ai services...");

    // if (strapi.openai !== undefined) {
    //   console.log("OpenAI service is ready");
    // }

    // if (strapi.model !== undefined) {
    //   console.log("LangChain service is ready");
    // }
  },
};
