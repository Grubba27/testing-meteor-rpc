import { Meteor } from "meteor/meteor";
import { Link, LinksCollection } from "/imports/api/links";
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

  // Meteor.publish("subsetOfLinks", async function () {
  //   const clientCollectionName = "subsetOfLinks";

  //   const cursor = LinksCollection.find({ title: "hello" });
  //   const handle = await cursor.observeChanges({
  //     added: (id, fields) => {
  //       this.added(clientCollectionName, id, fields);
  //     },
  //     changed: (id, fields) => {
  //       this.changed(clientCollectionName, id, fields);
  //     },
  //     removed: (id) => {
  //       this.removed(clientCollectionName, id);
  //     },
  //   });

  //   this.ready();

  //   this.onStop(async () => {
  //     console.log(handle);
  //     handle.stop();
  //   });
  // });
});

const submodule = createModule("submodule")
  .addMethod("subMethod", z.string(), (arg1) => {
    console.log("subMethod called with", arg1);
    return "subMethod";
  })
  .buildSubmodule();

const server = createModule()
  .addMethod("foo", z.string(), async (arg1) => {
    console.log("foo called with", arg1);
    await insertLink({ title: arg1, url: "https://example.com" });
    return "bar" as const;
  })
  .addPublication("subsetOfLinks", z.string(), async (arg1) => {
    console.log("subsetOfLinks publication called with", arg1);
    return LinksCollection.find({ title: arg1 });
  })
  .addSubmodule(submodule)
  .build();

export type Server = typeof server;
