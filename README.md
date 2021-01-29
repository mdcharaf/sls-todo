# Serverless TODO
# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.

# TODO items

The application should store TODO items, and each TODO item contains the following fields:

* `todoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a TODO item (e.g. "Change a light bulb")
* `dueDate` (string) - date and time by which an item should be completed
* `done` (boolean) - true if an item was completed, false otherwise
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a TODO item


# Service Information

* service: serverless-todo-app
* stage: dev
* region: us-east-2
* stack: serverless-todo-app-dev
* resources: 53
* api keys:
  ** None
* endpoints:
  ** GET - https://{apiId}.execute-api.us-east-2.amazonaws.com/dev/todos
  ** POST - https://{apiId}.execute-api.us-east-2.amazonaws.com/dev/todos
  ** PATCH - https://{apiId}.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}
  ** DELETE - https://{apiId}.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}
  ** POST - https://{apiId}.execute-api.us-east-2.amazonaws.com/dev/todos/{todoId}/attachment
* functions:
  ** Auth: serverless-todo-app-dev-Auth
  ** GetTodos: serverless-todo-app-dev-GetTodos
  ** CreateTodo: serverless-todo-app-dev-CreateTodo
  ** UpdateTodo: serverless-todo-app-dev-UpdateTodo
  ** DeleteTodo: serverless-todo-app-dev-DeleteTodo
  ** GenerateUploadUrl: serverless-todo-app-dev-GenerateUploadUrl
# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```