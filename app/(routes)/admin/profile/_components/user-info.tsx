"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ExtendedUser } from "@/next-auth";
import { Separator } from "@/components/ui/separator";
import { PersonalInfo, Property, Status, Vehicle } from "@prisma/client";
import { LuCar as Car } from "react-icons/lu";
import { useSession } from "next-auth/react";
import { useEffect, useState, useTransition } from "react";
import { getHouseMembers } from "@/server/actions/user-info";
import { FaHouseUser as HouseMember } from "react-icons/fa6";
import { Heading as ShadHeading } from "@/components/ui/heading";
import Link from "next/link";
import { FaUser as User } from "react-icons/fa";
import {
  Box,
  Flex,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  Spinner,
  Button,
  Heading,
  Avatar,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Image,
  Stack,
  Center,
} from "@chakra-ui/react";
import { CiSettings } from "react-icons/ci";

interface UserInfoProps {
  user: ExtendedUser;
  info: PersonalInfo;
  vehicles: Vehicle[];
  property: Property;
}

const UserInfo: React.FC<UserInfoProps> = ({
  user,
  info,
  vehicles,
  property,
}) => {
  // Page Title and Description
  const pageTitle = `My Profile`;
  const pageDescription = `Manage your profile in the system.`;

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();
  const [isEditButtonClicked, setEditButtonClicked] = useState(false);

  const [houseMembers, setHouseMembers] = useState<
    PersonalInfo[] | undefined
  >();

  useEffect(() => {
    startTransition(() => {
      update();

      getHouseMembers(user?.info?.address).then((data) => {
        if (data) {
          setHouseMembers(data?.users);
        }
      });
    });
  }, [update, user?.info?.address]);

  return isPending ? (
    <Flex justifyContent="center" alignItems="center" minHeight="100vh">
      <Spinner />
    </Flex>
  ) : (
    <Box zIndex={1}>
      <ShadHeading title={pageTitle} description={pageDescription} />
      {/* If logged in as Admin */}
      {info.position === "Admin" && (
        <Text>
          You are logged in as <strong>ADMIN</strong>. <br />
          You are granted full access to the system settings.
        </Text>
      )}
      <Flex
        justifyContent={"space-between"}
        flexDir={{ md: "column", lg: "row" }}
      >
        {/* Profile Information */}
        <Flex gap="1.5rem">
          {/* Member's Avatar */}
          <Avatar
            size="2xl"
            src={user?.info.imageUrl || user?.image || ""}
            bg="yellow.500"
            icon={<User />}
          />

          {/* Member's Name */}
          <Box mb={{ md: "2rem", lg: "0" }}>
            <Heading
              size="lg"
              fontFamily={"font.heading"}
              className="capitalize"
            >
              {`${info.firstName} ${info.lastName}`}
            </Heading>
            <Box fontFamily={"font.body"}>
              {/* Member's Position & Committee */}
              <Text fontSize={"24px"}>
                {info.position} {info.committee && ` | ${info.committee}`}
              </Text>
              {/* Member's Status */}
              <Text fontSize={"sm"} lineHeight={0.5} mt="1rem">
                Status:
              </Text>
              <Badge
                className={cn(
                  "mt-2 pr-3 pl-3 text-xl",
                  user.status === Status.ACTIVE
                    ? "bg-green-700"
                    : user.status === Status.DELINQUENT
                    ? "bg-red-700"
                    : user.status === Status.PENDING
                    ? "bg-yellow-600"
                    : "display-none"
                )}
              >
                {user.status}
              </Badge>
            </Box>
          </Box>
        </Flex>

        {/* Settings */}
        <Button
          as={Link}
          href="/admin/profile/settings"
          colorScheme="yellow"
          size="sm"
          leftIcon={<CiSettings fontSize="20px" />}
          isLoading={isEditButtonClicked}
          loadingText="Please wait"
          onClick={() => setEditButtonClicked(true)}
        >
          Settings
        </Button>
      </Flex>
      <Stack spacing={8} mt={8} pb={3} overflowY="auto" h="50vh">
        <Accordion defaultIndex={[1]} allowMultiple px="10px">
          {/* Member's Biography */}
          <AccordionItem p={1}>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="semibold"
                fontFamily="font.heading"
              >
                Biography
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              py={2}
              fontFamily="font.body"
              textAlign="justify"
              color={info.bio ? "initial" : "gray"}
            >
              {info.bio || "You have not set up your bio yet."}
            </AccordionPanel>
          </AccordionItem>
          {/* Personal Information */}
          <AccordionItem p={1}>
            <AccordionButton>
              <Box
                as="span"
                flex="1"
                textAlign="left"
                fontWeight="semibold"
                fontFamily="font.heading"
              >
                Personal Information
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4} fontFamily="font.body" textAlign="justify">
              <Table>
                <Tbody>
                  <Tr fontFamily="font.body">
                    <Td
                      px={3}
                      py={1}
                      fontFamily="font.body"
                      fontWeight="semibold"
                    >
                      House No. & Street:
                    </Td>
                    <Td px={0} py={1} fontFamily="font.body">
                      {property.address}
                    </Td>
                  </Tr>
                  <Tr fontFamily="font.body">
                    <Td
                      px={3}
                      py={1}
                      fontFamily="font.body"
                      fontWeight="semibold"
                    >
                      Contact Number:
                    </Td>
                    <Td px={0} py={1} fontFamily="font.body">
                      {info.phoneNumber}
                    </Td>
                  </Tr>
                  <Tr fontFamily="font.body">
                    <Td
                      px={3}
                      py={1}
                      fontFamily="font.body"
                      fontWeight="semibold"
                    >
                      Email Address:
                    </Td>
                    <Td px={0} py={1} fontFamily="font.body">
                      <a href={`mailto:${user.email}`} target="_blank">
                        {user.email}
                      </a>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        <SimpleGrid columns={2}>
          {/* Other Household Members */}
          <Box px={5}>
            <Text fontWeight="semibold" fontFamily={"font.heading"}>
              Other Household Members
            </Text>
            <Box
              h={40}
              border="1px solid lightgrey"
              borderRadius={5}
              p={3}
              fontFamily="font.body"
              overflowY="auto"
            >
              {houseMembers?.length ? (
                houseMembers?.map(
                  (member) =>
                    member.userId !== info.id && (
                      <div key={member.id}>
                        <div className="flex justify-between">
                          <div key={member.id} className="flex">
                            <HouseMember className="mt-2 mr-2" />{" "}
                            {`${member?.firstName} ${member?.lastName}`}
                          </div>
                          <div className="capitalize">
                            {`${member?.relation?.toLowerCase()}`} (
                            {`${member?.type}`})
                          </div>
                        </div>
                        <Separator className="my-2" />
                      </div>
                    )
                )
              ) : (
                <span className="text-gray-400">
                  No household members found.
                </span>
              )}
            </Box>
            {/* Vehicles Owned */}
            <Text fontWeight="semibold" fontFamily={"font.heading"} mt={3}>
              Vehicles Owned
            </Text>
            <Box
              h={40}
              border="1px solid lightgrey"
              borderRadius={5}
              p={3}
              fontFamily="font.body"
              overflowY="auto"
            >
              {vehicles.length ? (
                vehicles.map((vehicle) => (
                  <>
                    <div key={vehicle.id} className="flex">
                      <Car className="w-5 h-5 pt-1 mr-2" />
                      {vehicle.plateNum}
                    </div>
                    <Separator className="my-2" />
                  </>
                ))
              ) : (
                <span className="text-gray-400">No vehicles recorded.</span>
              )}
            </Box>
          </Box>
          {/* Government-Issued ID */}
          <Box px={5}>
            <Text fontWeight="semibold" fontFamily={"font.heading"}>
              Government-Issued ID
            </Text>
            <Center
              h={info.govtId ? "max-content" : 80}
              border="1px solid lightgrey"
              borderRadius={5}
              fontFamily="font.body"
              overflowY="auto"
              p={5}
            >
              {info.govtId ? (
                <Image
                  objectFit="contain"
                  src={info.govtId}
                  alt={`Government ID of ${user.name}`}
                />
              ) : (
                <span className="text-gray-400">
                  No government ID uploaded yet.
                </span>
              )}
            </Center>
          </Box>
        </SimpleGrid>
      </Stack>
    </Box>
  );
};

export default UserInfo;
