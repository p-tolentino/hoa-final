"use client";

import { Heading } from "@/components/ui/heading";
import { Facility } from "@prisma/client";
import { DeleteButton } from "./_components/DeleteButton";
import { getFacilities } from "@/server/data/facilities";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";
import Link from "next/link";
import BackButton from "@/components/system/BackButton";
import AddNewFacilityButton from "./_components/AddFacilityButton";
import EditFacilityButton from "./_components/EditFacilityButton";
import {
  Box,
  Text,
  Button,
  Card,
  CardBody,
  Stack,
  Divider,
  CardFooter,
  Image,
  Grid,
  GridItem,
  ButtonGroup,
  CardHeader,
  Flex,
} from "@chakra-ui/react";

export default function ListofFacilities() {
  // Page Title and Description
  const pageTitle = `Reserve a Facility`;
  const pageDescription = `Reserve from the list of facilities available in the Homeowners' Association.`;

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const fetchedFacilities = await getFacilities();
        if (fetchedFacilities) setFacilities(fetchedFacilities);
      } catch (error) {
        console.error("Failed to fetch facilities:", error);
        // Optionally, handle error state here (e.g., set an error message in state and display it)
      }
    }
    fetchFacilities();
  }, [facilities]);

  const isPdf = (url: string) => {
    return url.toLowerCase().endsWith(".pdf");
  };

  // Function to sort facilities alphabetically by name
  const sortedFacilities = facilities.slice().sort((a, b) => {
    const nameA = a.name.toUpperCase(); // Ignore upper and lowercase
    const nameB = b.name.toUpperCase(); // Ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    return 0;
  });

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numericAmount);
  };

  return (
    <>
      <Heading
        title={pageTitle}
        description={pageDescription}
        rightElements={
          <ButtonGroup>
            {user?.info.position !== "Member" && <AddNewFacilityButton />}
            <BackButton />
          </ButtonGroup>
        }
      />

      <Grid templateColumns="repeat(3, 1fr)" gap={6} mt={5}>
        {sortedFacilities.map((card) => (
          <GridItem colSpan={1} key={card.id}>
            <Card key={card.id} w="100%" h="100%">
              <CardHeader>
                {user?.info.position !== "Member" && (
                  <Box textAlign="right" mb={3}>
                    <ButtonGroup>
                      <EditFacilityButton facility={card} />
                      <DeleteButton facility={card} />
                    </ButtonGroup>
                  </Box>
                )}
                <Text fontWeight="bold" fontSize="lg" fontFamily="font.heading">
                  {card.name}
                </Text>
              </CardHeader>
              <CardBody pt={0}>
                {card.mediaLink && (
                  <Box mb={5}>
                    {isPdf(card.mediaLink) ? (
                      <Box
                        h="200px"
                        w="100%"
                        borderRadius="md"
                        bg="lightgray"
                        p={5}
                        textAlign="center"
                        alignContent="center"
                        fontFamily="font.body"
                      >
                        <Text>This media is not available.</Text>
                        <a
                          href={card.mediaLink}
                          className="text-sm text-blue-500 hover:underline"
                          target="_blank" // Open the link in a new tab
                        >
                          View PDF
                        </a>
                      </Box>
                    ) : (
                      <Image
                        src={card.mediaLink}
                        alt="Post media"
                        h="200px"
                        w="100%"
                        objectFit="cover"
                        borderRadius="md"
                      />
                    )}
                  </Box>
                )}

                <Divider />
                <Text
                  fontSize="sm"
                  fontFamily="font.body"
                  textAlign="justify"
                  my={3}
                >
                  {card.description}
                </Text>
                <Stack spacing={2} lineHeight={1.2}>
                  <Box>
                    <Text fontSize="xs" color="grey" fontFamily="font.body">
                      Hourly Rate:
                    </Text>
                    <Text
                      fontSize="md"
                      fontFamily="font.heading"
                      fontWeight="semibold"
                    >
                      {formatCurrency(card.hourlyRate)}
                    </Text>
                  </Box>

                  <Box>
                    <Text fontSize="xs" color="grey" fontFamily="font.body">
                      Location:
                    </Text>
                    <Text
                      fontSize="md"
                      fontFamily="font.heading"
                      fontWeight="semibold"
                    >
                      {card.address}
                    </Text>
                  </Box>
                </Stack>
              </CardBody>
              <CardFooter pt={2}>
                <Flex w="100%" justifyContent="flex-end">
                  <ButtonGroup>
                    <Button
                      variant="solid"
                      size="sm"
                      colorScheme="yellow"
                      fontFamily="font.heading"
                      as={Link}
                      href={`/user/facility/reservation-form/${card.id}`}
                    >
                      Reserve
                    </Button>
                  </ButtonGroup>
                </Flex>
              </CardFooter>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </>
  );
}
