"use client";

import {
  Flex,
  Text,
  Icon,
  Link,
  Menu,
  MenuButton,
  Box,
} from "@chakra-ui/react";

export default function SidebarItem({
  icon,
  title,
  active,
  sidebarSize,
}: {
  icon: any;
  title: string;
  active: boolean;
  sidebarSize: string;
}) {
  const navigateToModule = "/admin/" + title.toLowerCase().replace(/\s+/g, "-");

  return (
    <Box
      mt={"1.4rem"}
      w="100%"
      alignItems={sidebarSize === "small" ? "center" : "left"}
      fontSize={"sm"}
      fontFamily={"font.body"}
    >
      <Menu placement="right">
        <Link
          href={navigateToModule}
          backgroundColor={active ? "brand.300" : "none"}
          p={3}
          borderRadius={8}
          _hover={{
            textDecor: "none",
            backgroundColor: active || "#688f6e",
            color: "white",
          }}
          w={sidebarSize}
        >
          <MenuButton w="100%">
            <Flex>
              <Icon
                as={icon}
                fontSize="xl"
                color={active ? "black" : "white"}
              />
              <Text
                textAlign={"left"}
                ml={5}
                display={sidebarSize === "small" ? "none" : "flex"}
                color={active ? "black" : "white"}
                fontWeight={active ? "bold" : "normal"}
              >
                {title}
              </Text>
            </Flex>
          </MenuButton>
        </Link>
      </Menu>
    </Box>
  );
}
