'use strict';
// const { Configuration, OpenAIApi } = require("openai");

// function configureOpenAi(apiKey) {
//   const configuration = new Configuration({
//     apiKey: apiKey,
//   });
//   return new OpenAIApi(configuration);
// }


module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */

  register({ strapi }) {
    // const openai = configureOpenAi(process.env.OPEN_AI_KEY);
    // strapi.openai = openai;
    strapi.sessionStore = {};
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
