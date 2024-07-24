"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";

import { RegisterSchema } from "@/server/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/server/actions/register";

import { Flex, Box, Stack, Heading, Text } from "@chakra-ui/react";
import { Social } from "@/components/auth/social";
import { Separator } from "@/components/ui/separator";
import { HomeRelation, Property } from "@prisma/client";

export const RegisterForm = ({
  properties,
}: {
  properties: Property[] | null | undefined;
}) => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      birthDay: "",
      phoneNumber: "",
      type: undefined,
      address: "",
      relation: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      register(values).then((data) => {
        setError(data.error);
        setSuccess(data.success);
      });
    });
  };

  return (
    <Box>
      <Flex
        w="100%"
        h="100%"
        justify="center"
        alignItems="center"
        mt="20"
        mb="20"
      >
        <Stack
          w="full"
          maxW="30vw"
          rounded="xl"
          boxShadow="xl"
          px="6"
          py="10"
          bg="white"
        >
          <Box mb="10px">
            <Heading
              size="lg"
              fontFamily="font.heading"
              textAlign="center"
              mb="3"
            >
              Let's get started!
            </Heading>
            <Text
              size="sm"
              fontFamily="font.body"
              textAlign="center"
              color="gray"
              mb="5"
            >
              Sign up your account below
            </Text>
          </Box>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="flex w-full space-x-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel> First Name </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="John"
                            disabled={isPending}
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
                      <FormItem className="w-full">
                        <FormLabel> Last Name </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Doe"
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex w-full space-x-4">
                  <FormField
                    control={form.control}
                    name="birthDay"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel> Date of Birth </FormLabel>
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
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-black">
                          Contact Number
                        </FormLabel>
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
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-black col-span-2">
                        Home Address
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isPending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={"Select your home address"}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {properties?.map((property) => {
                            return (
                              <SelectItem
                                key={property.id}
                                value={property.id || ""}
                              >
                                {property.address}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full space-x-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem className="space-y-3 w-full">
                        <FormLabel className="font-semibold text-black">
                          Resident Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={"Select your resident type"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Homeowner">Homeowner</SelectItem>
                            <SelectItem value="Tenant">Tenant</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="relation"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-semibold text-black">
                          Relation
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isPending}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={"Select your home relation"}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={HomeRelation.PARENT}>
                              Parent
                            </SelectItem>
                            <SelectItem value={HomeRelation.CHILD}>
                              Child
                            </SelectItem>
                            <SelectItem value={HomeRelation.HELPER}>
                              Helper
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Email </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="john.doe@example.com"
                          type="email"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Password </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Confirm Password </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="******"
                          type="password"
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button
                className="w-full font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-600"
                type="submit"
                disabled={isPending}
              >
                Sign Up
              </Button>
            </form>
          </Form>
          <Flex
            justify="center"
            alignItems="center"
            className="gap-1 p-2 my-2 text-sm"
          >
            <Separator className="w-[50%]" />
            <span className="text-gray-400">or</span>
            <Separator className="w-[50%]" />
          </Flex>
          <Social />
          <Flex justify="center" alignItems="center">
            <span className="pt-5 text-xs">
              Already have an account?
              <Link href="/login">
                <Button className="sm text-xs" variant="link">
                  Sign in →
                </Button>
              </Link>
            </span>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};
