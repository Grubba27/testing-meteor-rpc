import { Mongo } from "meteor/mongo";

export interface Message {
  text: string;
  who: string;
  createdAt: Date;
  where?: string; // Optional field for where the message was sent
}

export const MessageCollection = new Mongo.Collection<Message>("message");

export interface Chat {
  _id?: string;
  messages: Message[];
  createdAt: Date;
}

export const ChatCollection = new Mongo.Collection<Chat>("chat");
