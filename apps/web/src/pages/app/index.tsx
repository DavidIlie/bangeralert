import * as React from "react";
import type { NextPage } from "next";

import DefaultLayout from "../../layouts/DefaultLayout";
import { Button } from "../../ui/Button";

const App: NextPage = () => {
  return (
    <DefaultLayout
      extraMiddleLayout={
        <div className="flex items-center justify-between mt-10">
          <h1 className="text-xl font-bold">Your Feed</h1>
          <Button>New Song</Button>
        </div>
      }
    >
      {Array.from(Array(50).keys()).map((_s, index) => (
        <div key={index}>Test {index}</div>
      ))}
    </DefaultLayout>
  );
};

export default App;
