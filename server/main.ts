import { ChatCollection, MessageCollection } from "/imports/api/chat";
import { createModule } from "meteor-rpc";
import { z } from "zod";

const server = createModule()
  .addPublication("chatRoom", z.string(), (chatId) => {
    return ChatCollection.find({ _id: chatId });
  })
  .addPublication("chatRooms", z.void(), () => {
    return ChatCollection.find();
  })
  .addSharedPublication("latestMessagesOnRooms", z.void(), () => {
    return [
      ChatCollection.find({}, { sort: { createdAt: -1 }, limit: 10 }),
      MessageCollection.find({}, { sort: { createdAt: -1 }, limit: 10 }),
    ]
  })
  .addMethod("createChatRoom", z.void(), async () => {
    return ChatCollection.insertAsync({ createdAt: new Date(), messages: [] });
  })
  .addMethod(
    "sendMessage",
    z.object({ chatId: z.string(), message: z.string(), user: z.string() }),
    async ({ chatId, message, user }) => {
      MessageCollection.insertAsync({
        text: message,
        who: user,
        createdAt: new Date(),
        where: chatId, // Optional field for where the message was sent
      });
      return ChatCollection.updateAsync(
        { _id: chatId },
        {
          $push: {
            messages: { text: message, who: user, createdAt: new Date() },
          },
        }
      );
    }
  )
  .build();

export type Server = typeof server;
