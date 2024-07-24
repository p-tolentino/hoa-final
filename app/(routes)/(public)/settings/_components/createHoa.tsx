"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Input,
  Text,
  HStack,
  Stack,
  Box,
  Divider,
  Radio,
  RadioGroup,
  Button,
  Textarea,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";

import { FiUpload } from "react-icons/fi"; // FiUpload is an upload icon from Feather Icons within React Icons

import {
  Form,
  FormControl as ShadControl,
  FormDescription,
  FormField,
  FormItem,
  //FormLabel,
  FormMessage,
} from "@/components/ui/form";

import Link from "next/link";
import { RxArrowRight as RightArrow } from "react-icons/rx";
import { Hoa } from "@prisma/client";
import PdfUpload from "./pdf-upload";
import { newHoaSchema } from "@/server/schemas";
import { useState } from "react";
import { createHoa } from "@/server/actions/hoa";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getHoaInfo } from "@/server/data/hoa-info";
import { useToast } from "@chakra-ui/react";

type HoaFormValues = z.infer<typeof newHoaSchema>;

function CreateHoa() {
  const router = useRouter();
  const toast = useToast(); // Initialize the useToast hook

  const { update } = useSession();

  const form = useForm<HoaFormValues>({
    resolver: zodResolver(newHoaSchema),
    defaultValues: {
      name: "",
      contactNumber:"",
      funds: "",
      fixedDue: "",
    },
  });

  const onSubmit = async (values: HoaFormValues) => {
    try {
      await createHoa(values);
      // Manually convert contactNumber to a number
      console.log("the submitted values are", values);
      const updatedValues = {
        ...values,
        contactNumber: values.contactNumber.toString(), // Ensure the number is converted back to a string if necessary
        funds: values.funds.toString(), // Same for funds
        fixedDue: values.fixedDue.toString(),
      };
      form.reset(updatedValues);
      // setHoaInfo({
      //   ...hoaInfo,
      //   // ...updatedValues,
      //   // contactNumber: Number(values.contactNumber),
      //   // funds: Number(values.funds),
      // });
      update();
      router.refresh(); // Refresh the page or navigate as needed
      toast({
        title: "HOA Updated",
        description: "The HOA information has been successfully updated.",
        status: "success",
        duration: 5000, // 5 seconds
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to create HOA:", error);
      toast({
        title: "Error",
        description: "Failed to update the HOA information.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between">
        <Heading
          title="Admin Settings"
          description="Configure your HOA's settings and preferences"
        />
        {/* <Link href="/user/settings">
          <Button size="sm" colorScheme="yellow">
            User Settings
            <RightArrow className="w-4 h-4 ml-2" />
          </Button>
        </Link> */}
      </div>
      <Separator className="mt-4 mb-6" />

      <Stack spacing={8}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Stack spacing={5}>
              <HStack gap={5}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Name of the Homeowners Association:
                      </FormLabel>
                      <Input
                        w="60%"
                        size="sm"
                        type="string"
                        {...field}
                        fontFamily="font.body"
                        placeholder="Homeowners Association Name"
                      />
                    </FormControl>
                  )}
                />
              </HStack>

              <HStack gap={5}>
                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Contact Number of the Homeowners Association:
                      </FormLabel>
                      <Input
                        w="60%"
                        size="sm"
                        type="number"
                        {...field}
                        fontFamily="font.body"
                        placeholder="Homeowners Association Contact Number"
                      />
                    </FormControl>
                  )}
                />
              </HStack>

              <HStack gap={5}>
                <FormField
                  control={form.control}
                  name="funds"
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Funds of the Homeowners Association:
                      </FormLabel>
                      <Input
                        w="60%"
                        size="sm"
                        type="number"
                        {...field}
                        fontFamily="font.body"
                        placeholder="Current Funds"
                      />
                    </FormControl>
                  )}
                />
              </HStack>

              <HStack gap={5}>
                <FormField
                  control={form.control}
                  name="fixedDue"
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontSize="sm" fontWeight="semibold">
                        Fixed Monthly Association Due of the Association
                      </FormLabel>
                      <Input
                        w="60%"
                        size="sm"
                        type="number"
                        {...field}
                        fontFamily="font.body"
                        placeholder="Amount"
                      />
                    </FormControl>
                  )}
                />
              </HStack>

              <Text fontSize="sm" fontFamily="font.body" mt={-5}>
                The homeowners association funds will be reflected in the
                finance management feature, specifically in the income and
                expense management page.
              </Text>

              <Box>
                <Button size="xs" type="submit" colorScheme="yellow">
                  Save Changes
                </Button>
              </Box>
            </Stack>
          </form>
        </Form>

        <Stack spacing={1}>
          <HStack gap={5}>
            <Text fontSize="sm" fontWeight="semibold">
              Upload Homeowners' Association Bylaws:
            </Text>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="xs" // Medium size for better visibility
                  colorScheme="green" // A vibrant color scheme for attraction
                  leftIcon={<FiUpload />} // Assuming you have an UploadIcon component
                  fontWeight="bold" // Bold font weight for emphasis
                  boxShadow="sm" // A subtle shadow to make it pop a bit
                  _hover={{ boxShadow: "md" }} // Slightly larger shadow on hover for interactivity
                  _active={{ boxShadow: "lg" }} // Larger shadow on active for a pressing effect
                >
                  Upload Bylaws
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    Upload Homeowners' Association Bylaws
                  </DialogTitle>
                  <DialogDescription>
                    "Upload the latest Homeowners' Association Bylaws for
                    members to view."
                  </DialogDescription>
                </DialogHeader>
                {/* File input */}
                <PdfUpload />
              </DialogContent>
            </Dialog>
          </HStack>
          <Text fontSize="sm" fontFamily="font.body">
            The uploaded homeowners association bylaws will be displayed in the
            community engagement feature, enabling homeowners to have access on
            the bylaws.
          </Text>
        </Stack>
      </Stack>
    </div>
  );
}
export default CreateHoa;
