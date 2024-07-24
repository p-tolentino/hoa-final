"use client";

import { cn } from "@/lib/utils";
import { MdComputer as Logo } from "react-icons/md";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Spacer,
  Text,
  Show,
  Menu,
  MenuButton,
  MenuList,
  IconButton,
  MenuItem,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import SignInButton from "./SignInButton";

import { Button } from "../ui/button";
import { UserButton } from "../auth/user-button";
import { LogoutButton } from "../auth/logout-button";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname } from "next/navigation";
import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";
import { Hoa, UserRole } from "@prisma/client";

interface NavbarProps {
  existingHoa: Hoa | null;
}

export const Navbar: React.FC<NavbarProps> = ({ existingHoa }) => {
  const user = useCurrentUser();
  const role = user?.role === UserRole.ADMIN ? "admin" : "user";

  const pathname = usePathname();

  const navRoutes = [
    {
      label: "About",
      href: "/",
      active: pathname === `/#about`,
      requireAuth: false,
    },
    {
      label: "Register HOA",
      href: "/#registerHOA",
      active: pathname === `/#registerHOA`,
      requireAuth: false,
    },
    {
      label: "Contact Us",
      href: "/#contactUs",
      active: pathname === `/#contactUs`,
      requireAuth: false,
    },
    {
      label: `My Dashboard`,
      href: `/user/dashboard`,
      active: pathname.includes(`dashboard`),
      requireAuth: true,
    },
  ];

  return (
    <Flex
      as="nav"
      p="20px"
      alignItems="center"
      bg="brand.500"
      color="white"
      top="0"
      position="fixed"
      direction="row"
      width="100%"
    >
      <Link href="/">
        <Flex>
          <NextImage
            src={SystemLogo}
            alt="HOAs.is Logo"
            width={120}
            height={120}
          />
        </Flex>
      </Link>
      <Show breakpoint="(max-width: 767px)">
        <Spacer />
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            variant="outline"
            color="brand.300"
            position="absolute"
            right="0"
            mr="30px"
          />
          <MenuList color="black">
            {navRoutes.map((route) => {
              if (!user && route.requireAuth) {
                return null;
              }

              if (route.label === "Register HOA" && existingHoa) {
                return null;
              }

              return (
                <Link key={route.href} href={route.href}>
                  <MenuItem>{route.label}</MenuItem>
                </Link>
              );
            })}
            <Divider />
            {!user ? (
              <Link href="/login">
                <MenuItem>Sign in</MenuItem>
              </Link>
            ) : (
              <>
                <Link href={`/${user?.role.toLowerCase()}/settings`}>
                  <MenuItem>Settings</MenuItem>
                </Link>
                <LogoutButton>
                  <MenuItem>Logout</MenuItem>
                </LogoutButton>
              </>
            )}
          </MenuList>
        </Menu>
      </Show>
      <Show above="md">
        <Spacer />
        <HStack gap="10">
          {navRoutes.map((route) => {
            if (!user && route.requireAuth) {
              return null;
            }

            if (route.label === "Register HOA" && existingHoa) {
              return null;
            }

            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex justify-between transition-colors no-underline",
                  route.active
                    ? "text-[#F0CB5B]"
                    : "text-white hover:text-[#F0CB5B]"
                )}
              >
                <Button
                  variant="link"
                  className={cn(
                    "justify-start w-full",
                    route.active
                      ? "text-[#F0CB5B]"
                      : "text-white hover:text-[#F0CB5B]"
                  )}
                  style={{ textDecoration: "none" }}
                >
                  {route.label}
                </Button>
              </Link>
            );
          })}
        </HStack>
      </Show>
      <Spacer />
      <Show above="md">{!user ? <SignInButton /> : <UserButton />}</Show>
    </Flex>
  );
};
