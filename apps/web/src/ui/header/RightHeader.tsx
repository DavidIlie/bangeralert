/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useState } from "react";
import { useSession } from "next-auth/react";
const RightHeader: React.FC = () => {
  const { data } = useSession();

  const [isError, setError] = useState(false);

  return (
    <img
      onError={() => setError(true)}
      src={
        isError
          ? `https://ui-avatars.com/api/${
              data?.user?.name ? `&name=${data?.user?.name}` : "&name"
            }&rounded=true&background=B23439&bold=true&color=FFFFFF`
          : data?.user?.image!
      }
      alt={`${data?.user?.name!}'s profile photo`}
      className="object-cover w-10 h-10 rounded-full cursor-pointer"
    />
  );
};

export default RightHeader;
