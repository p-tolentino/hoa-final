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

interface CancelRequestButtonProps {
  reportDetails: any;
}

const CancelRequestButton: React.FC<CancelRequestButtonProps> = ({
  reportDetails,
}) => {
  const toast = useToast();

  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="sm"
            fontWeight="normal"
            w="min-content"
            fontFamily="font.body"
          >
            Cancel Request
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Maintenance Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure that you want to cancel the Maintenance Request:{" "}
              <br />
              <span className="font-semibold">
                {reportDetails.maintenanceType.title} (Maintenance Ticket No. #M
                {reportDetails.maintenance.number.toString().padStart(4, "0")})
              </span>
              ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="mt-0 hover:bg-gray-100">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={() => {
                toast({
                  title: `Successfully cancelled the Maintenance Request: `,
                  description: `${
                    reportDetails.maintenanceType.title
                  } (Maintenance Ticket No. #M
                ${reportDetails.maintenance.number
                  .toString()
                  .padStart(4, "0")})`,
                  status: "success",
                  position: "bottom-right",
                  isClosable: true,
                  colorScheme: "red",
                });
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

export default CancelRequestButton;
