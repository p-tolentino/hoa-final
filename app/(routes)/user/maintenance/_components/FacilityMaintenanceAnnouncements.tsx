"use client";

import React from "react";
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Heading,
  Box,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Text,
  Stack,
  Badge,
  Flex,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { PiBroom } from "react-icons/pi";
import {
  Facility,
  MaintenanceNotice,
  MaintenanceSchedule,
  PersonalInfo,
  RegularMaintainService,
} from "@prisma/client";
import { convertTimeTo12HourFormat } from "../regular-maintenance/_components/schedule-list";
import { Separator } from "@/components/ui/separator";

type MaintenanceScheduleWithService = MaintenanceSchedule & {
  service: RegularMaintainService;
};

export default function FacilityMaintenanceAnnouncements({
  officers,
  notices,
  schedules,
  facilities,
}: {
  officers: PersonalInfo[] | null | undefined;
  notices: MaintenanceNotice[] | null | undefined;
  schedules: MaintenanceScheduleWithService[] | null | undefined;
  facilities: Facility[] | null | undefined;
}) {
  const noticeAnnouncements = [
    {
      dateAnnounced: "MMMM dd, yyyy",
      officerAssigned: "Lourdes Torres",
      committeeOfOfficer: "Environment & Santiation Committee",
      title: "#M0007 Maintenance Notice: Lighting and Utilities",
      location: "1-D Rose Street, Emerald Village, Taguig City",
      startDate: "July 22, 2024",
      startTime: "8:30 AM",
      endDate: "July 24, 2024",
      endTime: "5:30 PM",
      description:
        "During this period, our maintenance team will be conducting a thorough inspection, assessment, and repair of the non-functional streetlight located at 1-D Rose Street. The activities will include the initial inspection and assessment on July 22, procurement of the required materials on July 23, and the repair and testing of the streetlight on July 24.",
    },
  ];

  const action = "View Facility Maintenance Announcement Board";
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formatDays = (days: string) => {
    const dayList = days.split(",");
    if (dayList.length === 1) return `Every ${dayList[0]}`;
    if (dayList.length === 2) return `Every ${dayList.join(" and ")}`;
    if (dayList.length === 7) return `Everyday`;
    return `Every ${dayList.slice(0, -1).join(", ")}, and ${
      dayList[dayList.length - 1]
    }`;
  };

  return (
    <>
      <Button
        fontFamily="font.body"
        onClick={onOpen}
        key={action}
        colorScheme="green"
        variant="ghost"
      >
        {action}
      </Button>

      <Drawer isOpen={isOpen} onClose={onClose} placement="right" size="md">
        <DrawerOverlay />
        <DrawerContent p={2} bg="brand.400">
          <DrawerCloseButton />
          <DrawerHeader mt="10px" pb={0}>
            <Stack spacing={1}>
              <Heading
                fontSize="2xl"
                fontFamily="font.heading"
                color="brand.500"
              >
                Facility Maintenance Announcement Board
              </Heading>
              <Text fontSize="sm" color="grey" fontWeight="normal">
                View all maintenance activities scheduled for all facilities
                within the Homeowners' Association.
              </Text>
            </Stack>
          </DrawerHeader>
          <DrawerBody overflowY="auto">
            <Box mb="2rem" fontFamily="font.body" py={3}>
              {schedules?.map((schedule, index) => (
                <Box p={3} key={index} borderTop="0.5px solid lightgrey">
                  <Icon as={PiBroom} color="brand.500" mr={1} />
                  <span className="font-bold text-sm text-[#355E3B]">
                    {
                      facilities?.find(
                        (facility) =>
                          facility.id === schedule?.service.facilityId
                      )!!.name
                    }
                  </span>
                  <Text fontWeight="semibold" fontSize="lg">
                    {schedule?.service.title}
                  </Text>{" "}
                  <Text>{formatDays(schedule.days)}</Text>
                  <Text>
                    {convertTimeTo12HourFormat(schedule.startTime)} -{" "}
                    {convertTimeTo12HourFormat(schedule.endTime)}
                  </Text>
                </Box>
              ))}

              <Separator className="my-5 bg-gray-800" />
              <Accordion allowToggle mb={3}>
                {notices?.map((announcement, index) => {
                  const [maintenanceNumber, maintenanceService] =
                    announcement.subject.split(":");
                  return (
                    <AccordionItem py={2} key={index}>
                      <AccordionButton
                        bg="red.50"
                        border="1px solid red"
                        _hover={{ bg: "red.100" }}
                        _expanded={{ bg: "red.100" }}
                        borderRadius="md"
                      >
                        <Box as="span" flex="1" textAlign="left">
                          <Badge fontSize="xs" colorScheme="red" mb={2}>
                            {maintenanceNumber.trim()}
                          </Badge>
                          <Box>
                            <Icon as={PiBroom} color="red.700" mr={1} />
                            <span className="font-bold text-sm text-red-800">
                              {announcement.location}
                            </span>
                          </Box>
                          <Text fontWeight="semibold" fontSize="lg">
                            {maintenanceService.trim()}
                          </Text>
                          <Text>
                            {announcement.startDate.toDateString()}{" "}
                            {announcement.startTime} -{" "}
                            {announcement.endDate.toDateString()}{" "}
                            {announcement.endTime}
                          </Text>
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel
                        mt={3}
                        pb={4}
                        textAlign="justify"
                        h="200px"
                        overflowY="auto"
                      >
                        <Stack spacing={3}>
                          <Flex justifyContent="space-between">
                            <Text>Greetings Homeowners!</Text>
                            <Text color="grey">
                              {announcement.createdAt.toLocaleDateString()}
                            </Text>
                          </Flex>
                          <Text>
                            As part of the continuous effort to improve our
                            services, please be advised of the following
                            scheduled maintenance activity:
                          </Text>
                          <UnorderedList fontSize="xs">
                            {/* Location */}
                            <ListItem>
                              Location:{" "}
                              <span className="font-semibold">
                                {announcement.location}
                              </span>
                            </ListItem>
                            {/* Date of Maintenance */}
                            <ListItem>
                              Duration:{" "}
                              <span className="font-semibold">
                                {announcement.startDate.toDateString()}{" "}
                                {announcement.startTime} -{" "}
                                {announcement.endDate.toDateString()}{" "}
                                {announcement.endTime}
                              </span>
                            </ListItem>
                            {/* Maintenance Type */}
                            <ListItem>
                              Maintenance Service:{" "}
                              <span className="font-semibold">
                                {maintenanceService.trim()}
                              </span>
                            </ListItem>
                            {/* Penalty Fee */}
                          </UnorderedList>
                          <Box>{announcement.description}</Box>
                          <Text>
                            We apologize for any inconvenience this may cause
                            and appreciate your understanding and cooperation.
                          </Text>
                          <Text mt={2}>Sincerely,</Text>
                          <Box>
                            <Text>
                              {officers
                                ? officers.find(
                                    (info) =>
                                      info.userId === announcement.sender
                                  )?.firstName +
                                  " " +
                                  officers.find(
                                    (info) =>
                                      info.userId === announcement.sender
                                  )?.lastName
                                : `HOA Admin Office`}
                            </Text>
                            <Text color="grey">
                              Environment & Sanitation Committee
                            </Text>
                          </Box>
                        </Stack>
                      </AccordionPanel>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
