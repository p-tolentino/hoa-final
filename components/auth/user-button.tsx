"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutButton } from "./logout-button";

import { FaUser as User } from "react-icons/fa";
import { RxExit as Exit } from "react-icons/rx";
import { RxDashboard as Dashboard, RxGear as Gear } from "react-icons/rx";
import Link from "next/link";

export const UserButton = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="text-white bg-yellow-600">
            <User className="" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-full" align="end">
        <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link href={`/${user?.role.toLowerCase()}`}>
            <DropdownMenuItem>
              <Dashboard className="w-4 h-4 mr-2" />
              Dashboard
            </DropdownMenuItem>
          </Link>
          <Link href={`/${user?.role.toLowerCase()}/settings`}>
            <DropdownMenuItem>
              <Gear className="w-4 h-4 mr-2" />
              Settings
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <LogoutButton>
          <DropdownMenuItem>
            <Exit className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
