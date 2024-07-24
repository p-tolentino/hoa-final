import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Button, useToast } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Facility,
  MaintenanceSchedule,
  RegularMaintainService,
} from "@prisma/client";

import { deleteRegularMaintainService } from "@/server/actions/maintenance-sched";
import { convertTimeTo12HourFormat } from "./schedule-list";

type MaintenanceScheduleWithService = MaintenanceSchedule & {
  service: RegularMaintainService;
};

interface DeleteScheduleButtonProps {
  schedule: MaintenanceScheduleWithService;
  facilities: Facility[] | null | undefined;
  days: String;
  continueDeletion: (confirmed: boolean) => void;
}

const DeleteScheduleButton: React.FC<DeleteScheduleButtonProps> = ({
  schedule,
  facilities,
  days,
  continueDeletion,
}) => {
  const toast = useToast();

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button key={schedule.id} size="xs" mr="10px" colorScheme="red">
            <DeleteIcon />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Regular Facility Maintenance Schedule
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that you want to delete the regular facility
              maintenance schedule: <br />
              <span className="font-semibold">
                {schedule.service.title} -{" "}
                {
                  facilities?.find(
                    (facility) => facility.id === schedule?.service.facilityId
                  )!!.name
                }{" "}
                <br />({days} {convertTimeTo12HourFormat(schedule.startTime)} -{" "}
                {convertTimeTo12HourFormat(schedule.endTime)})
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="mt-0 hover:bg-gray-100"
              onClick={() => continueDeletion(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                deleteRegularMaintainService(schedule.service.id).then(
                  (data) => {
                    if (data.success) {
                      continueDeletion(true);
                      toast({
                        title: `Successfully deleted schedule type: `,
                        description: `${schedule.service.title}`,
                        status: "success",
                        position: "bottom-right",
                        isClosable: true,
                        colorScheme: "red",
                      });
                    }
                  }
                );
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteScheduleButton;
