"use client";

import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Heading,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Hoa } from "@prisma/client";

export default function ViolationBylaws({ hoa }: { hoa: Hoa }) {
  const title = "Homeowners' Association Bylaws (Violation Section)";
  const description =
    "View the violation section of the Homeowners' Association Bylaws.";

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Link
        fontFamily="font.body"
        onClick={() => {
          hoa?.byLawsLink
            ? onOpen()
            : toast({
                title: "HOA Bylaws has not been uploaded yet",
                description: "Kindly contact any of the Hoa Officers",
                status: "info",
                position: "bottom-right",
                isClosable: true,
              });
        }}
        color="blue.500"
        size="sm"
        textDecoration="underline"
      >
        Homeowners&apos; Association Bylaws
      </Link>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="xl">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader mt="10px">
            <Heading size="md" fontFamily="font.heading">
              {title}
            </Heading>
            <Text fontSize="xs">{description}</Text>
          </DrawerHeader>
          <DrawerBody>
            {hoa?.byLawsLink ? (
              <iframe
                src={hoa.byLawsLink}
                title="HOA Bylaws (Violation Section)"
                width="100%"
                height="900px"
              />
            ) : (
              <Text fontFamily="font.body">No bylaws available</Text>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
