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
