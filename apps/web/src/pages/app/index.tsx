import * as React from "react";
import type { NextPage } from "next";

import DefaultLayout from "../../layouts/DefaultLayout";

const App: NextPage = () => {
  return (
    <DefaultLayout>
      {Array.from(Array(50).keys()).map((_s, index) => (
        <div key={index}>Test {index}</div>
      ))}
    </DefaultLayout>
  );
};

export default App;
