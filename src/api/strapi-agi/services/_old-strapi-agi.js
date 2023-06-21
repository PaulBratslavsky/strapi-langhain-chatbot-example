'use strict';

const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { PromptTemplate } = require("langchain/prompts");
const { v4: uuidv4 } = require('uuid');

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

function generateSession(apiKey, strapi) {
  const sessionId = uuidv4();

  const template = `
      You are a Cyberpunk historian. You know everything about the the following topic: {input}.
      Please start the conversation by saying something about {input}.
  `;

  const initializedPrompt = new PromptTemplate({ template, inputVariables: ["input"] });
  const initialPrompt = initializedPrompt.format({ input: "Cyberpunk" });

  const langChain = configureLangChainChat(apiKey);

  strapi.sessionStore[sessionId] = {
    chain: langChain.chain,
    initialPrompt: initialPrompt
  };

  return sessionId;
}

function getResponse(session, input) {
  return session.chain.call({ input: input });
}

async function chatHistory(session, strapi) {
  return await strapi.sessionStore[session].chain.memory.chatHistory
}

async function saveInitialChat(sessionId, strapi) {
  await strapi
    .service('api::chat.chat')
    .create({ data: { sessionId: sessionId } })
}

async function updateExistingChat(sessionId, history, strapi) {
  const existingChat = await strapi
    .service('api::chat.chat')
    .find({ filters: { sessionId: sessionId } })

  const id = existingChat.results[0]?.id;
  
  if (id) await strapi
    .service('api::chat.chat')
    .update(id, { data: { history: JSON.stringify(history.messages) } })
}

module.exports = ({ strapi }) => ({
  memoryChat: async (ctx) => {
    let sessionId = ctx.request.body.data?.sessionId;
    const existingSession = await strapi.sessionStore[sessionId];

    if (!sessionId && !existingSession) {
      sessionId = generateSession(process.env.OPEN_AI_KEY, strapi);
      await saveInitialChat(sessionId, strapi);
      await getResponse(strapi.sessionStore[sessionId], await strapi.sessionStore[sessionId].initialPrompt);
    }

    const session = await strapi.sessionStore[sessionId];
    const response = await getResponse(session, ctx.request.body.data.input);

    const history = await chatHistory(sessionId, strapi)
    updateExistingChat(sessionId, history, strapi);

    response.sessionId = sessionId;
    return response;
  },
});
