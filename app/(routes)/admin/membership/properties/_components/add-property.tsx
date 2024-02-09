"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { PropertySchema } from "@/server/schemas";
import { useSession } from "next-auth/react";
import { updateProperty } from "@/server/actions/property";
import { useRouter } from "next/navigation";

import { LuPlus as Plus } from "react-icons/lu";

type PropertyFormValues = z.infer<typeof PropertySchema>;

export const AddProperty = () => {
  const router = useRouter();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(PropertySchema),
    defaultValues: {
      address: undefined,
      lotNumber: undefined,
      lotSize: undefined,
      purchaseDate: undefined,
    },
  });

  const onSubmit = async (values: PropertyFormValues) => {
    startTransition(() => {
      updateProperty(values, "")
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          }

          if (data.success) {
            update();
            setOpen(false);
            form.reset();
            router.refresh();
            console.log(data.success);
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-black bg-yellow-400 end hover:bg-yellow-500 focus:bg-yellow-600">
          <Plus className="w-4 h-4 mr-2" />
          New Property
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Property</DialogTitle>
          <DialogDescription>
            Create new data for a property in your area. Click "add" when you're
            done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8"
          >
            <div className="grid py-4 gap-y-4">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormDescription>Complete Property Address</FormDescription>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="123 Street, ABC Subdividion, Example City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* change to street? */}
              <FormField
                control={form.control}
                name="lotNumber"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormDescription>Lot Number</FormDescription>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Lot 21 Block 14"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lotSize"
                render={({ field }) => (
                  <FormItem className="mb-5">
                    <FormDescription>
                      Lot Size (in square meters)
                    </FormDescription>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Purchase</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        disabled={isPending}
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={isPending}
                className="text-black bg-yellow-400 end hover:bg-yellow-500 focus:bg-yellow-600"
                type="submit"
              >
                Add Property
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
