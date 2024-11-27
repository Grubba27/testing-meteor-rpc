import { ChatCollection } from "/imports/api/chat";
import { createModule } from "grubba-rpc";
import { z } from "zod";

const server = createModule()
  .addPublication("chatRoom", z.string(), (chatId) => {
    return ChatCollection.find({ _id: chatId });
  })
  .addPublication("chatRooms", z.void(), () => {
    return ChatCollection.find();
  })
  .addMethod("createChatRoom", z.void(), async () => {
    return ChatCollection.insertAsync({ createdAt: new Date(), messages: [] });
  })
  .addMethod(
    "sendMessage",
    z.object({ chatId: z.string(), message: z.string(), user: z.string() }),
    async ({ chatId, message, user }) => {
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
