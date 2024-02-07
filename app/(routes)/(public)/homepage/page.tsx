"use client";

import { Text, Heading, Stack, Center, Box, Flex } from "@chakra-ui/react";
import { About } from "./_components/about";
import { Contact } from "./_components/contact";
import { RegisterHOA } from "./_components/register-hoa";
import PublicLayout from "../../layout";

export default function Homepage() {
  return (
    <PublicLayout>
      <Box>
        <Center
          h="30vh"
          bgSize={"cover"}
          bgImage={`url("/landscapeLowerOpacity.png")`}
        >
          <Flex bgColor={"rgba(255, 255, 255, 0.6)"}>
            <Stack
              direction={"column"}
              alignItems={"center"}
              textAlign={"center"}
              p="2rem"
            >
              <Heading size={"2xl"} fontFamily="font.heading">
                System Name
              </Heading>
              <Text
                fontFamily="font.body"
                fontSize="1.5rem"
                textAlign={"center"}
                textShadow="1px 1px grey.05"
              >
                A Management Information System (MIS) for Homeowners'
                Associations in the Philippines.
              </Text>
            </Stack>
          </Flex>
        </Center>
        <About />
        <RegisterHOA />
        <Contact />
      </Box>
    </PublicLayout>
  );
}
