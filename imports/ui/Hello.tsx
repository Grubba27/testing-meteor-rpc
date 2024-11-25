import React, { useState } from "react";
import { api } from "./api";

export const Hello = () => {
  const arg = "some_craze argument";
  const { data: links } = api.subsetOfLinks.usePublication(arg);

  const [counter, setCounter] = useState(0);
  const { data } = api.submodule.subMethod.useQuery("hello");
  const increment = async () => {
    setCounter(counter + 1);
    const r = await api.foo(arg);
    console.log({ r, links });
  };

  return (
    <div>
      <button onClick={increment}>Click Me</button>
      <p>You've pressed the button {counter} times.</p>
      <p>Submodule method response: {data}</p>
      <h3>Links from publication:</h3>
      {links.map((link) => (
        <div key={link._id}>
          Title: {link.title}
          <br />
        </div>
      ))}
    </div>
  );
};
