import Link from "next/link";
import { useSession } from "next-auth/react";

import { nFormatter } from "../../lib/nFormatter";
import UserAvatar from "../UserAvatar";
import ProfileTags from "../tags/ProfileTags";

const regex = /(^\w+:|^)\/\//;

export const Website: React.FC<{ website: string }> = ({ website }) => {
  return (
    <a
      className="mt-2 font-bold text-blue-500"
      href={website}
      target="_blank"
      rel="noreferrer"
    >
      {website.replace(regex, "")}
    </a>
  );
};

const RightPanel: React.FC = () => {
  const { data } = useSession();

  return (
    <div className="flex w-full flex-col rounded-lg bg-dark-containers p-4">
      <Link href="/app/profile">
        <button className="flex">
          <div className="flex">
            <UserAvatar />
          </div>
          <div className="mt-2 flex">
            <div className="ml-3 flex flex-col">
              <span className="overflow-hidden break-all text-left font-bold text-gray-100">
                {data?.user?.name}
              </span>
              <span className="break-all text-left text-gray-300">
                @{data?.user?.username}
              </span>
              <ProfileTags />
            </div>
          </div>
        </button>
      </Link>
      <div className="mt-2 flex">
        <div className="flex py-1">
          <span className="font-bold text-gray-100">
            {nFormatter(data?.user?.followers || 0)}
          </span>
          <span className="ml-1.5 lowercase text-gray-400">Followers</span>
        </div>
        <div className="flex px-2 py-1">
          <span className="font-bold text-gray-100">
            {nFormatter(data?.user?.following || 0)}
          </span>
          <span className="ml-1.5 lowercase text-gray-400">Following</span>
        </div>
      </div>
      <div className="mt-1 flex break-words text-left text-gray-200">
        {data?.user?.description || "No description..."}
      </div>
      {data?.user?.website && <Website website={data?.user?.website} />}
    </div>
  );
};

export default RightPanel;
