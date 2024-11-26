import { Meteor } from "meteor/meteor";
import { Link, LinksCollection } from "/imports/api/links";
import { ChatCollection } from "/imports/api/chat";
import { createModule } from "grubba-rpc";
import { z } from "zod";

async function insertLink({ title, url }: Pick<Link, "title" | "url">) {
  await LinksCollection.insertAsync({ title, url, createdAt: new Date() });
}

Meteor.startup(async () => {
  // If the Links collection is empty, add some data.
  if ((await LinksCollection.find().countAsync()) === 0) {
    await insertLink({
      title: "Do the Tutorial",
      url: "https://www.meteor.com/tutorials/react/creating-an-app",
    });

    await insertLink({
      title: "Follow the Guide",
      url: "https://guide.meteor.com",
    });

    await insertLink({
      title: "Read the Docs",
      url: "https://docs.meteor.com",
    });

    await insertLink({
      title: "Discussions",
      url: "https://forums.meteor.com",
    });
  }

  // We publish the entire Links collection to all clients.
  // In order to be fetched in real-time to the clients
  Meteor.publish("links", function () {
    return LinksCollection.find();
  });
});

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
