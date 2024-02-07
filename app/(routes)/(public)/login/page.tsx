import { Flex, Box, Image } from "@chakra-ui/react";

import LoginForm from "./_components/login-form";

export default function SignIn() {
  return (
    <Box>
      <Flex justify="space-between">
        <Box w="50vw" h="100vh" verticalAlign="left">
          <LoginForm />
        </Box>
        <Box w="50vw" height="100vh" right="0">
          <Image src="/subdivision.jpg" alt="Subdivision" h={"100%"} />
        </Box>
      </Flex>
    </Box>
  );
}
