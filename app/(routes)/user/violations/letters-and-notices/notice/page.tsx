"use client";

import {
  Box,
  Text,
  Stack,
  Flex,
  UnorderedList,
  ListItem,
  Spinner,
  Button,
  ButtonGroup,
  Heading,
} from "@chakra-ui/react";
import Link from "next/link";
import { format, addDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { getNoticeById } from "@/server/data/letter-notice";
import {
  Hoa,
  Notice,
  PersonalInfo,
  Violation,
  ViolationType,
} from "@prisma/client";
import { getInfoById } from "@/server/data/user-info";
import { getViolationTypeById } from "@/server/data/violation-type";
import { getViolationById } from "@/server/data/violation";
import BackButton from "@/components/system/BackButton";
import { useReactToPrint } from "react-to-print";
import { FaFilePdf } from "react-icons/fa";
import NextImage from "next/image";
import SystemLogo from "@/public/HOAs.is-logo.png";

interface ViolationNoticeProps {
  hoaInfo: Hoa;
}

const ViolationNotice: React.FC<ViolationNoticeProps> = ({ hoaInfo }) => {
  const searchParams = useSearchParams();

  const [notice, setNotice] = useState<Notice | null>();
  const [recipient, setRecipient] = useState<PersonalInfo | null>();
  const [sender, setSender] = useState<PersonalInfo | null>();
  const [violation, setViolation] = useState<Violation | null>();
  const [violationType, setViolationType] = useState<ViolationType | null>();

  const [isPending, startTransition] = useTransition();

  const noticeId = searchParams.get("noticeId");
  const violationId = searchParams.get("violationId");
  const violationTypeId = searchParams.get("violationTypeId");

  useEffect(() => {
    startTransition(() => {
      const fetchData = async () => {
        if (noticeId) {
          await getNoticeById(noticeId).then((data) => {
            if (data) {
              setNotice(data);
              getInfoById(data.recipient).then((data) => {
                setRecipient(data);
              });

              getInfoById(data.sender).then((data) => {
                setSender(data);
              });
            }
          });
        }

        if (violationId) {
          await getViolationById(violationId).then((data) => {
            setViolation(data);
          });
        }

        if (violationTypeId) {
          await getViolationTypeById(violationTypeId).then((data) => {
            setViolationType(data);
          });
        }
      };

      fetchData();
    });
  }, [noticeId, violationId, violationTypeId]);

  const withinNumDays = 14; // cam be adjusted by admin
  const deadline = notice?.createdAt
    ? format(
        addDays(new Date(notice?.createdAt), withinNumDays),
        "MMMM dd, yyyy"
      )
    : "";

  const componentPDF = useRef<HTMLDivElement | null>(null);

  const generatePDF = useReactToPrint({
    content: () => componentPDF.current || null,
    documentTitle: `#V${violation?.number
      .toString()
      .padStart(4, "0")} Violation Notice`,
    // onAfterPrint: () => alert("Data saved in PDF"),
  });

  // Report Title and Description
  const reportTitle = `#V${violation?.number
    .toString()
    .padStart(4, "0")} Violation Notice`;
  // const reportSubtitle = `This violation notice is addressed to ${recipient?.firstName} ${recipient?.lastName} from the Homeowners' Association.`
  const reportSubtitle = `This violation notice is from the Homeowners' Association.`;

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numericAmount);
  };

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
                  {/* <Text>
                  Dear{' '}
                  <span className='font-bold'>
                    {recipient?.firstName} {recipient?.lastName}
                  </span>
                  ,
                </Text> */}
                  <Text>Greetings Homeowner!</Text>
                  {/* Date Received */}
                  <Text fontWeight="bold">
                    {notice?.createdAt
                      ? format(
                          new Date(notice?.createdAt + "Z")
                            ?.toISOString()
                            .split("T")[0],
                          "MMMM dd, yyyy"
                        )
                      : ""}
                  </Text>
                </Flex>

                <Text textAlign="justify">
                  We are writing to formally notify you regarding the violation
                  case against you:{" "}
                  <span className="font-bold">
                    #V{violation?.number.toString().padStart(4, "0")} Violation
                    Notice: {violationType?.title}
                  </span>
                  {". "}
                  Upon investigation, it has been concluded that corrective
                  measures are necessary, and you are required to pay the
                  corresponding <span className="font-bold">penalty fee</span>.
                </Text>

                {/* Violation Details */}
                <Box>
                  <Text textAlign="justify">
                    Violation Details: <br />
                  </Text>
                  <UnorderedList>
                    {/* Date of Violation */}
                    <ListItem>
                      Date of Violation:{" "}
                      <span className="font-semibold">
                        {violation?.violationDate
                          ? format(
                              new Date(violation?.violationDate)
                                ?.toISOString()
                                .split("T")[0],
                              "MMMM dd, yyyy"
                            )
                          : ""}
                      </span>
                    </ListItem>
                    {/* Violation Type */}
                    <ListItem>
                      Violation Type:{" "}
                      <span className="font-semibold">
                        {violationType?.title}
                      </span>
                    </ListItem>
                    {/* Penalty Fee */}
                    <ListItem>
                      Penalty Fee:{" "}
                      <span className="font-semibold text-red-500">
                        {violationType?.firstOffenseFee &&
                          formatCurrency(violationType?.firstOffenseFee)}
                      </span>
                    </ListItem>
                  </UnorderedList>
                </Box>

                <Box>
                  <span className="font-bold">Payment instructions</span> can be
                  found in the{" "}
                  <Link
                    href="/user/violations/process-guide#payPenaltyFee"
                    className="text-blue-500 hover:underline"
                  >
                    Violation Process Guide - Pay Penalty Fee{" "}
                  </Link>
                  section.
                </Box>

                <Text textAlign="justify" mb={10}>
                  Your prompt attention to this matter is crucial in maintaining
                  a positive relationship with our organization and avoiding any
                  potential consequences. We appreciate your cooperation in
                  resolving this issue promptly.
                </Text>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default ViolationNotice;
