"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Link from "next/link";

import { LoginSchema } from "@/server/schemas";
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
import { login } from "@/server/actions/login";

import { Flex, Box, Stack, Heading, Text, HStack } from "@chakra-ui/react";

import { Social } from "@/components/auth/social";
import { Separator } from "@/components/ui/separator";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider" // "Try signing in with Google using this email"
      : "";

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl).then((data) => {
        if (data?.error) {
          form.reset();
          setError(data.error);
        }
      });
    });
  };

  return (
    <>
      <Flex h="100vh" justify="center" alignItems="center">
        <Stack
          w="full"
          maxW="md"
          rounded="xl"
          boxShadow="lg"
          px="6"
          py="10"
          bg="white"
        >
          <Box mb="10px">
            <Heading size="lg" textAlign="left" fontFamily="font.heading">
              Welcome back!
            </Heading>
            <Text
              size="sm"
              fontFamily="font.body"
              textAlign="left"
              color="gray"
              mb="5"
            >
              Log in with your account
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
                          placeholder="email.address@example.com"
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
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/reset">Forgot password?</Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormError message={error || urlError} />
              <FormSuccess message={success} />
              <Button
                className="w-full font-bold text-black bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-600"
                type="submit"
                disabled={isPending}
              >
                Login
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
              Don't have an account yet?
              <Link href="/register">
                <Button className="sm" variant="link">
                  Sign up now →
                </Button>
              </Link>
            </span>
          </Flex>
        </Stack>
      </Flex>
    </>
  );
};

export default LoginForm;
