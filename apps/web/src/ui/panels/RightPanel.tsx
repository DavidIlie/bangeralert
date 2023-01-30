import Link from "next/link";
import { useSession } from "next-auth/react";
import { FaSpotify } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";

import { nFormatter } from "../../lib/nFormatter";
import UserAvatar from "../UserAvatar";
import ProfileTags from "../tags/ProfileTags";
import { api } from "../../lib/api";
import { SongResponseType } from "@acme/api/src/lib/spotify";

const RightPanel: React.FC = () => {
  const { data } = useSession();

  const { data: musicData } = api.spotify.currentlyListeningBasic.useQuery();

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
              <div className="mt-2">
                <ProfileTags />
              </div>
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
      {musicData && <Song song={musicData} />}
    </div>
  );
};

const Song: React.FC<{ song: SongResponseType }> = ({ song }) => (
  <div className="mt-1 flex items-center gap-2 text-gray-200">
    <FaSpotify className="text-green-600" />
    <div className="truncate">
      <Link
        href={`/app/song/fromSpotId/${song.spotify_id}`}
        className="font-semibold duration-150 hover:text-blue-500"
      >
        {song.name}
      </Link>
      <span className="text-gray-300">{" by "}</span>
      <Link
        href={`/app/artist/fromSpotId/${song.artist[0]?.spotify_id}`}
        className="font-semibold  duration-150 hover:text-blue-500"
      >
        {song.artist[0]?.name}
      </Link>
    </div>
  </div>
);

const regex = /(^\w+:|^)\/\//;

export const Website: React.FC<{ website: string }> = ({ website }) => {
  return (
    <div className="mt-2 flex items-center gap-2">
      <CgWebsite className="text-blue-500" />
      <a
        className="font-medium duration-150 hover:text-blue-500"
        href={website}
        target="_blank"
        rel="noreferrer"
      >
        {website.replace(regex, "")}
      </a>
    </div>
  );
};

export default RightPanel;
