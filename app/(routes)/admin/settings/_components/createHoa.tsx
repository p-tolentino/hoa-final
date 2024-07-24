"use client";

import { Heading } from "@/components/ui/heading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Button,
  FormControl,
  FormLabel,
  FormHelperText,
  SimpleGrid,
} from "@chakra-ui/react";

import { FiUpload } from "react-icons/fi"; // FiUpload is an upload icon from Feather Icons within React Icons

import {
  Form,
  FormControl as ShadControl,
  FormField,
} from "@/components/ui/form";

import { Hoa } from "@prisma/client";
import PdfUpload from "./pdf-upload";
import { newHoaSchema } from "@/server/schemas";
import { createHoa } from "@/server/actions/hoa";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@chakra-ui/react";
import BackButton from "@/components/system/BackButton";

type HoaFormValues = z.infer<typeof newHoaSchema>;

function CreateHoa({ hoa }: { hoa: Hoa | null | undefined }) {
  const router = useRouter();
  const toast = useToast(); // Initialize the useToast hook

  const { update } = useSession();

  const form = useForm<HoaFormValues>({
    resolver: zodResolver(newHoaSchema),
    defaultValues: {
      name: hoa?.name || "",
      contactNumber: hoa?.contactNumber.toString() || "",
      funds: hoa?.funds.toString() || "",
      fixedDue: hoa?.fixedDue?.toString(), //
      officerTerm: hoa?.officerTerm?.toString() || "",
      overdueDelinquent: hoa?.overdueDelinquent?.toString() || "",
      violationDelinquent: hoa?.violationDelinquent?.toString() || "",
      cancelFee: hoa?.cancellationFee?.toString() || "",
    },
  });

  const onSubmit = async (values: HoaFormValues) => {
    try {
      await createHoa(values);

      const updatedValues = {
        ...values,
        officerTerm: values.officerTerm.toString(),
        contactNumber: values.contactNumber.toString(), // Ensure the number is converted back to a string if necessary
        funds: values.funds.toString(), // Same for funds
        fixedDue: values.fixedDue.toString(),
        cancelFee: values.cancelFee.toString(),
      };

      form.reset(updatedValues);

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
      <Heading
        title="Admin Settings"
        description="Configure your HOA's settings and preferences"
        rightElements={<BackButton />}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <SimpleGrid columns={2} gap={8}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Name of the Homeowners Association:
                  </FormLabel>
                  <Input
                    w="full"
                    size="sm"
                    type="string"
                    {...field}
                    fontFamily="font.body"
                    placeholder="Homeowners Association Name"
                  />
                </FormControl>
              )}
            />
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

            <FormField
              control={form.control}
              name="funds"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Funds of the Homeowners Association (in PHP):
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    {...field}
                    fontFamily="font.body"
                    placeholder="Current Funds"
                    disabled={field.value !== ""}
                  />
                  <FormHelperText
                    fontSize="xs"
                    fontFamily="font.body"
                    w="90%"
                    textAlign="justify"
                  >
                    The homeowners association funds will be reflected in the
                    finance management, specifically in the revenue and expense
                    page.
                  </FormHelperText>
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="fixedDue"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Monthly Association Due of the Association (in PHP)
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    {...field}
                    fontFamily="font.body"
                    placeholder="Amount"
                  />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="overdueDelinquent"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Months Overdue for Delinquency
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    max={10}
                    {...field}
                    fontFamily="font.body"
                    placeholder="Amount"
                  />
                </FormControl>
              )}
            />
            <FormField
              control={form.control}
              name="violationDelinquent"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Number of Violations for Delinquency
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    max={10}
                    {...field}
                    fontFamily="font.body"
                    placeholder="Amount"
                  />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="cancelPeriod"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Cancellation Period (days before reservation)
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    max={10}
                    {...field}
                    fontFamily="font.body"
                    placeholder="0"
                  />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="cancelFee"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Cancellation Fee (in PHP)
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    {...field}
                    fontFamily="font.body"
                    placeholder="Amount"
                  />
                </FormControl>
              )}
            />

            <FormField
              control={form.control}
              name="officerTerm"
              render={({ field }) => (
                <FormControl isRequired>
                  <FormLabel fontSize="sm" fontWeight="semibold">
                    Officer Term of Office (in years)
                  </FormLabel>
                  <Input
                    w="auto"
                    size="sm"
                    type="number"
                    max={10}
                    {...field}
                    fontFamily="font.body"
                    placeholder="Amount"
                  />
                </FormControl>
              )}
            />

            <Stack spacing={1} w="90%">
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
              <Text fontSize="sm" fontFamily="font.body" textAlign="justify">
                The uploaded homeowners association bylaws will be displayed in
                the community engagement feature, enabling homeowners to have
                access on the bylaws.
              </Text>
            </Stack>
          </SimpleGrid>

          <Box>
            <Button size="sm" type="submit" colorScheme="yellow" mt={10}>
              Save Changes
            </Button>
          </Box>
        </form>
      </Form>
    </div>
  );
}
export default CreateHoa;
