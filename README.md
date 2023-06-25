# Building A Chat GPT Clone With Strapi Open AI and LangChain with Next JS 13 Frontend

This article will explore how to build custom routes, services, and controllers to build a backend for our chat app using Strapi, Open AI, and LangChain. We will mostly spend time on the backend Strapi code implementation. But I will include the frontend code repo for you to use with this tutorial.

In this article, you will learn:

- What is LangChain, and why would you use it with Open AI.
- Giving memory to our chat via LangChain
- How to build custom routes, controllers, and services in Strapi.
- Creating a simple session service to manage our chat sessions.
- And log all of our conversation histories and save them to Strapi.

So let's get started.

## What Are We Going To Build

The superpower of Strapi is that it is highly customizable and gives you the opportunity to add any additional functionality in code.

Today we will take a look at how to integrate Open AI with LangChain to build our own Chat GPT chat clone with the power to remember.

This article will explore how to build custom routes, services, and controllers to build a backend for our chat app using Strapi, Open AI, and LangChain.

We will mostly spend time on the backend Strapi code implementation. But I will include the frontend code repo for you to use with this tutorial.

In this article, you will learn:

- What is LangChain, and why would you use it with Open AI.
- Giving memory to our chat via LangChain
- How to build custom routes, controllers, and services in Strapi.
- Creating a simple session service to manage our chat sessions.
- And log all of our conversation histories and save them to Strapi.

So let's get started.

## What Are We Going To Build

Before getting too deep into the tutorial, let's check out what we will build. It will be a simple Chat GPT clone with a couple of tricks.

Not only will you be able to have multiple conversations, but we will also give our chat memory with LangCain so that during the conversation, open ai can remember what you are discussing during your session.

We will also have a log of all previous conversation history.

You can see the app in action.

![App Demo](img/app-demo.gif)

## What Is Open AI

Open AI is behind the popular Chat GPT App; what is awesome is that, as a developer, you have access to a couple of their powerful LLM models to programmatically use in your application.

Which can allow you to build cool things. Checkout out their [Docs](https://platform.openai.com/docs/introduction)

![Open Ai](img/open-ai-api.png)

## What Is LangChain

![LangChain](img/lang-chain.png)

LangChain is a framework designed for leveraging Large Language Models (LLMs).

It allows you to build various applications such as chatbots, Generative Question-Answering (GQA), summarization, and much more.

The core concept revolves around the ability to "chain" together different components, allowing us to create advanced use cases with LLMs.

Here are some examples.

- Prompt Templates
- LLMs: We can integrate large language models, not just Chat GPT
- Agents: Agents will continue to self-prompt until the task is completed.
- Memory: LangChain provides mechanisms to implement short-term and long-term memory within the chat application.

By leveraging the power of LangChain, we can create a chat application that not only engages in multiple conversations but also possesses the ability to remember previous interactions.

Let's dive into the implementation details and get started with building our Chat GPT clone empowered with LangChain's memory capabilities.

**note:** this is a popular Python framework, but they have a Javascript version too.

You can checkout there docs (here)[https://js.langchain.com/docs/].

## Project Overview

![App Flow](img/app-flow.png)

Our user will interact with our Strapi backend with our Next Js Frontend, or you can use Postman or Insomnia to test the API.

All of the logic will be within Strapi, including making a request to Open AI. Since everything runs on the server, we never have to worry about leaking our Open AI Token.

We will also make an authorized request to our Strapi backend to prevent anyone without the Token from being able to use our API from anywhere but our Next JS website.

**Note:** For the tutorial's brevity, I did not implement user authentication but something that we can easily do in the future.

And instead just created an API Token that we can pass when making requests to our backend.

## Building Our Backend

**Setting Up Strapi**

Let's start by creating our Strapi app by running the following command.

```bash
  npx create-strapi-app@latest strapi-chat --quickstart
```

The `quickstart` command will set up Strapi for us, automatically running SQLite as a database. This can be changed in production.

You can check out [Strapi Quick Start](https://docs.strapi.io/dev-docs/quick-start) guide for more details.

Once the process is complete, you should be greeted with the **Welcome Strapi Screen**. Go ahead and create your first **admin** user.

![Strapi Admin](img/strapi-admin.png)

**Generating Our API**

Let's use `strapi generate` command to start building out our project. You can learn more about it [here](https://docs.strapi.io/dev-docs/cli#strapi-generate).

Run the following command to get started.

```bash
  yarn strapi generate
```

Chose `Api` option.

```bash
$ strapi generate
? Strapi Generators (Use arrow keys)
❯ api - Generate a basic API
```

I will call mine `strapi-chat`

```bash
? Strapi Generators api - Generate a basic API
? API name strapi-chat
? Is this API for a plugin? No
✔  ++ /api/strapi-chat/routes/strapi-chat.js
✔  ++ /api/strapi-chat/controllers/strapi-chat.js
✔  ++ /api/strapi-chat/services/strapi-chat.js
✨  Done in 66.65s.
➜  strapi-chat git:(main) ✗
```

This will create a basic scaffolding for our API.

![Folder Structure](img/folders.gif)

Let's uncomment out the example code and make our first request.

Route File: `strapi-chat/routes/strapi-chat.js`

```javascript
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/strapi-chat",
      handler: "strapi-chat.exampleAction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

Controller File: `strapi-chat/controllers/strapi-chat.js`

```javascript
"use strict";

/**
 * A set of functions called "actions" for `strapi-chat`
 */

module.exports = {
  exampleAction: async (ctx, next) => {
    try {
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
};
```

We will not worry about the services folder for now, but we will create a few custom services later.

First, let's restart our Strapi application by running the following command.

```bash
	yarn develop
```

Since we just created a new route and a controller, we should be able to see it in our Strapi Admin area.

Navigate to **settings->roles->permissions**

![Strapi Chat](img/our-route.png)

Make sure you check the permissions check box to activate the route and save.

We can test this route by making a **GET** request to `http://localhost:1337/api/strapi-chat`

We can now test our custom endpoint with a Postman or Insomnia; in my case, I will be using Insomnia.

We should see the "OK" response that is returned by our controller.

![Our Response](img/our-response.png)

**Basic Flow Routes, Controller and Services**

Let's take a quick refresher on the relationship between **Routes**, **Controllers**, and **Services** in Strapi.

![Flow](img/flow.png)

**Route:** A route in Strapi defines the endpoint or URL path that a client can access to interact with a specific resource or functionality provided by Strapi.

[Routes Docs](https://docs.strapi.io/dev-docs/backend-customization/routes)

**Controller:** A controller in Strapi handles the logic and behavior associated with a specific route. It serves as an intermediary between the route and the service layer. Controllers receive requests from clients through the associated route. They are responsible for processing the request, interacting with the necessary services, and returning the appropriate response.

[Controller Docs](https://docs.strapi.io/dev-docs/backend-customization/controllers)

**Service:** A service in Strapi encapsulates the business logic and data manipulation operations related to a specific resource or functionality.

[Services Docs](https://docs.strapi.io/dev-docs/backend-customization/services)

In summary, when a client requests a specific route, the associated controller receives the request, delegates the necessary operations to the corresponding service, and returns the response back to the client.

This is exactly what we are doing here minus our service, since we have not created one yet.

When we make a **GET** request to our endpoint we first hit our route.

Our Route:

```javascript
module.exports = {
  routes: [
    {
      method: "GET",
      path: "/strapi-chat",
      handler: "strapi-chat.exampleAction",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
```

Then our route calls our `exampleAction` inside our controller.

Our Controller:

```javascript
module.exports = {
  exampleAction: async (ctx, next) => {
    try {
      ctx.body = "ok";
    } catch (err) {
      ctx.body = err;
    }
  },
};
```

Which returns our `ok` message.

Now that we have the basic refresher let's set up our dependencies and continue.
