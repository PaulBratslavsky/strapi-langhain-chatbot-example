'use strict';
const { Configuration, OpenAIApi } = require("openai");
const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");


function configureOpenAi(apiKey) {
  const configuration = new Configuration({
    apiKey: apiKey,
  });
  return new OpenAIApi(configuration);
}

function configureLangChainChat(apiKey) {
  const memory = new BufferMemory();

  const model = new OpenAI({
    openAIApiKey: apiKey,
    modelName: "gpt-3.5-turbo",
    temperature: 0.7,
  });

  const chain = new ConversationChain({
    llm: model,
    memory: memory,
  });

  return {
    chain: chain,
    memory: memory,
    model: model,
  }
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */

  register({ strapi }) {
    const openai = configureOpenAi(process.env.OPEN_AI_KEY);
    strapi.openai = openai;

    const langchain = configureLangChainChat(process.env.OPEN_AI_KEY);
    strapi.langchain = langchain;
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */

  bootstrap({ strapi }) {
    console.log("Bootstraping open-ai services...");

    if (strapi.openai !== undefined) {
      console.log("OpenAI service is ready");
    }

    if (strapi.model !== undefined) {
      console.log("LangChain service is ready");
    }
  },
};
