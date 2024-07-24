import { FaEllipsis } from "react-icons/fa6";
import { DeleteIcon, RepeatIcon } from "@chakra-ui/icons";
import {
  deleteReservation,
  updateReservation,
} from "@/server/actions/facility-reservation";
import {
  IconButton,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  FormControl,
  FormLabel,
  Text,
  SimpleGrid,
  Box,
  Flex,
  Button,
  Stack,
} from "@chakra-ui/react";
import { ReservationsMadeColumn } from "./columns";
import React, { useState, useTransition, useRef, useEffect } from "react";
import { Hoa } from "@prisma/client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSoaByDate } from "@/server/data/soa";
import { newUserTransaction } from "@/server/actions/user-transactions";
import { createNotification } from "@/server/actions/notification";
import { Copy } from "lucide-react";

interface CellActionProps {
  data: ReservationsMadeColumn;
  hoaInfo: Hoa;
}

export const CellAction: React.FC<CellActionProps> = ({ data, hoaInfo }) => {
  const [isPending] = useTransition();
  const [open, setOpen] = useState(false);
  const [cannotCancelOpen, setCannotCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [newStartTime, setNewStartTime] = useState<Date | null>(null);
  const [newEndTime, setNewEndTime] = useState<Date | null>(null);
  const [numHours, setNumHours] = useState<number>(0);
  const [totalFee, setTotalFee] = useState<number>(0);
  const cancelRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toast = useToast();

  const today = new Date();
  let cancel = new Date(data?.end!!);
  const withinDeadline = today < cancel;

  const onCopy = (id: string | undefined) => {
    if (id) {
      navigator.clipboard.writeText(id);
      console.log("Facility Reservation ID copied to the clipboard.");
    }
  };

  const handleDelete = async (reservation: ReservationsMadeColumn) => {
    if (!reservation?.reservationId) {
      toast({
        title: "Error",
        description: "Invalid Reservation ID.",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      return;
    }

    try {
      await deleteReservation(reservation.reservationId).then(async (res) => {
        const now = new Date();
        const today = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        const existingCurrMonthSoa = await getSoaByDate(
          today.getFullYear(),
          today.getMonth(),
          data?.reservedBy?.address!!
        );

        const feeData = {
          soaId: existingCurrMonthSoa?.id || null,
          purpose: "Facility Reservation Fees",
          amount: data?.cancelFee,
          addressId: data?.reservedBy?.address,
          description: `Cancellation Fee for ${data?.facility} (${data?.startTime} - ${data?.endTime})`,
        };

        await newUserTransaction(feeData).then((data) => {
          if (data.success) {
            console.log(data.success);
          }
        });

        // Send Notifications
        const notifPaymentData = {
          type: "finance",
          recipient: data?.reservedBy?.userId,
          title: `Cancelled Reservation`,
          description: `Your reservation for ${data?.facility} has been cancelled, and the cancellation fee must be paid. Click here to view your SOA and proceed to payment.`,
          linkToView: `/user/finance/statement-of-account`,
        };

        await createNotification(notifPaymentData).then((data) => {
          if (data.success) {
            console.log(data.success);
          }
        });

        if (res.success) {
          toast({
            title: "Reservation Cancelled",
            description: `Reservation: ${reservation.facility} (${reservation.reservationId})`,
            status: "success",
            position: "bottom-right",
            isClosable: true,
            colorScheme: "red",
          });
        }
      });
    } catch (error) {
      toast({
        title: "Error: Cancel Reservation",
        description: `Failed to cancel the reservation (${reservation.reservationId})`,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
    window.location.reload();
  };

  const handleReschedule = async () => {
    if (!data?.reservationId || !newStartTime || !newEndTime) {
      toast({
        title: "Error",
        description: "Invalid data for rescheduling.",
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
      return;
    }

    // Get the current time and remove seconds and milliseconds for comparison
    const now = new Date();
    now.setSeconds(0, 0);

    // Check if the startTime is in the past
    if (newStartTime < now) {
      setErrorMessage("The start time cannot be in the past.");
      return; // Stop the rescheduling process
    }

    // Check if the endTime is before the startTime
    if (newEndTime <= newStartTime) {
      setErrorMessage("The end time must be after the start time.");
      return; // Stop the rescheduling process
    }

    try {
      await updateReservation(data.reservationId, {
        startTime: newStartTime,
        endTime: newEndTime,
        numHours: numHours,
        reservationFee: totalFee,
      });
      toast({
        title: "Reservation Rescheduled",
        description: `Reservation: ${data.facility} (${data.reservationId})`,
        status: "success",
        position: "bottom-right",
        isClosable: true,
        colorScheme: "blue",
      });
      // Optionally, refresh the page or update state to reflect the changes
      // For example: router.refresh();
    } catch (error) {
      toast({
        title: "Error: Reschedule Reservation",
        description: `Failed to reschedule the reservation (${data.reservationId})`,
        status: "error",
        position: "bottom-right",
        isClosable: true,
      });
    }
    setRescheduleOpen(false);
    window.location.reload();
  };

  const isWithinCancellationPeriod = () => {
    if (!data?.start) return false;
    const currentDate = new Date();
    const reservationDate = new Date(data.start);
    const cancelPeriodMilliseconds = hoaInfo.cancelPeriod * 24 * 60 * 60 * 1000;
    return (
      reservationDate.getTime() - currentDate.getTime() <=
      cancelPeriodMilliseconds
    );
  };

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    if (newStartTime && newEndTime) {
      const duration =
        (newEndTime.getTime() - newStartTime.getTime()) / (1000 * 60 * 60);
      setNumHours(duration);
      const fee = duration * (data?.hourlyRate ?? 0); // Using optional chaining with a default value
      setTotalFee(fee);
    }
  }, [newStartTime, newEndTime, data?.hourlyRate]);

  // Format Currency, whether it be a type number or string
  const formatCurrency = (amount: number | string) => {
    const numericAmount =
      typeof amount === "string" ? parseFloat(amount) : amount;

    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(numericAmount);
  };

  const isTimeReserved = (date: Date) => {
    // Get current date and time
    const now = new Date();

    // Check if the date is in the past. If so, disable it.
    if (date < now) {
      return false;
    }

    // Operational hours: 7:00 AM to 11:59 PM
    const hour = date.getHours();
    if (hour < 7 || hour >= 24) {
      return false; // Disables times outside operational hours
    }

    const isMaintenance = data?.maintenanceSchedule.some((maintenance) => {
      const maintenanceDays = maintenance.days.split(",");
      const day = date.toLocaleString("en-us", { weekday: "long" });

      const startTime = new Date(date);
      const [startHour, startMinute] = maintenance.startTime
        .split(":")
        .map(Number);
      startTime.setHours(startHour, startMinute, 0, 0);

      const endTime = new Date(date);
      const [endHour, endMinute] = maintenance.endTime.split(":").map(Number);
      endTime.setHours(endHour, endMinute, 0, 0);

      return (
        maintenanceDays.includes(day) && date >= startTime && date < endTime
      );
    });

    if (isMaintenance) {
      return false; // Disable times during maintenance
    }

    // Check special maintenance
    const isSpecialMaintenance = data?.maintenanceNotice.some((maint) => {
      const startDateTime = new Date(maint.startDate);
      const [startHour, startMinute] = maint.startTime.split(":").map(Number);
      startDateTime.setHours(startHour, startMinute, 0, 0);

      const endDateTime = new Date(maint.endDate);
      const [endHour, endMinute] = maint.endTime.split(":").map(Number);
      endDateTime.setHours(endHour, endMinute, 0, 0);

      return date >= startDateTime && date <= endDateTime;
    });

    if (isSpecialMaintenance) {
      return false; // Disable times during special maintenance
    }

    // Check if the date falls within or overlaps any reserved time intervals.
    const isReserved = data?.facilityReservations.some((reservation) => {
      const reservedStart = new Date(reservation.startTime);
      const reservedEnd = new Date(reservation.endTime);
      return (
        (date >= reservedStart && date < reservedEnd) ||
        (date <= reservedEnd && date > reservedStart)
      );
    });

    return !isReserved; // Enable if not reserved
  };

  return (
    <>
      <AlertDialog
        isOpen={open}
        leastDestructiveRef={cancelRef}
        onClose={() => setOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className="py-3">
            <AlertDialogHeader pb={1} fontSize="lg" fontWeight="bold">
              Confirm Cancel Reservation
            </AlertDialogHeader>

            <AlertDialogBody pt={0} fontFamily="font.body" textAlign="justify">
              <Stack spacing={2}>
                <Text>
                  Are you sure you want to cancel the reservation of{" "}
                  <span className="font-semibold">{data?.userName}</span> at the{" "}
                  <strong>{data?.facility}</strong>?
                </Text>
                <Text>
                  The cancellation fee of{" "}
                  <span className="text-red-500 font-semibold">
                    {data?.cancelFee && formatCurrency(data?.cancelFee)}
                  </span>{" "}
                  will be charged to the homeowner&apos;s SOA once you confirm.
                  This action cannot be undone.
                </Text>
              </Stack>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button size="sm" ref={cancelRef} onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={() => handleDelete(data)}
                ml={3}
              >
                Cancel Reservation
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={cannotCancelOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setCannotCancelOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className="py-3">
            <AlertDialogHeader pb={1} fontSize="lg" fontWeight="bold">
              Cannot Cancel Reservation
            </AlertDialogHeader>

            <AlertDialogBody pt={0} fontFamily="font.body" textAlign="justify">
              This reservation cannot be cancelled due to the cancellation
              period policy of {hoaInfo.cancelPeriod} days.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                size="sm"
                ref={cancelRef}
                onClick={() => setCannotCancelOpen(false)}
              >
                Close
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={rescheduleOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setRescheduleOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent className="py-3">
            <AlertDialogHeader pb={3}>
              <Text fontSize="lg" fontWeight="bold">
                Reschedule Reservation
              </Text>
              <Text
                fontFamily="font.body"
                fontSize="sm"
                fontWeight="normal"
                textAlign="justify"
              >
                You may update the start and end date and time for this
                reservation.
              </Text>
            </AlertDialogHeader>

            <AlertDialogBody pt={0}>
              {errorMessage && (
                <Text color="red.500" mb={4}>
                  {errorMessage}
                </Text>
              )}
              <SimpleGrid
                columns={1}
                gap={5}
                mx={2}
                border="1px solid grey"
                borderRadius="md"
                p={3}
                fontFamily="font.body"
              >
                <Box>
                  <FormControl>
                    <Flex>
                      <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>
                        Facility Selected:
                      </FormLabel>
                      <Text fontSize="md" fontWeight="semibold" ml={2}>
                        {data?.facility ?? "Unknown Facility"}
                      </Text>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex>
                      <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>
                        Reservation Fee:
                      </FormLabel>
                      <Text fontSize="md" fontWeight="semibold" ml={2}>
                        {formatCurrency(data?.hourlyRate ?? 0)}{" "}
                        <span className="sub text-sm">/ Hour</span>
                      </Text>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex>
                      <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>
                        Number of Hours:
                      </FormLabel>
                      <Text fontSize="md" fontWeight="semibold" ml={2}>
                        {numHours.toFixed(2)}
                      </Text>
                    </Flex>
                  </FormControl>
                  <FormControl>
                    <Flex>
                      <FormLabel fontSize="sm" fontWeight="semibold" mb={0}>
                        Total Reservation Fee:
                      </FormLabel>
                      <Text
                        fontSize="md"
                        fontWeight="semibold"
                        ml={2}
                        color={totalFee === 0 ? "grey" : "red"}
                      >
                        {formatCurrency(totalFee)}
                      </Text>
                    </Flex>
                  </FormControl>
                </Box>
              </SimpleGrid>

              <FormControl isRequired mt={6} fontFamily="font.body">
                <FormLabel>New Start Date and Time:</FormLabel>
                <DatePicker
                  selected={newStartTime}
                  onChange={(date) => setNewStartTime(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  filterTime={isTimeReserved}
                  className="border p-2 w-[full]"
                  placeholderText="MMMM dd, yyyy hh:mm a"
                />
              </FormControl>
              <FormControl isRequired mt={4} fontFamily="font.body">
                <FormLabel>New End Date and Time:</FormLabel>
                <DatePicker
                  selected={newEndTime}
                  onChange={(date) => setNewEndTime(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={30}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={new Date()}
                  filterTime={isTimeReserved}
                  className="border p-2 w-[full]"
                  placeholderText="MMMM dd, yyyy hh:mm a"
                />
              </FormControl>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                size="sm"
                ref={cancelRef}
                onClick={() => setRescheduleOpen(false)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={handleReschedule}
                ml={3}
              >
                Reschedule
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <IconButton
            aria-label={""}
            icon={<FaEllipsis />}
            color="grey"
            variant="unstyled"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          {/* Copy ID */}
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onCopy(data?.reservationId)}
          >
            <Copy className="w-4 h-4 mr-2" />
            Copy ID
          </DropdownMenuItem>

          {/* Cancel */}
          <DropdownMenuItem
            className="font-semibold text-red-500 cursor-pointer"
            onClick={handleOpen}
          >
            <div className="font-semibold text-red-500">
              <DeleteIcon mr={2} />
              Cancel Reservation
            </div>
          </DropdownMenuItem>

          {/* Reschedule */}
          <DropdownMenuItem
            className="font-semibold text-blue-500 cursor-pointer"
            onClick={() => setRescheduleOpen(true)}
          >
            <div className="font-semibold text-blue-500">
              <RepeatIcon mr={2} />
              Reschedule Reservation
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
