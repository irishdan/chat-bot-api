# Minimal AI Chat API

This API is a starting point for building AI chat applications! It's built in Typescript with [NestJs](https://nestjs.com).

## Getting started

- Ensure docker is running on your machine
- Copy .env.dist to .env and set api keys as needed
- Install dependencies:
```
    yarn install
```
- Start containers and run migrations:
```
    yarn docker:up
    yarn prisma:migrate
    yarn prisma:generate
```
- Start the application:

```
    yarn dev
```

# Creating a chat
- POST /chats with a title "tests chat"
- GET /chats/{id}/stream and subscribe to the SSE stream on the front end
- PATCH /chats/{id} with a message "hello" and type "human" to send a message to the chat
- If you have subscribed to the SSE stream you should see a response from the AI streamed to the front end
- PATCH /chats/{id} another message
- PATCH /chats/{id} ...
- The full openapi spec is [here](docs/openapi/open-api.yml)

## API Architecture

The API loosely follows the principles of Domain-Driven Design (DDD) and Command Query Responsibility Segregation (CQRS).

### Modules (or Domains)
NestJS promotes a modular structure. 
Each domain or bounded context can be represented as a module. 
Each module then has its application, domain, and infrastructure layers.

#### Application Layer
This contains commands, queries, and their respective handlers. It's also where DTOs (Data Transfer Objects) are defined.

#### Domain Layer
This includes your core business logic - entities (or aggregates), value objects, domain services, events, and domain-specific interfaces for repositories and providers.

#### Infrastructure Layer
Houses technical implementations such as controllers (for HTTP routes), concrete repository implementations, and other providers.

### Directory Structure
The directory structure maintains the separation of concerns recommended by DDD while leveraging NestJS's modular system to organize code around domain boundaries effectively.

```yaml
|-- /src
|   |   /ai (domain module)
|   |   |-- /application
|   |   |   |-- /command
|   |   |   |   |-- commands and command handlers
|   |   |   |-- /query
|   |   |   |   |-- queries and query handlers, DTOs, DTO providers and response builders
|   |   |-- /domain
|   |   |   |-- /model
|   |   |   |   |-- models and repository interfaces, provider interfaces
|   |   |   |-- /service
|   |   |   |   |-- domain services
|   |   |-- /infrastructure
|   |   |   |-- /persistence
|   |   |   |   |-- repository implementations
|   |   |   |-- /controllers
|   |   |   |   |-- controllers for HTTP routes
|   |   |   |-- /providers
|   |   |   |   |-- third party providers
|   |   /common (cross-cutting concerns, shared utilities, core functionality)
|   |   |-- ... (similar structure as above)
```

## Large Language Model

Out of the box the API uses the OpenAiChatResponseProvider which uses the OpenAI API to generate responses. 
There's also a LangChainChatResponseProvider which uses the [LangChainJs](https://js.langchain.com/) library and a HuggingFaceChatResponseProvider which uses the HuggingFace API. 
Ollama is supported with the OllamaChatResponseProvider also.
These providers implement the ChatResponseProvider interface and can be swapped around easily using dependency injection.

## Persistence

Out of the box the API uses a Postgres database with Prisma as the ORM. This is also easily swappable.

## Caching

As part of the Query side of CQRS, the API uses Redis to cache all DTO's for lightning-fast responses. 
The LangChainOpenAiRedisBufferChatResponseProvider uses Redis and memory to cache message history and responses from the OpenAI API.

## API Specification

The rest API is documented using Swagger [here](docs/openapi/open-api.yml) 
