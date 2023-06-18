'use strict';
const { PromptTemplate } = require("langchain/prompts");

// TODO: FIGURE OUT HOW INSTANCES ARE CREATED WHEN MULTIPLE USERS ARE USING THE CHATBOT

let count = 0;

module.exports = ({ strapi }) => ({
  memoryChat: async (ctx) => {

    const template = `
      You are a chatbot in the following topic: {input}.
      Please respond in character. We are having a conversation. And I only want you to respond when asked a question. 
    `;

    const initializedPrompt = new PromptTemplate({ template, inputVariables: ["input"] });
    const initialPrompt = await initializedPrompt.format({ input: "Cyberpunk" });

    console.log(initialPrompt)

    const { chain } = strapi.langchain;

    if (count === 0) {
      const res1 = await chain.call({ input: initialPrompt });
      console.log(res1)
    }

    count += 1;
    console.log("count", count)

    console.log(ctx.request.body)

    const response = await chain.call({ input: ctx.request.body.data.input });
    console.log(response)

    return response;
  },
});
