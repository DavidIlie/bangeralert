import * as React from "react";
import { useSession } from "next-auth/react";
import { AiOutlineCodeSandbox, AiOutlineQuestion } from "react-icons/ai";

import { User } from "@acme/db";
import BaseTag from ".";

const ProfileTags: React.FC<{ user?: Partial<User> }> = ({
  user: baseUser,
}) => {
  const { data } = useSession();
  let user = baseUser ? baseUser : data?.user!;
  return (
    <div className="flex items-center gap-2">
      {user?.tags?.map((tag, index) => {
        switch (tag) {
          case "creator":
            return (
              <BaseTag
                label="Developer of this website!"
                Icon={AiOutlineCodeSandbox}
                key={index}
              />
            );
          default:
            return (
              <BaseTag
                label={`This tag has not been implemented yet, "${tag}"`}
                Icon={AiOutlineQuestion}
                key={index}
              />
            );
        }
      })}
    </div>
  );
};

export default ProfileTags;
