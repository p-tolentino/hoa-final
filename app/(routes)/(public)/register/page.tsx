import { Box } from "@chakra-ui/react";
import { RegisterForm } from "./_components/register-form";
import { getAllProperties } from "@/server/data/property";

export default async function SignUp() {
  const properties = await getAllProperties();

  if (!properties) {
    return null;
  }

  return (
    <Box mt="8%" h="100vh">
      <RegisterForm properties={properties} />
    </Box>
  );
}
