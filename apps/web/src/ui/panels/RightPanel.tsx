import Link from "next/link";
import { useSession } from "next-auth/react";

import { nFormatter } from "../../lib/nFormatter";
import UserAvatar from "../UserAvatar";

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
    <div className="flex flex-col w-full p-4 rounded-lg rounded-8 bg-dark-containers">
      <Link href="/app/profile">
        <button className="flex">
          <div className="flex">
            <UserAvatar />
          </div>
          <div className="flex mt-2">
            <div className="flex flex-col ml-3">
              <span className="overflow-hidden font-bold text-left text-gray-100 break-all">
                {data?.user?.name}
              </span>
              <span className="text-left text-gray-300 break-all">
                @{data?.user?.username}
              </span>
            </div>
          </div>
        </button>
      </Link>
      <div className="flex mt-2">
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
      <div className="flex mt-1 text-left text-gray-200 break-words">
        {data?.user?.description || "No description..."}
      </div>
      {data?.user?.website && <Website website={data?.user?.website} />}
    </div>
  );
};

export default RightPanel;
