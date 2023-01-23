/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useSession } from "next-auth/react";
const RightHeader: React.FC = () => {
  const { data } = useSession();

  if (!data) return null;

  return (
    <img
      src={data.user?.image || ""}
      alt={`${data.user?.name}'s profile photo`}
      className="object-cover w-10 h-10 rounded-full cursor-pointer"
    />
  );
};

export default RightHeader;
