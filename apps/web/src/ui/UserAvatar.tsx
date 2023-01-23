/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useState } from "react";

import { useSession } from "next-auth/react";

const UserAvatar: React.FC = () => {
  const { data } = useSession();
  const [isError, setError] = useState(false);
  return (
    <img
      alt={data?.user?.name ? `${data?.user?.name}-s-avatar` : "your-avatar"}
      className="object-cover w-20 h-20 rounded-full"
      onError={() => setError(true)}
      src={
        isError
          ? `https://ui-avatars.com/api/${
              data?.user?.name ? `&name=${data?.user?.name}` : "&name"
            }&rounded=true&background=B23439&bold=true&color=FFFFFF`
          : data?.user?.image!
      }
    />
  );
};

export default UserAvatar;
