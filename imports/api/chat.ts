import { Mongo } from "meteor/mongo";

export interface Message {
  text: string;
  who: string;
  createdAt: Date;
}

export interface Chat {
  _id?: string;
  messages: Message[];
  createdAt: Date;
}

export const ChatCollection = new Mongo.Collection<Chat>("chat");
