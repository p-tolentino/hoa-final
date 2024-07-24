"use client";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Input,
  Stack,
  Box,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Select,
  Icon,
  FormErrorMessage,
} from "@chakra-ui/react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS

import { AddIcon } from "@chakra-ui/icons";
import { useState, useEffect } from "react";
import { CalendarIcon } from "lucide-react";
import { PostEventButton } from "./PostEventButton";

import { format, addDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { parseISO, isBefore, isPast, isToday } from "date-fns";

import {
  Form,
  FormControl as ShadControl,
  FormDescription,
  FormField,
  FormItem,
  // FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { newEventSchema } from "@/server/schemas";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { getPersonalInfo } from "@/server/data/user-info";
import { getProperty } from "@/server/data/property";
import { PersonalInfo, Property, Facility } from "@prisma/client";
import { createEvent } from "@/server/actions/event";

type EventFormValues = z.infer<typeof newEventSchema>;

interface EventProps {
  user: string;
  facilities: Facility[];
}

export default function CreateEventButton({ user, facilities }: EventProps) {
  const router = useRouter();
  const { update } = useSession();
  const [open, setIsOpen] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);
  const toast = useToast();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [venueType, setVenueType] = useState<string>("hoaFacilities");
  const [address, setAddress] = useState<PersonalInfo | null>(null);
  const [addressName, setAddressName] = useState<Property | null>(null);

  // const { register, handleSubmit, setValue, watch } = useForm<EventFormValues>({
  //   resolver: zodResolver(newEventSchema),
  // });

  const form = useForm<EventFormValues>({
    resolver: zodResolver(newEventSchema),
    defaultValues: {
      title: "" || undefined,
      date: "" || undefined,
      venue: "" || undefined,
      description: "" || undefined,
    },
  });

  useEffect(() => {
    const fetchPersonalInfo = async () => {
      if (user) {
        const personalInfo = await getPersonalInfo(user);
        setAddress(personalInfo);
      }
    };

    fetchPersonalInfo();
  }, [user]);

  useEffect(() => {
    const fetchPersonalAddress = async () => {
      if (address?.address) {
        const personalAddress = await getProperty(address.address);
        setAddressName(personalAddress);
      }
    };

    fetchPersonalAddress();
  }, [address]);

  useEffect(() => {
    if (venueType === "homeAddress" && addressName?.address) {
      form.setValue("venue", addressName.address);
    }
  }, [form, venueType, addressName, form.setValue]);

  const [dateError, setDateError] = useState("");

  const onSubmit = async (values: EventFormValues) => {
    setDateError("");

    if (isPast(values.date)) {
      console.log("error date");
      setDateError("Start date and time cannot be in the past.");
      return;
    }

    try {
      await createEvent(values);
      onOpen();
      console.log("values passed are", values);
      form.reset(); // Reset form upon success
      setIsOpen(false); // Close dialog upon success
      toast({
        title: `Event Created`,
        description: `Event: ${values.title} (${format(
          new Date(values.date),
          "MMMM dd, yyyy"
        )})`,
        status: "success",
        position: "bottom-right",
        isClosable: true,
      });

      router.refresh(); // Refresh the page or navigate as needed
    } catch (error) {
      console.error("Failed to create post:", error);
      toast({
        title: `Error`,
        description: `Failed to create post. Try again.`,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      // Handle error state here, if needed
    }
  };

  return (
    <Dialog open={open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" colorScheme="yellow">
          <AddIcon mr="10px" />
          Create Event
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[500px]  overflow-y-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Event</DialogTitle>
              <DialogDescription>
                Fill up the following fields to create an event
              </DialogDescription>
            </DialogHeader>

            {/* Form Content */}
            <Stack spacing="15px" my="1rem">
              {/* Event Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormControl isRequired>
                    <FormLabel fontSize="sm" fontWeight="semibold">
                      Event Title:
                    </FormLabel>
                    <Input
                      size="md"
                      fontWeight="semibold"
                      type="string"
                      {...field}
                      placeholder="Enter the Event Title"
                    />
                  </FormControl>
                )}
              />

              {/* Event Date */}
              <FormField
                name="date"
                control={form.control}
                render={({ field }) => (
                  <FormControl isRequired isInvalid={dateError !== ""}>
                    <FormLabel fontSize="sm" fontWeight="semibold">
                      Date and Time:
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
                      placeholderText="Select Date and Time"
                      dateFormat="MMMM d, yyyy h:mm aa"
                      className="w-[250px] border p-2 text-sm"
                      minDate={new Date()} // Prevent selecting past dates
                    />
                    {dateError && (
                      <FormErrorMessage>{dateError}</FormErrorMessage>
                    )}
                  </FormControl>
                )}
              />

              {/* Venue */}
              <FormControl isRequired>
                <FormLabel fontSize="sm" fontWeight="semibold">
                  Venue:
                </FormLabel>
                <FormHelperText fontSize="xs" mb="5px">
                  Please select the type of venue to view its possible options.
                </FormHelperText>
                <RadioGroup
                  size="sm"
                  colorScheme="yellow"
                  onChange={setVenueType}
                  value={venueType}
                >
                  <Stack spacing={5} direction="row" fontFamily="font.body">
                    <Radio value="hoaFacilities">HOA Facilities</Radio>
                    <Radio value="homeAddress">Your Home Address</Radio>
                    <Radio value="otherVenue">Other Venue</Radio>
                  </Stack>
                </RadioGroup>
              </FormControl>

              <FormField
                name="venue"
                control={form.control}
                render={({ field }) => (
                  <FormControl isRequired>
                    {venueType === "hoaFacilities" && (
                      <Select
                        {...field}
                        placeholder="Select facility"
                        size="sm"
                      >
                        {facilities.map((facility) => (
                          <option key={facility.id} value={facility.name}>
                            {facility.name}
                          </option>
                        ))}
                      </Select>
                    )}
                    {venueType === "homeAddress" && (
                      <Input
                        type="string"
                        size="sm"
                        // {...field}
                        value={addressName?.address || "Loading..."}
                        readOnly // Make the field readOnly if you don't want the user to modify it
                      />
                    )}
                    {venueType === "otherVenue" && (
                      <Input
                        type="string"
                        size="sm"
                        defaultValue=""
                        {...field}
                        placeholder="Enter name of venue"
                      />
                    )}
                  </FormControl>
                )}
              />

              {/* Event Description */}
              <Box py="10px">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Description of the Event
                      </FormLabel>
                      <Textarea
                        placeholder="Write the description of the event"
                        id="discussionPost"
                        fontSize="xs"
                        resize="none"
                        maxH="250px"
                        {...field}
                      />
                    </FormControl>
                  )}
                />
              </Box>
            </Stack>
            <DialogFooter>
              {/* <PostEventButton /> */}
              <Button
                size="sm"
                colorScheme="yellow"
                type="submit"
                isLoading={isButtonClicked}
                loadingText="Creating"
                onClick={() => setIsButtonClicked(true)}
              >
                Create Event
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
