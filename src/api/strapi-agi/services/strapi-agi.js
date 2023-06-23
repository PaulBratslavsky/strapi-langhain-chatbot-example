const sessionManager = require("../sessionManager");
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

async function generateSession(apiKey) {
  const sessionId = uuidv4();

  const template = `
    system: The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.
    Your name is {input}. You are smart but snarky.
    You specialize in discussions around building SaaS products, productivity and software engineering.
    You alway start the conversation with a greeting and a question.
  `;

  const initializedPrompt = new PromptTemplate({ template, inputVariables: ["input"] });

  const initialPrompt = await initializedPrompt.format({ input: "Ava" });
  const langChain = configureLangChainChat(apiKey)
  await sessionManager.saveSession(sessionId, langChain.chain, initialPrompt)
  return sessionId;
}

function getResponse(session, input) {
  return session.chain.call({ input: input });
}

async function logInitialChat(sessionId, strapi) {
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
    const existingSession = await sessionManager.sessions[sessionId];

    console.log("Session ID: ", sessionId)
    console.log("Existing Session: ", existingSession ? true : false)

    if (!existingSession) {
      sessionId = await generateSession(process.env.OPEN_AI_KEY);
      const newSession = await sessionManager.getSession(sessionId);
      await logInitialChat(sessionId, strapi);
      const response = await getResponse(newSession, newSession.initialPrompt);
      response.sessionId = sessionId;
      return response;
    } else {
      const session = await sessionManager.getSession(sessionId);
      const history = await sessionManager.getHistory(sessionId);
      const response = await getResponse(session, ctx.request.body.data.input);
  
      await updateExistingChat(sessionId, history, strapi);
  
      response.sessionId = sessionId;
      response.history = history.messages;
  
      await sessionManager.showAllSessions();
      return response;

    }
  },

  getSessionById: async (ctx) => {
    const sessionId = ctx.params.sessionId;
    const sessionExists = await sessionManager.getSession(sessionId);
    if (!sessionExists) return { error: "Session not found" };
    const history = await sessionManager.getHistory(sessionId);

    const response = {
      sessionId: sessionId,
      history: history.messages,
    };
    
    return response;
  },

  deleteSessionById: async (ctx) => {
    const sessionId = ctx.params.sessionId;
    const sessionExists = await sessionManager.getSession(sessionId);
    if (!sessionExists) return { error: "Session not found" };
    await sessionManager.clearSessionById(sessionId);
    return { message: "Session deleted" };
  },

  clearAllSessions: async (ctx) => {
    await sessionManager.clearAllSessions();
    return { message: "Sessions cleared" };
  },

  getAllSessions: async (ctx) => {
    const sessions = await sessionManager.showAllSessions();
    return sessions;
  },
});
