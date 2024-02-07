"use client";

import { cn } from "@/lib/utils";
import { MdComputer as Logo } from "react-icons/md";
import {
  Link,
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
import SignInButton from "./SignInButton";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useCurrentUser } from "@/hooks/use-current-user";
import { UserButton } from "../auth/user-button";
import { UserRole } from "@prisma/client";
import { useParams, usePathname } from "next/navigation";
import { LogoutButton } from "../auth/logout-button";
import { Button } from "../ui/button";

export const Navbar = () => {
  const user = useCurrentUser();

  const pathname = usePathname();
  const params = useParams();

  const navRoutes = [
    {
      label: "About",
      href: "/#about",
      active: pathname === `/#about`,
    },
    {
      label: "Register HOA",
      href: "/#registerHOA",
      active: pathname === `/#registerHOA`,
    },
    {
      label: "Terms and Conditions",
      href: "",
      active: pathname === ``,
    },
    {
      label: "Contact Us",
      href: "/#contactUs",
      active: pathname === `/#contactUs`,
    },
    {
      label: "Dashboard",
      href: user?.role === UserRole.ADMIN ? "/admin" : "/user",
      active: pathname === `/admin` || pathname === `/user`,
    },
  ];

  return (
    <Flex
      as="nav"
      p="20px"
      alignItems="center"
      bg="brand.500"
      color="white"
      pos="sticky"
      top="0"
      direction="row"
    >
      <Flex>
        <Heading ml="10px" color="white" size={{ base: "xl", md: "xl" }}>
          <Logo />
        </Heading>
        <Box ml="20px">
          <Heading paddingTop="5px" fontSize={{ base: "9px", md: "md" }}>
            <Text as="a" rel="noopener" href="/" fontFamily="font.heading">
              System Name
            </Text>
          </Heading>
        </Box>
      </Flex>
      <Show breakpoint="(max-width: 767px)">
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<HamburgerIcon />}
            ml="200px"
            variant="outline"
            color="brand.300"
          />
          <MenuList color="black">
            {navRoutes.map((route) => (
              <Link key={route.href} href={route.href}>
                <MenuItem>{route.label}</MenuItem>
              </Link>
            ))}
            <Divider />
            {!user ? (
              <MenuItem as="a" rel="noopener" href="login">
                Sign in
              </MenuItem>
            ) : (
              <>
                <Link
                  href={
                    user?.role === UserRole.ADMIN
                      ? "/admin/settings"
                      : "/user/settings"
                  }
                >
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
          {navRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex justify-between transition-colors",
                route.active
                  ? "text-[#F0CB5B]"
                  : "text-white hover:text-[#F0CB5B]"
              )}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="link"
                className={cn(
                  "justify-start w-full",
                  route.active
                    ? "text-[#F0CB5B]"
                    : "text-white hover:text-[#F0CB5B]"
                )}
              >
                {route.label}
              </Button>
            </Link>
          ))}
        </HStack>
      </Show>
      <Spacer />
      <Show above="md">{!user ? <SignInButton /> : <UserButton />}</Show>
    </Flex>
  );
};
