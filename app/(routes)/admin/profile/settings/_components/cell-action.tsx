"use client";

import { LuTrash as Trash } from "react-icons/lu";

import { Button } from "@/components/ui/button";

import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useSession } from "next-auth/react";
import { Vehicle } from "@prisma/client";
import { deleteVehicle } from "@/server/actions/vehicle";

interface CellActionProps {
  data: Vehicle;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();

  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const onDelete = async (id: string) => {
    startTransition(() => {
      deleteVehicle(id)
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          }
          if (data.success) {
            update();
            router.refresh();
            console.log(data.success);
          }
        })
        .catch(() => {
          console.log("Something went wrong.");
        });
    });
  };

  return (
    <Button
      size="icon"
      variant="ghost"
      type="button"
      onClick={() => onDelete(data.id)}
      disabled={isPending}
    >
      <Trash className="w-4 h-4" />
    </Button>
  );
};
