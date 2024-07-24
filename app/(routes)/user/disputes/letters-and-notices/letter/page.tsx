"use client";

import {
  Box,
  Text,
  Button,
  Stack,
  Flex,
  UnorderedList,
  ListItem,
  Spinner,
  ButtonGroup,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { getLetterById } from "@/server/data/letter-notice";
import {
  Dispute,
  DisputeType,
  Hoa,
  Letter,
  PersonalInfo,
} from "@prisma/client";
import { getAllInfo, getInfoById } from "@/server/data/user-info";
import { getDisputeById } from "@/server/data/dispute";
import BackButton from "@/components/system/BackButton";
import { getDisputeTypeById } from "@/server/data/dispute-type";
import { useReactToPrint } from "react-to-print";
import { FaFilePdf } from "react-icons/fa";
import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";

interface DisputeLetterProps {
  hoaInfo: Hoa;
}

const DisputeLetter: React.FC<DisputeLetterProps> = ({ hoaInfo }) => {
  const searchParams = useSearchParams();
  const [letter, setLetter] = useState<Letter | null>();
  const [recipient, setRecipient] = useState<PersonalInfo | null>();
  const [sender, setSender] = useState<PersonalInfo | null>();
  const [dispute, setDispute] = useState<Dispute | null>();
  const [disputeType, setDisputeType] = useState<DisputeType | null>();
  const [userInvolved, setUserInvolved] = useState<PersonalInfo | null>();

  const [isPending, startTransition] = useTransition();

  const letterId = searchParams.get("letterId");
  const disputeId = searchParams.get("disputeId");

  useEffect(() => {
    startTransition(() => {
      const fetchData = async () => {
        if (letterId) {
          await getLetterById(letterId).then((data) => {
            if (data) {
              setLetter(data);
              getInfoById(data.recipient).then((data) => {
                setRecipient(data);
              });

              getInfoById(data.sender).then((data) => {
                setSender(data);
              });
            }
          });
        }

        if (disputeId) {
          await getDisputeById(disputeId).then((data) => {
            if (data) {
              setDispute(data);
              getDisputeTypeById(data.type).then((data) => {
                setDisputeType(data);
              });

              getAllInfo().then((res) => {
                if (res) {
                  setUserInvolved(
                    res.find((info) => data?.personComplained === info.userId)
                  );
                }
              });
            }
          });
        }
      };

      fetchData();
    });
  }, [disputeId, letterId]);

  const componentPDF = useRef<HTMLDivElement | null>(null);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null,
    documentTitle: `#D${dispute?.number.toString().padStart(4, "0")} Dispute
            Resolution Meeting Letter 📅`,
  });

  // Report Title and Description
  const reportTitle = `#D${dispute?.number
    .toString()
    .padStart(4, "0")} Dispute Resolution
            Meeting Letter`;
  const reportSubtitle = `This dispute letter is addressed to ${recipient?.firstName}
            ${recipient?.lastName} from the Homeowners' Association.`;

  return isPending ? (
    <Flex justifyContent="center" alignItems="center" minHeight="100vh">
      <Spinner />
    </Flex>
  ) : (
    <div>
      <Flex justifyContent="flex-end">
        <ButtonGroup>
          <Button
            size="sm"
            variant="outline"
            colorScheme="orange"
            leftIcon={<FaFilePdf />}
            onClick={generatePDF}
          >
            Generate PDF
          </Button>
          <BackButton />
        </ButtonGroup>
      </Flex>
      <Box
        h="80vh"
        overflowY="auto"
        border="1px solid lightgrey"
        borderRadius="md"
        p={3}
        mt={5}
      >
        <Box ref={componentPDF}>
          <Stack spacing={3}>
            {/* Report Header */}
            <Flex
              bg="brand.500"
              color="brand.400"
              h="70px"
              p={2}
              gap={3}
              className="report-header"
            >
              <NextImage
                src={SystemLogo}
                alt="HOAs.is Logo"
                width={100}
                height={70}
                className="m-2"
              />
              {hoaInfo && (
                <Box m={2} lineHeight={1.1}>
                  <Text
                    fontSize="lg"
                    fontFamily="font.heading"
                    fontWeight="bold"
                  >
                    {hoaInfo?.name}
                  </Text>
                  <Flex gap={10}>
                    <Flex fontFamily="font.body" gap={3}>
                      <span>Contact Number: </span>
                      {hoaInfo?.contactNumber}
                    </Flex>
                  </Flex>
                </Box>
              )}
            </Flex>
            <Box className="report-content" alignSelf="center">
              {/* Report Title, Subtitle, and Date */}
              <Box mt={5} mb={3}>
                <Heading
                  fontSize="xl"
                  textAlign="center"
                  fontFamily="font.heading"
                >
                  {reportTitle}
                </Heading>
                <Text
                  fontSize="md"
                  textAlign="center"
                  color="gray.600"
                  fontFamily="font.body"
                >
                  {reportSubtitle}
                </Text>
                {/* <Text
                      fontSize='sm'
                      textAlign='center'
                      color='gray.500'
                      fontFamily='font.body'
                      mt={1}
                    >
                      {reportDate}
                    </Text> */}
              </Box>

              <Stack
                spacing={5}
                fontFamily="font.body"
                fontSize="md"
                mt={7}
                mx={5}
              >
                <Flex justifyContent="space-between">
                  {/* Recipient */}
                  <Text>
                    Dear{" "}
                    <span className="font-bold">
                      {recipient?.firstName} {recipient?.lastName}
                    </span>
                    ,
                  </Text>
                  {/* Date Received */}
                  <Text fontWeight="bold">
                    {letter?.createdAt
                      ? format(
                          new Date(letter?.createdAt + "Z")
                            ?.toISOString()
                            .split("T")[0],
                          "MMMM dd, yyyy"
                        )
                      : ""}
                  </Text>
                </Flex>

                <Text textAlign="justify">
                  We are writing to inform you that you are hereby summoned to
                  attend a meeting scheduled to address and deliberate on the
                  resolution of an ongoing{" "}
                  <span className="font-bold">dispute</span>.
                </Text>

                {/* Dispute Details */}
                <Box>
                  <Text>Dispute Details:</Text>
                  <Flex gap="50px">
                    <UnorderedList ml={7}>
                      {/* Date of Dispute */}
                      <ListItem>
                        Date of Dispute:{" "}
                        <span className="font-semibold">
                          {dispute?.disputeDate
                            ? format(
                                new Date(dispute?.disputeDate)
                                  ?.toISOString()
                                  .split("T")[0],
                                "MMMM dd, yyyy"
                              )
                            : ""}
                        </span>
                      </ListItem>
                      {/* Dispute Type */}
                      <ListItem>
                        Dispute Type:{" "}
                        <span className="font-semibold">
                          {disputeType?.title}
                        </span>
                      </ListItem>
                    </UnorderedList>
                  </Flex>
                </Box>

                {/* Description */}
                <Text
                  textAlign="justify"
                  mb={2}
                  as="i"
                  color="grey"
                  fontSize="lg"
                >
                  &quot; {letter?.description} &quot;
                </Text>

                {/* Meeting Details */}
                <Box>
                  <Text textAlign="justify">
                    The meeting has been scheduled for {/* Meeting Time */}
                    <span className="font-bold text-red-500">
                      {letter &&
                        format(
                          new Date(`${letter?.meetDate}`),
                          "MMMM dd, yyyy, h:mm aa"
                        )}
                    </span>{" "}
                    at the {/* Meeting Venue */}
                    <span className="font-bold text-red-500">
                      HOA Admin Office
                    </span>
                    {". "}
                    Please inform us if you are available on the said date{". "}
                    <span className="text-gray-500">
                      (You may find our contact information in the{" "}
                      <Link
                        href="/user/membership/admin-directory"
                        className="text-blue-500 hover:underline"
                      >
                        Admin & Board of Directors Directory
                      </Link>{" "}
                      of the Membership module)
                    </span>
                    .
                  </Text>
                </Box>

                <Text textAlign="justify">
                  Your presence is crucial for resolving this matter and
                  maintaining a positive relationship with our organization.
                  Details of the dispute and proposed resolutions will be
                  discussed. Please come prepared to express your perspective
                  and work towards a resolution.
                </Text>

                <Text textAlign="justify">
                  Please refer to the{" "}
                  <Link
                    href="/user/disputes/process-guide"
                    className="text-blue-500 hover:underline"
                  >
                    Dispute Resolution Process Guide
                  </Link>{" "}
                  for further information on the overall process of resolving
                  this dispute.
                </Text>

                <Text>Thank you for your cooperation.</Text>

                <Text textAlign="justify" mt={5}>
                  Sincerely,
                </Text>
                {/* Sender's Name and Position */}
                <Box mb={10}>
                  <Text>
                    {sender?.firstName} {sender?.lastName}
                  </Text>
                  <Text color="grey">{sender?.committee}</Text>
                </Box>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default DisputeLetter;
