"use client";
import { Box, Flex, Heading, Spacer, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import Link from "next/link";
import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";
import { Hoa } from "@prisma/client";

interface FooterProps {
  existingHoa: Hoa | null;
}

export const Footer: React.FC<FooterProps> = ({ existingHoa }) => {
  return (
    <Flex
      as="nav"
      bgColor="black"
      p="10px"
      color="white"
      bottom="0"
      direction={{ base: "column", md: "row" }}
      position="relative"
    >
      <Box px={{ base: "10", md: "20" }} p={{ md: "30px" }}>
        <Link href="/">
          <NextImage
            src={SystemLogo}
            alt="HOAs.is Logo"
            width={120}
            height={120}
          />
        </Link>
      </Box>
      <Spacer />
      <Flex
        direction="column"
        fontFamily="font.heading"
        fontSize={{ base: "9px", md: "10px" }}
        mt={{ base: "20px", md: "0" }}
        px={{ base: "10" }}
        py={{ base: "8px" }}
      >
        <Text
          py="5px"
          fontFamily="font.body"
          fontSize={{ base: "12px", md: "12px" }}
          fontWeight="bold"
        >
          HOME
        </Text>
        <Link href="/">ABOUT</Link>
        {!existingHoa && <Link href="/#registerHOA">REGISTER HOA</Link>}
        <Link href="/#contactUs">CONTACT US</Link>
      </Flex>
      <Spacer />
      <Flex
        fontFamily="font.heading"
        fontWeight="normal"
        fontSize={{ base: "9px", md: "10px" }}
        direction="column"
        px={{ base: "10" }}
        py={{ base: "8px" }}
        mr={{ base: "0", md: "50px" }}
      >
        <Text
          py="5px"
          fontFamily="font.body"
          fontSize={{ base: "12px", md: "12px" }}
          fontWeight="bold"
        >
          CONTACT INFO
        </Text>
        <Text as="a" href="mailto:hoas.is@gmail.com">
          <Icon as={EmailIcon} /> hoas.is@gmail.com
        </Text>
      </Flex>
    </Flex>
  );
};
