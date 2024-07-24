import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Box,
  UnorderedList,
  ListItem,
  Flex,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Tr,
  useSteps,
  Stack,
  Center,
  Divider,
  Link,
  OrderedList,
} from "@chakra-ui/react";
import { format, getDay } from "date-fns";
// import {
//   MaintenanceOfficerActivity,
//   MaintenanceProgress,
//   UserRole
// } from '@prisma/client'
import ViewProgressReport from "./view-progress-report";
import ViewReviewResults from "./view-review-results";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useEffect, useState } from "react";
import CancelRequestButton from "./CancelRequestButton";
import {
  MaintenanceNotice,
  MaintenanceOfficerActivity,
  MaintenanceProgress,
} from "@prisma/client";
import { getNoticeByMaintenanceId } from "@/server/data/maintenance-request";
import { convertTimeTo12HourFormat } from "../../../../regular-maintenance/_components/schedule-list";
import { daysOrder } from "../../../../maintenance-record/view-progress/[maintenanceId]/_components/step-card";
// import { getLetterByMaintenanceId } from '@/server/data/letter-notice'

interface ProcessStep {
  value: string;
  title: string;
  description: string;
  details: string[];
}

interface StepCardProps {
  stepIndex: number;
  processSteps: ProcessStep[];
  reportDetails: any;
}

export default function StepCard({
  stepIndex,
  processSteps,
  reportDetails,
}: StepCardProps) {
  const user = useCurrentUser();
  const { activeStep } = useSteps({
    index: 0,
    count: reportDetails.officerActivities.length,
  });

  const [notice, setNotice] = useState<MaintenanceNotice | null | undefined>();

  useEffect(() => {
    try {
      getNoticeByMaintenanceId(reportDetails.maintenance.id).then((notice) => {
        if (notice) {
          setNotice(notice);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }, [stepIndex, reportDetails.maintenance.id]);

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
    <Card shadow="lg" my="1.5rem" h="62vh" p="10px 10px 20px 10px">
      <CardHeader pb={0}>
        <Text
          fontSize="sm"
          fontFamily="font.body"
          color="brand.500"
          fontWeight="bold"
        >
          Step {stepIndex + 1}
        </Text>
        <Text fontSize="lg" fontFamily="font.heading" fontWeight="bold">
          {/* Step Title */}
          {processSteps[stepIndex].title}
        </Text>
        <Text fontFamily="font.body" textAlign="justify">
          {/* Step Description */}
          {processSteps[stepIndex].description}
        </Text>
        <Divider mt="0.5rem" />
      </CardHeader>
      <CardBody pt={2}>
        <Box overflowY="auto" h="42vh">
          <Box
            fontFamily="font.body"
            fontSize="sm"
            textAlign="justify"
            mb="2rem"
          >
            {/* Step Details */}
            <Text>Details:</Text>
            <UnorderedList mb="1rem" ml={7}>
              {processSteps[stepIndex].details.map((detail, index) => (
                <ListItem key={index}>{detail}</ListItem>
              ))}
            </UnorderedList>
          </Box>

          {/* Step 1 Content */}
          {stepIndex === 0 && (
            <Box pb={5}>
              <Box>
                <Text
                  fontWeight="semibold"
                  fontFamily="font.heading"
                  lineHeight={1}
                >
                  Maintenance Request Form Contents
                </Text>
                <Text fontFamily="font.body" fontSize="sm" color="grey">
                  Date received:{" "}
                  {reportDetails.maintenance.createdAt
                    ? format(
                        new Date(reportDetails.maintenance.createdAt + "Z")
                          ?.toISOString()
                          .split("T")[0],
                        "dd MMM yyyy"
                      )
                    : ""}
                </Text>
              </Box>
              <Flex gap={5} pt="1rem">
                <TableContainer>
                  <Table
                    variant="unstyled"
                    fontFamily="font.body"
                    size="sm"
                    w="400px"
                  >
                    <Tbody>
                      <Tr whiteSpace="normal">
                        <Th border="3px double black" w="130px">
                          Maintenance Ticket No.
                        </Th>
                        <Td border="3px double black">
                          #M
                          {reportDetails.maintenance.number
                            .toString()
                            .padStart(4, "0")}
                        </Td>
                      </Tr>
                      <Tr whiteSpace="normal">
                        <Th border="3px double black" w="130px">
                          Maintenance Type
                        </Th>
                        <Td border="3px double black">
                          {reportDetails.maintenanceType.title}
                        </Td>
                      </Tr>
                      <Tr whiteSpace="normal">
                        <Th border="3px double black" w="130px">
                          Location / Facility
                        </Th>
                        <Td border="3px double black">
                          {reportDetails.location}
                        </Td>
                      </Tr>
                    </Tbody>
                  </Table>
                </TableContainer>
                <TableContainer>
                  <Table
                    variant="unstyled"
                    fontFamily="font.body"
                    size="sm"
                    minWidth="400px"
                  >
                    <Tbody>
                      <>
                        <Tr whiteSpace="normal">
                          <Th border="3px double black" w="130px">
                            Submitted By
                          </Th>
                          <Td border="3px double black">
                            {reportDetails.submittedBy
                              ? `${reportDetails.submittedBy.firstName} ${reportDetails.submittedBy.lastName}`
                              : ""}
                          </Td>
                        </Tr>
                        <Tr whiteSpace="normal">
                          <Th border="3px double black" w="130px">
                            Date Submitted
                          </Th>
                          <Td border="3px double black">
                            {reportDetails.maintenance.createdAt
                              ? format(
                                  new Date(
                                    reportDetails.maintenance.createdAt + "Z"
                                  )
                                    ?.toISOString()
                                    .split("T")[0],
                                  "dd MMM yyyy"
                                )
                              : ""}
                          </Td>
                        </Tr>
                        <Tr whiteSpace="normal">
                          <Th border="3px double black" w="130px">
                            Supporting Documents
                          </Th>
                          <Td
                            border="3px double black"
                            color={
                              reportDetails.maintenance.documents !== null
                                ? "black"
                                : "lightgrey"
                            }
                          >
                            {reportDetails.maintenance.documents !== null ? (
                              <UnorderedList>
                                {reportDetails.maintenance.documents.map(
                                  (document: string, index: number) => (
                                    <ListItem key={index}>
                                      <Link
                                        href={document}
                                        target="_blank"
                                        color="blue.500"
                                      >
                                        <>
                                          Supporting Document {index + 1} (.
                                          {document.includes(".pdf")
                                            ? "pdf"
                                            : "png"}
                                          )
                                        </>
                                      </Link>
                                    </ListItem>
                                  )
                                )}
                              </UnorderedList>
                            ) : (
                              "N/A"
                            )}
                          </Td>
                        </Tr>
                      </>
                    </Tbody>
                  </Table>
                </TableContainer>
              </Flex>
              <TableContainer>
                <Table
                  variant="unstyled"
                  fontFamily="font.body"
                  size="sm"
                  w="820px"
                  mt={5}
                >
                  <Tbody>
                    <Tr whiteSpace="normal">
                      <Th border="3px double black" textAlign="center">
                        Maintenance Request Form Description
                      </Th>
                    </Tr>
                    <Tr whiteSpace="normal">
                      <Td
                        border="3px double black"
                        fontSize="xs"
                        textAlign="justify"
                      >
                        {reportDetails.maintenance.description}
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {/* Step 2 Content */}
          {stepIndex === 1 && (
            <Box>
              {reportDetails.maintenance.committeeReview ? (
                <ViewReviewResults
                  activeStep={activeStep}
                  reportDetails={reportDetails}
                />
              ) : (
                <Box
                  h="24vh"
                  border="1px solid lightgray"
                  borderRadius={5}
                  p={3}
                  overflowY="auto"
                  flex={3}
                  alignContent="center"
                >
                  <Stack textAlign="center" spacing={2} fontFamily="font.body">
                    <Text color="gray">No results to show yet.</Text>

                    <CancelRequestButton reportDetails={reportDetails} />
                  </Stack>
                </Box>
              )}
            </Box>
          )}

          {/* Step 3 Content */}
          {stepIndex === 2 && (
            <Box>
              <Box>
                <Text
                  fontWeight="semibold"
                  fontFamily="font.heading"
                  lineHeight={1}
                >
                  Officer Assigned
                </Text>
                <Text fontFamily="font.body" fontSize="sm" color="grey">
                  Date assigned:{" "}
                  {reportDetails.maintenance.commReviewDate
                    ? format(
                        new Date(reportDetails.maintenance.commReviewDate + "Z")
                          ?.toISOString()
                          .split("T")[0],
                        "dd MMM yyyy"
                      )
                    : ""}
                </Text>
              </Box>
              <Stack w="400px" spacing="0.5rem" pt="1rem">
                <TableContainer>
                  <Table
                    variant="unstyled"
                    fontFamily="font.body"
                    size="sm"
                    w="400px"
                  >
                    <Tbody>
                      <Tr whiteSpace="normal">
                        <Th border="3px double black" w="110px">
                          Officer Assigned
                        </Th>
                        <Td
                          border="3px double black"
                          color={
                            reportDetails.officerAssigned
                              ? "black"
                              : "lightgray"
                          }
                          fontStyle={
                            reportDetails.officerAssigned ? "normal" : "italic"
                          }
                        >
                          {reportDetails.officerAssigned
                            ? `${reportDetails.officerAssigned.firstName} ${reportDetails.officerAssigned.lastName}`
                            : "Unassigned"}
                        </Td>
                      </Tr>
                      {reportDetails.maintenance.priority && (
                        <Tr whiteSpace="normal">
                          <Th border="3px double black" w="110px">
                            Maintenance Priority
                          </Th>
                          <Td
                            border="3px double black"
                            color={
                              reportDetails.priority === "HIGH"
                                ? "red"
                                : "MEDIUM"
                                ? "orange"
                                : "LOW"
                                ? "yellow"
                                : ""
                            }
                          >
                            {reportDetails.priority
                              ? `${reportDetails.priority}`
                              : "N/A"}
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
                <Text fontSize="xs" fontFamily="font.body" textAlign="justify">
                  This officer has been assigned to oversee this maintenance
                  activity exclusively. They are the sole authorized individual
                  to provide progress reports.
                </Text>
              </Stack>
            </Box>
          )}

          {/* Step 4 Content */}
          {stepIndex === 3 && (
            <Box>
              {reportDetails.maintenance.letterSent ? (
                <Box pb={5}>
                  <Box>
                    <Text
                      fontWeight="semibold"
                      fontFamily="font.heading"
                      lineHeight={1}
                    >
                      Maintenance Notice Contents
                    </Text>
                    <Text fontFamily="font.body" fontSize="sm" color="grey">
                      Date sent:{" "}
                      {notice &&
                        format(
                          new Date(notice.createdAt + "Z")
                            ?.toISOString()
                            .split("T")[0],
                          "dd MMM yyyy"
                        )}
                    </Text>
                  </Box>
                  <Flex gap={5} pt="1rem">
                    <TableContainer>
                      <Table
                        variant="unstyled"
                        fontFamily="font.body"
                        size="sm"
                        minWidth="400px"
                      >
                        <Tbody>
                          <Tr whiteSpace="normal">
                            <Th border="3px double black" w="130px">
                              Sender
                            </Th>
                            <Td border="3px double black">
                              {reportDetails.officerAssigned
                                ? `${reportDetails.officerAssigned.firstName} ${reportDetails.officerAssigned.lastName}`
                                : ""}
                            </Td>
                          </Tr>
                          <Tr whiteSpace="normal">
                            <Th border="3px double black" w="130px">
                              Subject
                            </Th>
                            <Td border="3px double black">{notice?.subject}</Td>
                          </Tr>
                          <Tr whiteSpace="normal">
                            <Th border="3px double black" w="130px">
                              Location
                            </Th>
                            <Td border="3px double black">
                              {notice?.location}
                            </Td>
                          </Tr>
                          <Tr whiteSpace="normal">
                            <Th border="3px double black" w="130px">
                              Maintenance Schedule
                            </Th>
                            <Td border="3px double black" fontSize="xs">
                              <UnorderedList>
                                {notice && (
                                  <>
                                    <ListItem>
                                      <span className="font-semibold">
                                        Start:
                                      </span>{" "}
                                      {`
                                  ${convertTimeTo12HourFormat(
                                    notice!!.startTime
                                  )} of ${format(
                                        notice.startDate,
                                        "dd MMM yyyy"
                                      )} (${
                                        daysOrder[getDay(notice.startDate) - 1]
                                      })`}
                                    </ListItem>
                                    <ListItem>
                                      <span className="font-semibold">
                                        End:
                                      </span>{" "}
                                      {`
                                  ${convertTimeTo12HourFormat(
                                    notice!!.endTime
                                  )} of ${format(
                                        notice.endDate,
                                        "dd MMM yyyy"
                                      )} (${
                                        daysOrder[getDay(notice.endDate) - 1]
                                      })`}
                                    </ListItem>
                                  </>
                                )}
                              </UnorderedList>
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                    <TableContainer>
                      <Table
                        variant="unstyled"
                        fontFamily="font.body"
                        size="sm"
                        w="600px"
                      >
                        <Tbody>
                          <Tr whiteSpace="normal">
                            <Th border="3px double black" textAlign="center">
                              Maintenance Notice Description
                            </Th>
                          </Tr>
                          <Tr whiteSpace="normal">
                            <Td
                              border="3px double black"
                              fontSize="xs"
                              textAlign="justify"
                            >
                              {notice && notice.description}
                            </Td>
                          </Tr>
                        </Tbody>
                      </Table>
                    </TableContainer>
                  </Flex>
                </Box>
              ) : (
                <Box
                  h="24vh"
                  border="1px solid lightgray"
                  borderRadius={5}
                  p={3}
                  overflowY="auto"
                  flex={3}
                >
                  <Center color="gray" h="50%" fontFamily="font.body">
                    No results to show.
                  </Center>
                </Box>
              )}
            </Box>
          )}

          {/* Step 5 Content */}
          {stepIndex === 4 && (
            <Flex gap={10} mr={5}>
              <Box>
                <Box>
                  <Text
                    fontWeight="semibold"
                    fontFamily="font.heading"
                    lineHeight={1}
                  >
                    Key Activities
                  </Text>
                  <Text fontFamily="font.body" fontSize="sm">
                    You may click the activity title to view its progress
                    reports.
                  </Text>
                </Box>
                <Box
                  h="120px"
                  border="1px solid lightgray"
                  borderRadius={5}
                  p={3}
                  overflowY="auto"
                  mt="1rem"
                  w="520px"
                >
                  <OrderedList fontSize="sm" fontFamily="font.body" spacing={3}>
                    {reportDetails.officerActivities
                      .sort((a: any, b: any) => a.deadline - b.deadline)
                      .map((activity: MaintenanceOfficerActivity) => (
                        <ListItem key={activity.id}>
                          <ViewProgressReport
                            activity={activity}
                            progressReports={reportDetails.progressReports.filter(
                              (progress: MaintenanceProgress) =>
                                progress.activity === activity.id
                            )}
                          />
                        </ListItem>
                      ))}
                  </OrderedList>
                </Box>
              </Box>
            </Flex>
          )}

          {/* Step 6 Content */}
          {stepIndex === 5 && (
            <Box>
              {reportDetails.maintenance.finalReview ? (
                <Flex gap={10} pb={5}>
                  <Box>
                    <Text
                      fontWeight="semibold"
                      fontFamily="font.heading"
                      lineHeight={1}
                    >
                      Maintenance Activity: Final Report
                    </Text>
                    <Text fontFamily="font.body" fontSize="sm" color="grey">
                      Date submitted final report:{" "}
                      {reportDetails.maintenance.finalReviewDate
                        ? format(
                            new Date(
                              reportDetails.maintenance.finalReviewDate + "Z"
                            )
                              ?.toISOString()
                              .split("T")[0],
                            "dd MMM yyyy"
                          )
                        : ""}
                    </Text>
                    <Box
                      h="18vh"
                      border="1px solid lightgray"
                      borderRadius={5}
                      p={3}
                      overflowY="auto"
                      flex={3}
                      mt="1rem"
                      w="600px"
                    >
                      <Text
                        fontFamily="font.body"
                        fontSize="sm"
                        textAlign="justify"
                      >
                        {reportDetails.maintenance.finalReview}
                      </Text>
                    </Box>
                  </Box>
                  <Box>
                    <Text
                      fontWeight="semibold"
                      fontFamily="font.heading"
                      lineHeight={1}
                    >
                      Maintenance Activity Information
                    </Text>
                    <Text fontFamily="font.body" fontSize="sm" color="grey">
                      Date completedd:{" "}
                      {reportDetails.maintenance.finalReviewDate
                        ? format(
                            new Date(
                              reportDetails.maintenance.finalReviewDate + "Z"
                            )
                              ?.toISOString()
                              .split("T")[0],
                            "dd MMM yyyy"
                          )
                        : ""}
                    </Text>

                    <Stack w="400px" spacing="0.5rem" pt="1rem">
                      <TableContainer>
                        <Table
                          variant="unstyled"
                          fontFamily="font.body"
                          size="sm"
                          w="400px"
                        >
                          <Tbody>
                            <Tr whiteSpace="normal">
                              <Th border="3px double black" w="130px">
                                Maintenance Type
                              </Th>
                              <Td border="3px double black">
                                {reportDetails.maintenanceType.title}{" "}
                              </Td>
                            </Tr>
                            <Tr whiteSpace="normal">
                              <Th border="3px double black" w="130px">
                                External Fee Incurred
                              </Th>
                              <Td
                                border="3px double black"
                                color={
                                  reportDetails.maintenance.feeToIncur !== "N/A"
                                    ? "red.500"
                                    : "lightgrey"
                                }
                              >
                                {reportDetails.maintenance.feeToIncur !== "N/A"
                                  ? formatCurrency(
                                      reportDetails.maintenance.feeToIncur
                                    )
                                  : reportDetails.maintenance.feeToIncur}
                              </Td>
                            </Tr>
                          </Tbody>
                        </Table>
                      </TableContainer>
                    </Stack>
                  </Box>
                </Flex>
              ) : (
                <Box
                  h="24vh"
                  border="1px solid lightgray"
                  borderRadius={5}
                  p={3}
                  overflowY="auto"
                  flex={3}
                >
                  <Center color="gray" h="50%" fontFamily="font.body">
                    No results to show.
                  </Center>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}
