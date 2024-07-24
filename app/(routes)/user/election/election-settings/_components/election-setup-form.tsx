"use client";

import {
  Stack,
  Box,
  HStack,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Flex,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
  useToast,
} from "@chakra-ui/react";
import { Heading } from "@/components/ui/heading";
import BackButton from "@/components/system/BackButton";
import { parseISO, isBefore, isPast, format } from "date-fns";
import { useEffect, useState } from "react";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS

import { Form, FormField } from "@/components/ui/form";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createElectionSettings } from "@/server/actions/election-settings";
import { getAllUsers } from "@/server/data/user";
import { ElectionSettings, Hoa, PersonalInfo, UserRole } from "@prisma/client";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { db } from "@/lib/db";
import { createNotification } from "@/server/actions/notification";

export const ElectionSettingsSchema = z
  .object({
    title: z.string(),

    startApplyDate: z.string(),
    endApplyDate: z.string(),

    startElectDate: z.string(),
    endElectDate: z.string(),

    totalBoardMembers: z.string(),
  })
  .refine(
    (data) => {
      const now = new Date();
      const startApplyDate = data.startApplyDate
        ? new Date(data.startApplyDate)
        : null;
      const endApplyDate = data.endApplyDate
        ? new Date(data.endApplyDate)
        : null;

      const startElectDate = data.startApplyDate
        ? new Date(data.startApplyDate)
        : null;
      const endElectDate = data.endApplyDate
        ? new Date(data.endApplyDate)
        : null;

      const dateIsPast = (date: Date) => {
        return date && date < now;
      };
      // Ensure all dates are not in the past
      if (
        dateIsPast(startApplyDate!!) ||
        dateIsPast(endApplyDate!!) ||
        dateIsPast(startElectDate!!) ||
        dateIsPast(endElectDate!!)
      ) {
        return false;
      }

      // Ensure start dates are not after end dates
      if (startApplyDate && endApplyDate && startApplyDate > endApplyDate) {
        return false;
      }

      if (startElectDate && endElectDate && startElectDate > endElectDate) {
        return false;
      }

      return true;
    },
    {
      // Custom error message
      message:
        "End dates cannot be in the past, and start dates must be before end dates.",
    }
  );

type ElectionSettingsFormValues = z.infer<typeof ElectionSettingsSchema>;

const ElectionSetup = ({
  hoaInfo,
  electionRecord,
  userInfos,
}: {
  hoaInfo: Hoa;
  electionRecord: ElectionSettings[];
  userInfos: PersonalInfo[];
}) => {
  // Page Title and Description
  const pageTitle = `Election Setup`;
  const pageDescription = `Fill up the following fields to set up an election.`;

  const router = useRouter();
  const toast = useToast();
  const [userCount, setUserCount] = useState<string>();
  const [requiredVotes, setRequiredVotes] = useState<string>("0");
  const [selectedYear, setSelectedYear] = useState("");
  const { officerTerm } = hoaInfo;

  const years = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return `${year} - ${year + officerTerm!!}`;
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUsers().then((data) => {
          const users = data?.filter(
            (user) => user.role === UserRole.USER
          ).length;

          setUserCount(users?.toString());

          const half = parseFloat(users!!.toString()) / 2.0;
          const majority = half + 1;

          setRequiredVotes(Math.trunc(majority).toString());
        });
      } catch (e) {
        console.log(e);
      }
    };

    fetchUsers();
  }, []);

  const form = useForm<ElectionSettingsFormValues>({
    resolver: zodResolver(ElectionSettingsSchema),
    defaultValues: {
      title: "",

      startApplyDate: "",
      endApplyDate: "",

      startElectDate: "",
      endElectDate: "",

      totalBoardMembers: "",
    },
  });

  const [startApplyDateError, setStartApplyDateError] = useState("");
  const [endApplyDateError, setEndApplyDateError] = useState("");
  const [startElectDateError, setStartElectDateError] = useState("");
  const [endElectDateError, setEndElectDateError] = useState("");

  const onSubmit = async (values: ElectionSettingsFormValues) => {
    const {
      title,
      startApplyDate,
      endApplyDate,
      startElectDate,
      endElectDate,
      totalBoardMembers,
    } = values;
    // Clear previous errors
    setStartApplyDateError("");
    setEndApplyDateError("");
    setStartElectDateError("");
    setEndElectDateError("");
    if (startApplyDate && endApplyDate) {
      const startDate = parseISO(startApplyDate);
      const endDate = parseISO(endApplyDate);
      const now = new Date();
      // First Condition: Start date is not equal to the end date
      if (startDate.getTime() === endDate.getTime()) {
        console.log("1");
        setStartApplyDateError("Start date cannot be equal to end date.");
        setEndApplyDateError("End date cannot be equal to start date.");
        return;
      }
      // Second Condition: Start date must not be in the past
      if (isPast(startDate)) {
        console.log("2");
        setStartApplyDateError("Start date cannot be in the past.");
        setEndApplyDateError("");
        return;
      }
      // Third Condition: End date must not be in the past and must be after the start date
      else if (isPast(endDate)) {
        console.log("3");
        setStartApplyDateError("");
        setEndApplyDateError("End date cannot be in the past.");
        return;
      }
      if (isBefore(endDate, startDate)) {
        console.log("4");
        setStartApplyDateError("");
        setEndApplyDateError("End date must be after the start date.");
        return;
      }
    }

    if (startElectDate && endElectDate) {
      const startDate = parseISO(startElectDate);
      const endDate = parseISO(endElectDate);
      const startApply = parseISO(startApplyDate);
      const endApply = parseISO(endApplyDate);
      const now = new Date();
      // First Condition: Start date is not equal to the end date
      if (startDate.getTime() === endDate.getTime()) {
        console.log("1");
        setStartElectDateError("Start date cannot be equal to end date.");
        setEndElectDateError("End date cannot be equal to start date.");
        return;
      }
      // Second Condition: Start date must not be in the past
      if (isPast(startDate)) {
        console.log("2");
        setStartElectDateError("Start date cannot be in the past.");
        setEndElectDateError("");
        return;
      }
      // Third Condition: End date must not be in the past and must be after the start date
      else if (isPast(endDate)) {
        console.log("3");
        setStartElectDateError("");
        setEndElectDateError("End date cannot be in the past.");
        return;
      }
      if (isBefore(endDate, startDate)) {
        console.log("4");
        setStartElectDateError("");
        setEndElectDateError("End date must be after the start date.");
        return;
      }

      if (isBefore(startDate, endApply)) {
        console.log("4");
        setStartElectDateError("");
        setEndElectDateError(
          "Election period must be after the candidacy period."
        );
        return;
      }

      if (isBefore(endDate, endApply)) {
        console.log("4");
        setStartElectDateError("");
        setEndElectDateError(
          "Election period must be after the candidacy period."
        );
        return;
      }
    }

    const existingElectionTermAlready = electionRecord.find(
      (record) => record.termOfOffice === selectedYear
    );

    if (existingElectionTermAlready) {
      toast({
        title: "Election Term Already Exists",
        description: `Election Term ${existingElectionTermAlready.termOfOffice} already exists.`,
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    // Proceed with form submission if dates are valid
    const formData = {
      title: title,
      startApplyDate: new Date(startApplyDate),
      endApplyDate: new Date(endApplyDate),
      startElectDate: new Date(startElectDate),
      endElectDate: new Date(endElectDate),
      requiredVotes: parseInt(requiredVotes),
      totalBoardMembers: totalBoardMembers ? parseInt(totalBoardMembers) : 13,
      termOfOffice: selectedYear,
    };
    console.log("Proceeding with form submission", formData);
    try {
      await createElectionSettings(formData).then(() => {
        userInfos.map(async (user) => {
          const notifData = {
            type: "election",
            recipient: user.userId,
            title: "Election Notice",
            description: `A new election has started. Click here to view.`,
            linkToView: `/user/election/election-record`,
          };

          await createNotification(notifData).then((data) => {
            if (data.success) {
              console.log(data.success);
            }
          });
        });
      });
      form.reset(); // Reset form upon success
      toast({
        title: "Election Created",
        description: `Election Term: ${formData.termOfOffice}`,
        status: "success",
        position: "bottom-right",
        duration: 5000,
        isClosable: true,
      });

      router.refresh(); // Refresh the page or navigate as needed
      console.log("Election Settings created successfully", formData);
      router.push(`/user/election/election-record`);
    } catch (error) {
      console.error("Failed to create post:", error);
      // Handle error state here, if needed
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Heading
          title={pageTitle}
          description={pageDescription}
          rightElements={<BackButton />}
        ></Heading>

        {/* Election Setup Fields */}
        <Box fontFamily="font.body">
          <Stack spacing={10}>
            {/* Election Title */}
            {/* <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="md" fontWeight="semibold">
                    Title:
                  </FormLabel>
                  <Input
                    size="sm"
                    placeholder={`ABC Homeowner Association Election for Year ${new Date().getFullYear()}-${
                      new Date().getFullYear() + officerTerm
                    }`}
                    {...field}
                  />
                </FormControl>
              )}
            /> */}

            <FormControl isRequired>
              <FormLabel fontSize="md" fontWeight="semibold">
                Term of Office ({officerTerm}-Year Period):
              </FormLabel>

              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  size="sm"
                  variant="outline"
                  w="full"
                  textAlign="left"
                >
                  {selectedYear || "YYYYY - YYYYY"}
                </MenuButton>
                <MenuList maxHeight="300px" overflowY="auto">
                  {years.map((year) => (
                    <MenuItem
                      key={year}
                      onClick={() => {
                        setSelectedYear(year.toString());
                      }}
                    >
                      {year}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </FormControl>
            <SimpleGrid columns={2} spacing={10}>
              {/* Duration of Accepting Applications */}
              <FormControl isRequired>
                <FormLabel fontSize="md" fontWeight="semibold">
                  Duration of Accepting Applications (Candidacy Period):
                </FormLabel>
                <HStack w="max-content" spacing={5}>
                  {/* Start Date and Time */}
                  <FormField
                    control={form.control}
                    name="startApplyDate"
                    render={({ field }) => (
                      <FormControl
                        isRequired
                        isInvalid={startApplyDateError !== ""}
                      >
                        <FormLabel fontSize="sm" fontWeight="normal">
                          Start Date and Time:
                        </FormLabel>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            // Format the date to a string and pass it on
                            const dateString = date
                              ? format(date, "yyyy-MM-dd HH:mm:ss")
                              : null;
                            field.onChange(dateString);
                          }}
                          showTimeSelect
                          placeholderText="MM/DD/YYYY hh:mm"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="w-[min-content] border p-2 text-sm"
                        />
                        {startApplyDateError && (
                          <FormErrorMessage>
                            {startApplyDateError}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                  {/* End Date and Time */}
                  <FormField
                    control={form.control}
                    name="endApplyDate"
                    render={({ field }) => (
                      <FormControl
                        isRequired
                        isInvalid={endApplyDateError !== ""}
                      >
                        <FormLabel fontSize="sm" fontWeight="normal">
                          End Date and Time:
                        </FormLabel>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            // Format the date to a string and pass it on
                            const dateString = date
                              ? format(date, "yyyy-MM-dd HH:mm:ss")
                              : null;
                            field.onChange(dateString);
                          }}
                          showTimeSelect
                          placeholderText="MM/DD/YYYY hh:mm"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="w-[min-content] border p-2 text-sm"
                        />
                        {endApplyDateError && (
                          <FormErrorMessage>
                            {endApplyDateError}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                </HStack>
              </FormControl>
              {/* Duration of Elections */}
              <FormControl isRequired>
                <FormLabel fontSize="md" fontWeight="semibold">
                  Duration of Elections (Election Period):
                </FormLabel>
                <HStack w="max-content" spacing={5}>
                  {/* Start Date and Time */}
                  <FormField
                    control={form.control}
                    name="startElectDate"
                    render={({ field }) => (
                      <FormControl
                        isRequired
                        isInvalid={startElectDateError !== ""}
                      >
                        <FormLabel fontSize="sm" fontWeight="normal">
                          Start Date and Time:
                        </FormLabel>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            // Format the date to a string and pass it on
                            const dateString = date
                              ? format(date, "yyyy-MM-dd HH:mm:ss")
                              : null;
                            field.onChange(dateString);
                          }}
                          showTimeSelect
                          placeholderText="MM/DD/YYYY hh:mm"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="w-[min-content] border p-2 text-sm"
                        />
                        {startElectDateError && (
                          <FormErrorMessage>
                            {startElectDateError}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                  {/* End Date and Time */}
                  <FormField
                    control={form.control}
                    name="endElectDate"
                    render={({ field }) => (
                      <FormControl
                        isRequired
                        isInvalid={endElectDateError !== ""}
                      >
                        <FormLabel fontSize="sm" fontWeight="normal">
                          End Date and Time:
                        </FormLabel>
                        <ReactDatePicker
                          selected={field.value ? new Date(field.value) : null}
                          onChange={(date) => {
                            // Format the date to a string and pass it on
                            const dateString = date
                              ? format(date, "yyyy-MM-dd HH:mm:ss")
                              : null;
                            field.onChange(dateString);
                          }}
                          showTimeSelect
                          placeholderText="MM/DD/YYYY hh:mm"
                          dateFormat="MMMM d, yyyy h:mm aa"
                          className="w-[min-content] border p-2 text-sm"
                        />
                        {endElectDateError && (
                          <FormErrorMessage>
                            {endElectDateError}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    )}
                  />
                </HStack>
              </FormControl>
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={10}>
              {/* Required total number of votes to declare validity of the Election  */}
              <FormControl isRequired>
                <FormLabel fontSize="md" fontWeight="semibold" mb={0}>
                  Required total number of votes to declare validity of the
                  Election:
                </FormLabel>
                {userCount && (
                  <Text fontSize="xs" className="italic text-gray-500" mb={1.5}>
                    (Total Registered Users in the System:{" "}
                    <span className="font-semibold">{userCount}</span>)
                  </Text>
                )}
                <NumberInput
                  isDisabled
                  value={requiredVotes}
                  maxW={20}
                  step={1}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              {/* Number of Board Members to be Elected */}
              <FormField
                control={form.control}
                name="totalBoardMembers"
                render={({ field }) => {
                  const parsedValue = parseInt(field.value, 10); // Parse the field value as an integer
                  const displayValue = isNaN(parsedValue) ? 13 : parsedValue; // Use 13 if the parsed value is not a number

                  return (
                    <FormControl isRequired>
                      <FormLabel fontSize="md" fontWeight="semibold">
                        Number of Board Members To Be Elected:
                      </FormLabel>
                      <NumberInput
                        defaultValue={displayValue} // Set the default value
                        min={0}
                        max={25}
                        maxW={20}
                        step={1}
                        onChange={(valueString) => field.onChange(valueString)}
                        value={displayValue}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  );
                }}
              />
            </SimpleGrid>

            {/* Save Changes and Create Election */}
            <Flex justifyContent="center" w="100%">
              <Button size="sm" colorScheme="yellow" type="submit">
                Save Changes and Create Election
              </Button>
            </Flex>
          </Stack>
        </Box>
      </form>
    </Form>
  );
};

export default ElectionSetup;
