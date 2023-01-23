import * as React from "react";

const LeftPanel: React.FC<{ small?: boolean }> = ({ small = false }) => {
  return (
    <div>
      <h1 className="text-xl font-bold">People</h1>
    </div>
  );
};

export default LeftPanel;
