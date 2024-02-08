"use client";

import * as z from "zod";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { VehicleSchema } from "@/server/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

interface AddVehicleProps {
  onSubmitVehicle: () => void;
}

const AddVehicle = ({ onSubmitVehicle }: AddVehicleProps) => {
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof VehicleSchema>>({
    resolver: zodResolver(VehicleSchema),
    defaultValues: {
      plateNum: "",
    },
  });

  return (
    <div className="flex items-center w-full max-w-sm space-x-2">
      <FormField
        control={form.control}
        name="plateNum"
        render={({ field }) => (
          <>
            <FormItem>
              <FormLabel>Plate Number</FormLabel>
              <FormControl>
                <Input disabled={isPending} placeholder="ZZZ-999" {...field} />
              </FormControl>
              <FormMessage />
              <Button
                disabled={isPending}
                className="text-black bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-600"
                type="button"
                onClick={form.handleSubmit(() => {
                  console.log(field.value);
                })}
              >
                Add Vehicle
              </Button>
            </FormItem>
          </>
        )}
      />
    </div>
  );
};

export default AddVehicle;
