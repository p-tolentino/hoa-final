"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { PiBinocularsBold, PiBroomFill } from "react-icons/pi";
import { TfiDashboard as Dashboard } from "react-icons/tfi";
import { FaUser as User } from "react-icons/fa";
import { RxGear as Gear, RxExit as Exit } from "react-icons/rx";
import { BsNewspaper } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserRole } from "@prisma/client";
import { Separator } from "../ui/separator";
import { LogoutButton } from "../auth/logout-button";
import { getInfoById } from "@/server/data/userInfo";

export function Sidebar() {
  const user = useCurrentUser();
  var existingInfo;

  if (user) {
    existingInfo = getInfoById(user?.id);
  }

  console.log(existingInfo);

  const pathname = usePathname();
  const params = useParams();

  const userRoutes = [
    {
      label: "Dashboard",
      href: "/user",
      icon: <Dashboard className="w-5 h-5 mr-2" />,
      active: pathname === `/user`,
    },
    {
      label: "Membership",
      href: "/user/membership",
      icon: <FiUserCheck className="w-5 h-5 mr-2" />,
      active: pathname === `/user/membership"`,
    },
    {
      label: "Finance Management",
      href: "/user/finance",
      icon: <FiDollarSign className="w-5 h-5 mr-2" />,
      active: pathname === `/user/finance`,
    },
    {
      label: "Community Engagement",
      href: "/user/community",
      icon: <FiUsers className="w-5 h-5 mr-2" />,
      active: pathname === `/user/community`,
    },
    {
      label: "Dispute Resolution",
      href: "/user/dispute",
      icon: <FiBriefcase className="w-5 h-5 mr-2" />,
      active: pathname === `/user/dispute`,
    },
    {
      label: "Violation Monitoring",
      href: "/user/violation",
      icon: <PiBinocularsBold className="w-5 h-5 mr-2" />,
      active: pathname === `/user/violation"`,
    },
    {
      label: "Facility Reservation",
      href: "/user/facility",
      icon: <FiCalendar className="w-5 h-5 mr-2" />,
      active: pathname === `/user/facility`,
    },
    {
      label: "Maintenance Handling",
      href: "/user/maintenance",
      icon: <PiBroomFill className="w-5 h-5 mr-2" />,
      active: pathname === `/user/maintenance`,
    },
    {
      label: "Election Management",
      href: "/user/election",
      icon: <BsNewspaper className="w-5 h-5 mr-2" />,
      active: pathname === `/user/election`,
    },
  ];

  const adminRoutes = [
    {
      label: "Dashboard",
      href: "/admin",
      icon: <Dashboard className="w-5 h-5 mr-2" />,
      active: pathname === `/admin`,
    },
    {
      label: "Membership",
      href: "/admin/membership",
      icon: <FiUserCheck className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/membership"`,
    },
    {
      label: "Finance Management",
      href: "/admin/finance",
      icon: <FiDollarSign className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/finance`,
    },
    {
      label: "Community Engagement",
      href: "/admin/community",
      icon: <FiUsers className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/community`,
    },
    {
      label: "Dispute Resolution",
      href: "/admin/dispute",
      icon: <FiBriefcase className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/dispute`,
    },
    {
      label: "Violation Monitoring",
      href: "/admin/violation",
      icon: <PiBinocularsBold className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/violation"`,
    },
    {
      label: "Facility Reservation",
      href: "/admin/facility",
      icon: <FiCalendar className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/facility`,
    },
    {
      label: "Maintenance Handling",
      href: "/admin/maintenance",
      icon: <PiBroomFill className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/maintenance`,
    },
    {
      label: "Election Management",
      href: "/admin/election",
      icon: <BsNewspaper className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/election`,
    },
  ];

  const profileRoutes = [
    {
      label: "My Profile",
      href: user?.role === UserRole.ADMIN ? "/admin/profile" : "/user/profile",
      icon: <User className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/profile` || pathname === `/user/profile`,
    },
    {
      label: "Settings",
      href:
        user?.role === UserRole.ADMIN ? "/admin/settings" : "/user/settings",
      icon: <Gear className="w-5 h-5 mr-2" />,
      active: pathname === `/admin/settings` || pathname === `/user/settings`,
    },
  ];

  return (
    <div
      className={cn(
        "h-[100vh]  bg-[#355E3B] flex items-start space-x-4 lg:space-x-6 text-white"
      )}
    >
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight ">
            Modules
          </h2>
          <div className="space-y-4">
            {user?.role === UserRole.USER &&
              userRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex justify-between font-medium transition-colors hover:text-primary",
                    route.active ? "text-black" : "text-white"
                  )}
                >
                  <Button
                    className={cn(
                      "justify-start w-full",
                      route.active
                        ? "bg-[#F0CB5B] text-black hover:bg-[#F0CB5B]"
                        : "bg-[#355E3B] hover:bg-[#688f6e]"
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Button>
                </Link>
              ))}
            {user?.role === UserRole.ADMIN &&
              adminRoutes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex justify-between font-medium transition-colors hover:text-primary",
                    route.active ? "text-black" : "text-white"
                  )}
                >
                  <Button
                    className={cn(
                      "justify-start w-full",
                      route.active
                        ? "bg-[#F0CB5B] text-black hover:bg-[#F0CB5B]"
                        : "bg-[#355E3B] hover:bg-[#688f6e]"
                    )}
                  >
                    {route.icon}
                    {route.label}
                  </Button>
                </Link>
              ))}
          </div>
        </div>

        <div className="px-3 py-[100px]">
          <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            {profileRoutes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex justify-between font-medium transition-colors hover:text-primary",
                  route.active ? "text-black" : "text-white"
                )}
              >
                <Button
                  className={cn(
                    "justify-start w-full",
                    route.active
                      ? "bg-[#F0CB5B] text-black hover:bg-[#F0CB5B]"
                      : "bg-[#355E3B] hover:bg-[#688f6e]"
                  )}
                >
                  {route.icon}
                  {route.label}
                </Button>
              </Link>
            ))}
          </div>
          <Separator className="my-4 opacity-50" />
          <LogoutButton>
            <Button
              className=" justify-start w-full bg-[#355E3B] hover:bg-[#688f6e] hover:text-white"
              variant="ghost"
            >
              <Exit className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </LogoutButton>
        </div>
      </div>
    </div>
  );
}
