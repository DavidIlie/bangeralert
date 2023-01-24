import * as React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { AiOutlineUser, AiOutlineBug } from "react-icons/ai";

import UserAvatar from "../UserAvatar";
import { DropdownController } from "../DropdownController";
import { BaseOverlay } from "../BaseOverlay";
import { SettingsIcon } from "../SettingsIcons";

const RightHeader: React.FC = () => {
  return (
    <DropdownController
      zIndex={20}
      className="fixed top-16 right-3 md:top-[5.5rem] md:right-0 md:mr-48"
      innerClassName="fixed transform -translate-x-full"
      overlay={(close) => (
        <div
          className="flex overflow-ellipsis whitespace-nowrap"
          style={{ width: 200 }}
        >
          <BaseOverlay
            onActionButtonClicked={() => {
              close();
              signOut();
            }}
            actionButton="Log Out"
          >
            <div className="flex flex-col">
              <Link href="/app/profile">
                <SettingsIcon
                  onClick={close}
                  icon={<AiOutlineUser />}
                  label="Profile"
                  transition
                />
              </Link>
              <SettingsIcon
                a={{
                  href: "https://github.com/davidilie/bangeralert/issues",
                }}
                onClick={close}
                icon={<AiOutlineBug />}
                label={"Report a bug"}
                transition
              />
            </div>
          </BaseOverlay>
        </div>
      )}
    >
      <UserAvatar size="small" />
    </DropdownController>
  );
};

export default RightHeader;
