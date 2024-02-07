"use client";

import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

function SignInButton() {
  const [isButtonClicked, setButtonClicked] = useState(false);

  const handleClick = () => {
    if (!isButtonClicked) {
      setButtonClicked(true);
    }
  };

  return (
    <Button
      as={Link}
      href={"/login"}
      colorScheme="yellow"
      fontFamily="font.body"
      fontWeight={{ base: "650", md: "800" }}
      borderRadius="5"
      onClick={handleClick}
      disabled={isButtonClicked}
    >
      Sign in
    </Button>
  );
}

export default SignInButton;
