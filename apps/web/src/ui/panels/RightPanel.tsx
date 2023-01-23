/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

import { nFormatter } from "../../lib/nFormatter";

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

  const [isError, setError] = useState(false);

  return (
    <div className="flex flex-col w-full p-4 rounded-lg rounded-8 bg-dark-containers">
      <Link href="/app/profile">
        <button className="flex">
          <div className="flex">
            <img
              alt={
                data?.user?.name
                  ? `${data?.user?.name}-s-avatar`
                  : "your-avatar"
              }
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
          </div>
          <div className="flex mt-2">
            <div className="flex flex-col ml-3">
              <span className="overflow-hidden font-bold text-left text-gray-100 break-all">
                {data?.user?.name}
              </span>
              <span className="text-left text-gray-300 break-all">
                @{data?.user?.name?.split(" ").join("-").toLocaleLowerCase()}
              </span>
            </div>
          </div>
        </button>
      </Link>
      <div className="flex mt-2">
        <div className="flex py-1">
          <span className="font-bold text-gray-100">{nFormatter(2000)}</span>
          <span className="ml-1.5 lowercase text-gray-400">Followers</span>
        </div>
        <div className="flex px-2 py-1">
          <span className="font-bold text-gray-100">{nFormatter(25)}</span>
          <span className="ml-1.5 lowercase text-gray-400">Following</span>
        </div>
      </div>
      <div className="flex mt-1 text-left text-gray-200 break-words">
        Your average web developer
      </div>
      {true && <Website website="https://davidilie.com" />}
    </div>
  );
};

export default RightPanel;
