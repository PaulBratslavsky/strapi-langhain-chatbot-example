const { Configuration, OpenAIApi } = require("openai");

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

async function generateSession(apiKey, strapi) {
  const sessionId = uuidv4();

  const template = `
    system: The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
    Your name is {input}. You are smart but snarky.
    You specialize in discussions around building SaaS products, productivity and software engineering.
    You alway start the conversation with a greeting and a question.
  `;

  const initializedPrompt = new PromptTemplate({ template, inputVariables: ["input"] });
  const initialPrompt = initializedPrompt.format({ input: "Ava" });
  const langChain = configureLangChainChat(apiKey)

  await strapi.sessionStore.saveSession(sessionId, langChain.chain, initialPrompt)
  return sessionId;
}

function getResponse(session, input) {
  return session.chain.call({ input: input });
}

module.exports = ({ strapi }) => ({
  memoryChat: async (ctx) => {
    let sessionId = ctx.request.body.data?.sessionId;
    const existingSession = await strapi.sessionStore.sessions[sessionId];

    console.log("Session ID: ", sessionId)
    console.log("Existing Session: ", existingSession ? true : false)


    if (!existingSession) {
      sessionId = await generateSession(process.env.OPEN_AI_KEY, strapi);
      await getResponse(await strapi.sessionStore.getSession(sessionId), await strapi.sessionStore.getSession(sessionId).initialPrompt);
    }

    const session = await strapi.sessionStore.getSession(sessionId);
    const history = await strapi.sessionStore.getHistory(sessionId);
    const response = await getResponse(session, ctx.request.body.data.input);

    response.sessionId = sessionId;
    response.history = history.messages;

    await strapi.sessionStore.showAllSessions();
    return response;
  },

  clearAllSessions: async (ctx) => {
    await strapi.sessionStore.clearAllSessions();
    return { message: "Sessions cleared" };
  },

  getAllSessions: async (ctx) => {
    // TODO: TO BE IMPLEMENTED
    const sessions = await strapi.sessionStore.showAllSessions();
    console.log(sessions);
    return { message: "Sessions shown", sessions: "Sessions" };
  },
});
