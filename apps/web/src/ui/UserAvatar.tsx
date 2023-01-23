/* eslint-disable @next/next/no-img-element */
import * as React from "react";
import { useState } from "react";

import { useSession } from "next-auth/react";

const sizes = {
  small: "h-10 w-10",
  default: "h-20 w-20",
};

const UserAvatar: React.FC<{ size?: keyof typeof sizes }> = ({
  size = "default",
  ...rest
}) => {
  const { data } = useSession();
  const [isError, setError] = useState(false);

  return (
    <img
      alt={data?.user?.name ? `${data?.user?.name}-s-avatar` : "your-avatar"}
      className={`object-cover ${sizes[size]} rounded-full`}
      onError={() => setError(true)}
      src={
        isError
          ? `https://ui-avatars.com/api/${
              data?.user?.name ? `&name=${data?.user?.name}` : "&name"
            }&rounded=true&background=B23439&bold=true&color=FFFFFF`
          : data?.user?.image!
      }
      {...rest}
    />
  );
};

export default UserAvatar;
