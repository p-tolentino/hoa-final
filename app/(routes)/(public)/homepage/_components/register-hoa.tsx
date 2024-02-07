"use client";

import { Box, Stack, Text, Button, Heading } from "@chakra-ui/react";

export const RegisterHOA = () => {
  return (
    <Box id="registerHOA" m={"3rem"}>
      <Stack>
        <Text
          fontFamily="font.body"
          textAlign="center"
          fontWeight="800"
          fontSize="18px"
          mt="60"
          mb="-5"
        >
          Want to use *System Name*?
        </Text>
        <Heading
          size="xl"
          fontFamily="font.heading"
          p="20px"
          textAlign="center"
          color="brand.500"
          textShadow="2px 2px #CBD5E0"
        >
          Register your Homeowners Association now!
        </Heading>
        <Button
          as="a"
          pos={"static"}
          alignSelf="center"
          width="300px"
          variant="solid"
          colorScheme="yellow"
          fontFamily="font.body"
          fontWeight={{ base: "650", md: "800" }}
          fontSize={{ base: "10px", md: "14px" }}
          borderRadius={10}
          marginTop="3"
        >
          Click here to Register
        </Button>
      </Stack>
    </Box>
  );
};
