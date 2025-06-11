import { ApolloServer } from "@apollo/server";
import AWS from "aws-sdk";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import express from "express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { expressMiddleware } from "@as-integrations/express5";
import cors from "cors";
import { PubSub, withFilter } from "graphql-subscriptions";
import { subscribe } from "diagnostics_channel";

dotenv.config();
AWS.config.update({ region: "us-east-1" });
//creating the amazon dynamodb service client to access dynamodb
var ddbDocClient = new AWS.DynamoDB.DocumentClient();
//PubSub instance allowing you to publish and listen for changes associated with a particular label
const pubsub = new PubSub();

const typeDefs = `#graphql 
      type Query{
            hello: String
            getUsers: [String]
            currentUser: User
            currentUserFriends(user_id: String!): [Friend]
            getChatMessage(user_id: String! , relationship_id: String!): String!
      }
      type User{
            id : ID!
            email: String!
            username: String!
      }
      type Friend{
            id : ID!
            username : String!
            relationship_id : String!
      }
      type Message {
            sender_id: String!
            relationship_id:String!
            message: String!
      }
      type Mutation{
            login(email: String! , password:String! ): AuthPayload
            createUser(email: String! , password:String! , name: String! , phonenumber: String!): User
            sendMessage(user_id: String! ,relationship_id: String!, message: String!): String
      }
      type AuthPayload{
            token: String!
            user: User!
      }
      type Subscription{
            messageCreated(relationship_id: String!): Message!
      }
`;

const resolvers = {
  Query: {
    hello: () => "Hello from Apollo!",
    getUsers: async () => {
      const params = { TableName: "Users" };
      try {
        const data = await ddbDocClient.scan(params).promise(); // <<<< THIS await is critical
        if (!data || !data.Items) {
          console.log("No Items found in DynamoDB scan.");
          return [];
        }
        console.log("Items returned:", data.Items);
        return data.Items.map((item) => item.name);
      } catch (error) {
        console.error("Could not fetch users", error);
        throw new Error("Could not return users");
      }
    },
    currentUser: async (_, { email, password }) => {
      const params = {
        TableName: "Users",
        FilterExpression: "email = :email  AND password = :password",
        ExpressionAttributeValues: { ":email": email, ":password": password },
      };
      try {
        const data = ddbDocClient.scan(params).promise();
      } catch (error) {
        console.error("Failed to authenticate user.", error);
        throw new Error("Could not authenticate user.");
      }
    },
    currentUserFriends: async (_, { user_id }) => {
      const params = {
        TableName: "Friends",
        FilterExpression: "sender_id = :user_id OR receiver_id = :user_id",
        ExpressionAttributeValues: { ":user_id": user_id },
      };
      try {
        const data = await ddbDocClient.scan(params).promise();
        if (data && data.Count > 0) {
          const response = data.Items.map((friend) => {
            //receiver_name , receiver_id , sender_id , sender_name
            if (user_id == friend.sender_id) {
              return {
                id: friend.receiver_id,
                username: friend.receiver_name,
                relationship_id: friend.relationship_id,
              };
            } else
              return {
                id: friend.sender_id,
                username: friend.sender_name,
                relationship_id: friend.relationship_id,
              };
          });
          return response;
        }
      } catch (error) {
        console.log("Could not fetch friends:", error);
        throw new Error("Could not fetch friends, do you have any?");
      }
    },
  },
  Mutation: {
    createUser: async (_, { name, email, phonenumber, password }) => {
      const id = Date.now().toString();
      const params = {
        TableName: "Users",
        Item: {
          user_id: id,
          email,
          password,
          name,
          phonenumber,
        },
      };
      try {
        await ddbDocClient.put(params).promise();
        return { id, email, username: name };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create new user");
      }
    },
    login: async (_, { email, password }) => {
      const params = {
        TableName: "Users",
        FilterExpression: "email = :email  AND password = :password",
        ExpressionAttributeValues: { ":email": email, ":password": password },
      };
      try {
        const data = await ddbDocClient.scan(params).promise();
        console.log("Login data.Items:", data.Items); // DEBUGGING
        if (data.Items && data.Items.length > 0) {
          const user = data.Items[0];
          const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET);

          return {
            token: token,
            user: {
              id: user.user_id,
              email: user.email,
              username: user.name,
            },
          };
        }
      } catch (error) {
        console.error("Error logging in user:", error);
        return { error: error };
      }
    },
    sendMessage: async (_, { user_id, relationship_id, message }) => {
      const params = {
        TableName: "Messages",
        Item: {
          message_id: uuidv4(),
          sender_id: user_id,
          relationship_id: relationship_id,
          message: message,
        },
      };
      try {
        const data = await ddbDocClient.put(params).promise();
        pubsub.publish("MESSAGE_CREATED", {
          messageCreated: {
            sender_id: user_id,
            relationship_id: relationship_id,
            message: message,
          },
        });
        if (data) console.log(data);
        return "Message successfully sent.";
      } catch (error) {
        console.log("Error sending message. ", error);
        return "Message could not be sent.";
      }
    },
  },
  Subscription: {
    messageCreated: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("MESSAGE_CREATED"),
        (payload, variables) => {
          return (
            payload.messageCreated.relationship_id === variables.relationship_id
          );
        }
      ),
    },
  },
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
// This `app` is the returned value from `express()`.
const httpServer = createServer(app);
//web socket server creation
const wsServer = new WebSocketServer({
  server: httpServer,
  path: "/graphql",
});

const serverCleanup = useServer({ schema }, wsServer);

// const server = new ApolloServer({ typeDefs, resolvers });

// const { url } = await startStandaloneServer(server);
// console.log(`Server is alive at ${url}`);

//new server code to replace previous declarations for subscription capabilities
const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }), // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

app.use(
  "/graphql",
  cors({ origin: "*" }),
  express.json(),
  expressMiddleware(server)
);
await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/`);
