"use client";

import { Text, Heading, Stack, Wrap, WrapItem } from "@chakra-ui/react";
import { TbCurrencyPeso } from "react-icons/tb";
import { FiBriefcase, FiCalendar, FiUserCheck, FiUsers } from "react-icons/fi";
import { PiBinocularsBold, PiBroomFill } from "react-icons/pi";
import { BsNewspaper } from "react-icons/bs";

export const About = () => {
  return (
    <Wrap spacing="30px" justify="center" mt="2rem">
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <FiUserCheck size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Membership
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Membership aims to provide a centralized repository for the board
            members and officers to store and monitor essential homeowner
            information and to manage property information within the homeowners
            association. As for the homeowners, this module will allow them to
            create and manage their profiles and information.
          </Text>
        </Stack>
      </WrapItem>
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          minW="20vw"
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <TbCurrencyPeso size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Finance Management
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Finance Management streamlines the financial processes of due
            collection and tracking, simple accounting, budget planning, reserve
            fund management, and generation of financial-related documents. It
            provide stakeholders with adequate information to assist in the
            effectiveness of the operational and financial decision-making of
            the association.
          </Text>
        </Stack>
      </WrapItem>
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          minW="20vw"
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <FiUsers size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Community Engagement
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Community Engagement aims to provide a platform for the
            dissemination of crucial information, such as meeting details,
            election schedules, and other matters within the homeowners
            association, as well as promote harmony and disaster preparedness
            within the community.
          </Text>
        </Stack>
      </WrapItem>
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          minW="20vw"
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <FiBriefcase size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Dispute Resolution
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Dispute Resolution aims to streamline a structured process of
            tracking and resolving disputes, providing a centralized platform
            for efficient management. It enables committee members to
            efficiently review, analyze, and decide on the appropriate course of
            action and foster a fair and just environment.
          </Text>
        </Stack>
      </WrapItem>
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          minW="20vw"
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <PiBinocularsBold size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Violation Monitoring
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Violation Monitoring aims to establish a systematic and transparent
            process for tracking, managing, and addressing violations within the
            community. This involves enforcing the stipulated penalty fees as
            outlined in the registered homeowners&apos; association bylaws,
            ensuring consistent enforcement of community policies and
            regulations.
          </Text>
        </Stack>
      </WrapItem>
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          minW="20vw"
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <FiCalendar size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Facility Reservation
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Facility Reservation streamlines and enhances the process of
            reserving community facilities within Homeowners Associations. It
            aims to provide homeowners with a simplified and user-friendly
            reservation process.
          </Text>
        </Stack>
      </WrapItem>
      <WrapItem
        w={{ sm: "80vw", md: "40vw", lg: "22vw" }}
        h={{ sm: "35vh", md: "55vh", lg: "60vh", xl: "50vh" }}
      >
        <Stack
          direction={"column"}
          minW="20vw"
          borderRadius={"1rem"}
          borderColor={"grey.05"}
          borderWidth={"2px"}
          p="1rem 1rem 1.5rem 1rem"
          alignItems={"center"}
          textAlign={"center"}
          h="100%"
        >
          <BsNewspaper size="25%" color="#355E3B" />
          <Heading size="sm" fontFamily="font.heading">
            Election Management
          </Heading>
          <Text
            fontSize={"14px"}
            fontFamily="font.body"
            textAlign="justify"
            pr="10px"
            pl="10px"
          >
            Election Management introduces an online voting platform, allowing
            homeowners to nominate and vote for potential candidates. It allows
            homeowners to gain insights into candidates by accessing detailed
            profiles, credentials, and campaign platforms.
          </Text>
        </Stack>
      </WrapItem>
    </Wrap>
  );
};
