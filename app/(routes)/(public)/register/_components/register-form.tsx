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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { register } from "@/server/actions/register";

import { Flex, Box, Stack, Heading, Text } from "@chakra-ui/react";
import { Social } from "@/components/auth/social";
import { Separator } from "@/components/ui/separator";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
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
            <span className="pt-5 text-sm">
              Already have an account?
              <Link href="/login">
                <Button className="sm" variant="link">
                  Login →
                </Button>
              </Link>
            </span>
          </Flex>
        </Stack>
      </Flex>
    </Box>
  );
};
