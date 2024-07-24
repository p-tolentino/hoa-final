"use client";

import { cn } from "@/lib/utils";

import {
  FiBriefcase,
  FiCalendar,
  FiUserCheck,
  FiUsers,
  FiMenu,
} from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TbCurrencyPeso } from "react-icons/tb";
import { PiBinocularsBold } from "react-icons/pi";
import { PiBroom } from "react-icons/pi";
import { TfiDashboard as Dashboard } from "react-icons/tfi";
import { FaUser as User } from "react-icons/fa";
import { RxGear as Gear, RxExit as Exit } from "react-icons/rx";
import { BsNewspaper } from "react-icons/bs";
import { useCurrentRole } from "@/hooks/use-current-role";
import { LogoutButton } from "../auth/logout-button";
import { Notification, UserRole } from "@prisma/client";
import { useState, useEffect, useTransition } from "react";
import {
  Flex,
  Text,
  IconButton,
  Divider,
  Avatar,
  Heading,
  Icon,
  Menu,
  MenuButton,
  Box,
  Stack,
  Spinner,
} from "@chakra-ui/react";
import { UserButton } from "../auth/user-button";
import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";
import NotificationCenter from "./NotifcationCenter";
import { ExtendedUser } from "@/next-auth";
import { currentUser } from "@/lib/auth";

export function Sidebar({
  notifications,
}: {
  notifications: Notification[] | null;
}) {
  const roles = useCurrentRole();
  const pathname = usePathname();
  const role = roles === UserRole.ADMIN ? "admin" : "user";
  const [user, setUser] = useState<ExtendedUser | null | undefined>();
  const [isPending, startTransition] = useTransition();

  const userRoutes = [
    {
      label: "Dashboard",
      href: `/user/dashboard`,
      icon: Dashboard,
      active: pathname.includes(`dashboard`),
    },
    {
      label: "Membership",
      href: `/user/membership`,
      icon: FiUserCheck,
      active: pathname.startsWith(`/user/membership`),
    },
    {
      label: "Finance Management",
      href: `/user/finance`,
      icon: TbCurrencyPeso,
      active: pathname.startsWith(`/user/finance`),
    },
    {
      label: "Community Engagement",
      href: `/user/community`,
      icon: FiUsers,
      active: pathname.startsWith(`/user/community`),
    },
    {
      label: "Dispute Resolution",
      href: `/user/disputes`,
      icon: FiBriefcase,
      active: pathname.startsWith(`/user/disputes`),
    },
    {
      label: "Violation Monitoring",
      href: `/user/violations`,
      icon: PiBinocularsBold,
      active: pathname.startsWith(`/user/violations`),
    },
    {
      label: "Facility Reservation",
      href: `/user/facility`,
      icon: FiCalendar,
      active: pathname.startsWith(`/user/facility`),
    },
    {
      label: "Maintenance Handling",
      href: `/user/maintenance`,
      icon: PiBroom,
      active: pathname.startsWith(`/user/maintenance`),
    },
    {
      label: "Election Management",
      href: `/user/election`,
      icon: BsNewspaper,
      active: pathname.startsWith(`/user/election`),
    },
  ];
  const adminRoutes = [
    {
      label: "Membership",
      href: `/admin/membership`,
      icon: FiUserCheck,
      active: pathname.startsWith(`/admin/membership`),
    },
  ];

  const profileRoutes = [
    {
      label: "My Profile",
      href: `/${role}/profile`,
      icon: User,
      active: pathname === `/${role}/profile`,
    },
    {
      label: "Settings",
      href: `/${role}/settings`,
      icon: Gear,
      active: pathname === `/${role}/settings`,
    },
  ];

  // For responsiveness when window is resized
  const [sidebarSize, changeSidebarSize] = useState("large");

  useEffect(() => {
    startTransition(() => {
      currentUser().then((data) => {
        if (data) {
          setUser(data);
        }
      });
    });
    const handleResize = () => {
      const isSmallScreen = window.innerWidth <= 768; // You can adjust the breakpoint (768) as needed
      changeSidebarSize(isSmallScreen ? "small" : "large");
    };
    // Initial check on mount
    handleResize();
    // Event listener for window resize
    window.addEventListener("resize", handleResize);
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Flex
      pos="sticky"
      top={0}
      h={{ sm: "97.8vh", lg: "100vh" }}
      minW={sidebarSize === "small" ? "80px" : "250px"}
      flexDir="column"
      justifyContent={{ sm: "space-around", lg: "space-between" }}
      bgColor={"brand.500"}
      color={"white"}
      zIndex={3}
    >
      <Flex
        p={sidebarSize === "small" ? "17%" : "5%"}
        flexDir="column"
        w="100%"
        alignItems={sidebarSize === "small" ? "center" : "flex-start"}
        as="nav"
      >
        <Flex>
          <Link href="/">
            <NextImage
              src={SystemLogo}
              alt="HOAs.is Logo"
              width={100}
              height={100}
            />
          </Link>
        </Flex>
        {sidebarSize === "small" ? (
          <Stack mr="3px" mt={3}>
            <IconButton
              background="none"
              color={"white"}
              _hover={{ background: "none" }}
              icon={<FiMenu />}
              onClick={() => {
                if (sidebarSize === "small") changeSidebarSize("large");
                else changeSidebarSize("small");
              }}
              aria-label={""}
              alignSelf={"flex-start"}
            />
            <NotificationCenter initialData={notifications || []} />
            <Divider />
          </Stack>
        ) : (
          <Flex justify="space-between" w="100%" mt={3}>
            <IconButton
              background="none"
              color={"white"}
              _hover={{ background: "none" }}
              icon={<FiMenu />}
              onClick={() => {
                if (sidebarSize === "small") changeSidebarSize("large");
                else changeSidebarSize("small");
              }}
              aria-label={""}
              alignSelf={"flex-start"}
            />
            <NotificationCenter initialData={notifications || []} />
          </Flex>
        )}

        <Stack
          spacing={sidebarSize === "small" ? "5" : "3"}
          mt="1.4rem"
          ml={sidebarSize === "small" ? 2 : 0}
        >
          {user?.role !== UserRole.ADMIN
            ? userRoutes.map((route) => {
                return (
                  <Box
                    key={route.label}
                    alignItems={sidebarSize === "small" ? "center" : "left"}
                    fontSize={"sm"}
                    fontFamily={"font.body"}
                    w={sidebarSize === "small" ? "65px" : "225px"}
                  >
                    <Menu placement="right" key={route.label}>
                      <Link
                        href={route.href}
                        className={cn(
                          "p-3 rounded-lg no-underline hover:bg-[#688f6e] hover:text-white transition",
                          route.active ? "bg-[#F0CB5B]" : "bg-transparent"
                        )}
                      >
                        <MenuButton w="100%">
                          <Flex pl={sidebarSize === "small" ? "1.5" : "0"}>
                            <Icon
                              as={route.icon}
                              fontSize="xl"
                              color={route.active ? "black" : "white"}
                              className="w-5 h-5"
                            />
                            <Text
                              textAlign={"left"}
                              ml={5}
                              display={
                                sidebarSize === "small" ? "none" : "flex"
                              }
                              color={route.active ? "black" : "white"}
                              fontWeight={route.active ? "bold" : "normal"}
                            >
                              {route.label}
                            </Text>
                          </Flex>
                        </MenuButton>
                      </Link>
                    </Menu>
                  </Box>
                );
              })
            : adminRoutes.map((route) => {
                return (
                  <Box
                    key={route.label}
                    alignItems={sidebarSize === "small" ? "center" : "left"}
                    fontSize={"sm"}
                    fontFamily={"font.body"}
                    w={sidebarSize === "small" ? "65px" : "225px"}
                  >
                    <Menu placement="right" key={route.label}>
                      <Link
                        href={route.href}
                        className={cn(
                          "p-3 rounded-lg no-underline hover:bg-[#688f6e] hover:text-white transition",
                          route.active ? "bg-[#F0CB5B]" : "bg-transparent"
                        )}
                      >
                        <MenuButton w="100%">
                          <Flex pl={sidebarSize === "small" ? "1.5" : "0"}>
                            <Icon
                              as={route.icon}
                              fontSize="xl"
                              color={route.active ? "black" : "white"}
                              className="w-5 h-5"
                            />
                            <Text
                              textAlign={"left"}
                              ml={5}
                              display={
                                sidebarSize === "small" ? "none" : "flex"
                              }
                              color={route.active ? "black" : "white"}
                              fontWeight={route.active ? "bold" : "normal"}
                            >
                              {route.label}
                            </Text>
                          </Flex>
                        </MenuButton>
                      </Link>
                    </Menu>
                  </Box>
                );
              })}
        </Stack>
      </Flex>

      {sidebarSize !== "small" && (
        <Flex
          p="1rem"
          flexDir="column"
          w="100%"
          alignItems={sidebarSize === "small" ? "center" : "flex-start"}
          mb={4}
        >
          <Divider
            display={sidebarSize === "small" ? "none" : "flex"}
            mt={"1rem"}
          />
          <Flex
            mt={4}
            align="center"
            display={sidebarSize === "small" ? "none" : "flex"}
          >
            <Avatar
              size="sm"
              src={user?.info.imageUrl || user?.image || ""}
              bg="yellow.600"
              icon={<User className="w-4 h-4" />}
            />
            {!isPending ? (
              <Flex flexDir="column" ml={4}>
                <Heading
                  as="h3"
                  size="sm"
                  fontFamily="font.heading"
                  className="capitalize"
                >
                  {`${user?.info?.firstName || "-"} ${
                    user?.info?.lastName || ""
                  }`}
                </Heading>
                <Text color="brand.300" fontFamily="font.body">
                  {user?.role} - {user?.info?.position}
                </Text>
              </Flex>
            ) : (
              <Spinner className="ml-4" />
            )}
          </Flex>

          <Stack spacing={2} mt={3}>
            <Flex
              fontSize={"sm"}
              display={sidebarSize === "small" ? "none" : "flex"}
            >
              <Text
                as={Link}
                href={`/${role}/profile`}
                fontFamily="font.body"
                _hover={{ color: "yellow.200" }}
              >
                My Profile
              </Text>
            </Flex>
            <Flex
              fontSize={"sm"}
              display={sidebarSize === "small" ? "none" : "flex"}
            >
              <Text
                as={Link}
                href={`/${role}/settings`}
                fontFamily="font.body"
                _hover={{ color: "yellow.200" }}
              >
                Settings
              </Text>
            </Flex>
            <Flex
              fontSize={"sm"}
              display={sidebarSize === "small" ? "none" : "flex"}
            >
              <LogoutButton>
                <Text fontFamily="font.body" _hover={{ color: "yellow.200" }}>
                  Log Out
                </Text>
              </LogoutButton>
            </Flex>
          </Stack>
        </Flex>
      )}

      <Flex
        p="1rem"
        flexDir="column"
        w="100%"
        alignItems={sidebarSize === "small" ? "center" : "flex-start"}
        mb={5}
        align="center"
        display={sidebarSize === "small" ? "flex" : "none"}
      >
        <UserButton />
      </Flex>
    </Flex>
  );
}
