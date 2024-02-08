"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiUserCheck,
  FiUsers,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PiBinocularsBold, PiBroomFill } from "react-icons/pi";
import { TfiDashboard as Dashboard } from "react-icons/tfi";
import { FaUser as User } from "react-icons/fa";
import { RxGear as Gear, RxExit as Exit } from "react-icons/rx";
import { BsNewspaper } from "react-icons/bs";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Separator } from "../ui/separator";
import { LogoutButton } from "../auth/logout-button";

export function Sidebar() {
  const user = useCurrentUser();
  const pathname = usePathname();

  const sidebarRoutes = [
    {
      label: "Dashboard",
      href: `/${user?.role.toLowerCase()}`,
      icon: <Dashboard className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}`,
    },
    {
      label: "Membership",
      href: `/${user?.role.toLowerCase()}/membership`,
      icon: <FiUserCheck className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/membership"`,
    },
    {
      label: "Finance Management",
      href: `/${user?.role.toLowerCase()}/finance`,
      icon: <FiDollarSign className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/finance`,
    },
    {
      label: "Community Engagement",
      href: `/${user?.role.toLowerCase()}/community`,
      icon: <FiUsers className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/community`,
    },
    {
      label: "Dispute Resolution",
      href: `/${user?.role.toLowerCase()}/disputes`,
      icon: <FiBriefcase className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/disputes`,
    },
    {
      label: "Violation Monitoring",
      href: `/${user?.role.toLowerCase()}/violations`,
      icon: <PiBinocularsBold className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/violations`,
    },
    {
      label: "Facility Reservation",
      href: `/${user?.role.toLowerCase()}/facility`,
      icon: <FiCalendar className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/facility`,
    },
    {
      label: "Maintenance Handling",
      href: `/${user?.role.toLowerCase()}/maintenance`,
      icon: <PiBroomFill className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/maintenance`,
    },
    {
      label: "Election Management",
      href: `/${user?.role.toLowerCase()}/election`,
      icon: <BsNewspaper className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/election`,
    },
  ];

  const membershipRoutes = [];

  const financeRoutes = [];

  const communityRoutes = [];

  const disputeRoutes = [];

  const violationRoutes = [];

  const facilityRoutes = [];

  const maintenanceRoutes = [];

  const electionRoutes = [];

  const profileRoutes = [
    {
      label: "My Profile",
      href: `/${user?.role.toLowerCase()}/profile`,
      icon: <User className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/profile`,
    },
    {
      label: "Settings",
      href: `/${user?.role.toLowerCase()}/settings`,
      icon: <Gear className="w-5 h-5 mr-2" />,
      active: pathname === `/${user?.role.toLowerCase()}/settings`,
    },
  ];

  return (
    <div
      className={cn(
        "h-full  bg-[#355E3B] flex items-start space-x-4 lg:space-x-6 text-white"
      )}
    >
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <h1 className="px-4 mb-2 text-lg font-semibold tracking-tight ">
            Modules
          </h1>
          <div className="space-y-4">
            {sidebarRoutes.map((route) => (
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
