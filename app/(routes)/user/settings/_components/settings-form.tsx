"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { PersonalInfoSchema } from "@/server/schemas";
import { useSession } from "next-auth/react";
import { updateInfo } from "@/server/actions/user-info";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { ExtendedUser } from "@/next-auth";
import { Property } from "@prisma/client";
import { updatePropertyOwner } from "@/server/actions/property";

interface SettingsFormProps {
  initialData: ExtendedUser;
  properties: Property[];
}

type SettingsFormValues = z.infer<typeof PersonalInfoSchema>;

export const SettingsForm: React.FC<SettingsFormProps> = ({
  initialData,
  properties,
}) => {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(PersonalInfoSchema),
    defaultValues: {
      firstName: initialData?.info?.firstName || undefined,
      middleName: initialData?.info?.middleName || undefined,
      lastName: initialData?.info?.lastName || undefined,
      birthDay: initialData?.info?.birthDay
        ? new Date(initialData?.info?.birthDay)?.toISOString().split("T")[0]
        : undefined,
      phoneNumber: initialData?.info?.phoneNumber || "",
      type: initialData?.info?.type || undefined,
      address: initialData?.info?.address || undefined,
    },
  });

  const onSubmit = async (values: SettingsFormValues) => {
    startTransition(() => {
      updateInfo(values)
        .then((data) => {
          if (data.error) {
            console.log(data.error);
          }

          if (data.success) {
            console.log(data.success);

            const occupant = values.firstName + " " + values.lastName;

            updatePropertyOwner(values.address, initialData?.id, occupant)
              .then((data) => {
                if (data.error) {
                  console.log(data.error);
                }

                if (data.success) {
                  update();
                  form.reset();
                  router.replace("/user");
                  console.log(data.success);
                }
              })
              .catch(() => {
                console.log("Something went wrong.");
              });
          }
        })
        .catch(() => {
          console.log("Something went wrong.");
        });
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <Heading title="Member Information" description="" />
      </div>
      <Separator className="my-2" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="grid w-[70vw] grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">
                    Complete Name
                  </FormLabel>

                  <FormDescription>Given Name</FormDescription>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="First Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold opacity-0">
                    Complete Name
                  </FormLabel>
                  <FormDescription>Middle Name</FormDescription>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Middle Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold opacity-0">
                    Complete Name:
                  </FormLabel>
                  <FormDescription>Last Name</FormDescription>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Last Name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid w-[70vw] grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="birthDay"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Number</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="09XX-XXX-XXXX"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="space-y-3 ">
                  <FormLabel>Member Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex p-1 space-x-10 space-y-1"
                      disabled={isPending}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Homeowner" />
                        </FormControl>
                        <FormLabel className="font-normal">Homeowner</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="Tenant" />
                        </FormControl>
                        <FormLabel className="font-normal">Tenant</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-[70vw] gap-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home Address</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your home address" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {properties.map((property) => {
                        if (
                          property.userId === initialData.id ||
                          !property.userId
                        ) {
                          return (
                            <SelectItem key={property.id} value={property.id}>
                              {property.address}
                            </SelectItem>
                          );
                        }
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            disabled={isPending}
            className="text-black bg-yellow-400 end hover:bg-yellow-500 focus:bg-yellow-600"
            type="submit"
          >
            Save changes
          </Button>
        </form>
      </Form>
    </div>
  );
};
