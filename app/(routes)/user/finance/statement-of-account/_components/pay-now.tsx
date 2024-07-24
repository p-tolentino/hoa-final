"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Button, Spinner, useToast } from "@chakra-ui/react";
import { createSoaPayment } from "@/server/actions/soa";
import { updateTransaction } from "@/server/actions/user-transactions";
import { PiBirdBold as Maya } from "react-icons/pi";
//import { updateTransaction } from "@/server/actions/user-transactions";
import { RiGoogleLine as GCash } from "react-icons/ri";
import { FaRegCreditCard as Card } from "react-icons/fa";
import { MonthlySoa, UserTransaction } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";

import * as z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const PaymentFormSchema = z.object({
  paymentType: z.string(),
  cardHolderName: z.string(),
  cardNumber: z
    .string({
      required_error: "Valid card number required.",
    })
    .min(16, {
      message: "Invalid card number",
    })
    .max(16, {
      message: "Invalid card number",
    }),
  monthExpiry: z
    .string()
    .min(2, {
      message: "Invalid",
    })
    .max(2, {
      message: "Invalid",
    }),
  yearExpiry: z
    .string()
    .min(2, {
      message: "Invalid",
    })
    .max(2, {
      message: "Invalid",
    }),
  code: z
    .string({
      required_error: "Valid code required.",
    })
    .min(3, {
      message: "Invalid",
    })
    .max(3, {
      message: "Invalid",
    }),
  gcashNumber: z
    .string({
      required_error: "Valid account number required.",
    })
    .min(11, {
      message: "Required",
    })
    .max(11, {
      message: "Required",
    }),
  gcashPin: z
    .string()
    .min(4, {
      message: "Required",
    })
    .max(4, {
      message: "Required",
    }),
  mayaNumber: z
    .string({
      required_error: "Valid account number required.",
    })
    .min(11, {
      message: "Required",
    })
    .max(11, {
      message: "Required",
    }),
  mayaPassword: z.string(),
});

type PaymentFormValues = z.infer<typeof PaymentFormSchema>;

export const PayNow = ({
  amountToPay,
  transactionsToUpdate,
  soa,
}: {
  amountToPay: string;
  transactionsToUpdate: UserTransaction[];
  soa: MonthlySoa | null | undefined;
}) => {
  const user = useCurrentUser();
  const router = useRouter();
  const toast = useToast();
  const { update } = useSession();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isPendings, setIsPending] = useState(false);
  const [installment, setInstallment] = useState(0);

  const formatNumber = (value: number) => {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(PaymentFormSchema),
    defaultValues: {
      paymentType: "",
    },
  });

  const paymentType = form.watch("paymentType");

  useEffect(() => {
    if (paymentType === "card") {
      form.setValue("cardHolderName", "");
      form.setValue("cardNumber", "");
      form.setValue("monthExpiry", "");
      form.setValue("yearExpiry", "");
      form.setValue("code", "");

      form.setValue("gcashNumber", "12345678900");
      form.setValue("gcashPin", "4321");

      form.setValue("mayaNumber", "12345678900");
      form.setValue("mayaPassword", "432100");
    } else if (paymentType === "gcash") {
      form.setValue("gcashNumber", "");
      form.setValue("gcashPin", "");

      form.setValue("cardHolderName", "First M. Last");
      form.setValue("cardNumber", "1111222233334444");
      form.setValue("monthExpiry", "07");
      form.setValue("yearExpiry", "77");
      form.setValue("code", "321");

      form.setValue("mayaNumber", "12345678900");
      form.setValue("mayaPassword", "432100");
    } else if (paymentType === "maya") {
      form.setValue("mayaNumber", "");
      form.setValue("mayaPassword", "");

      form.setValue("cardHolderName", "First M. Last");
      form.setValue("cardNumber", "1111222233334444");
      form.setValue("monthExpiry", "07");
      form.setValue("yearExpiry", "77");
      form.setValue("code", "321");

      form.setValue("gcashNumber", "12345678900");
      form.setValue("gcashPin", "4321");
    }
  }, [form, paymentType]);

  const onSubmit = async () => {
    if (isPendings) return; // Prevent starting another transaction while one is in progress

    setIsPending(true);

    startTransition(() => {
      const paymentData = {
        soaId: soa?.id,
        amount: parseFloat(
          (
            parseFloat(amountToPay) / parseFloat(installment.toString())
          ).toFixed(2)
        ),
      };
      createSoaPayment(paymentData).then(() => {
        // Use Promise.all to wait for all transactions to be updated
        Promise.all(
          transactionsToUpdate.map((transaction) => {
            return updateTransaction(transaction.id, {
              status: soa?.status,
              paidBy: user?.id,
              datePaid: new Date(),
            });
          })
        )
          .then((results) => {
            // Only proceed if all transactions were updated successfully
            const allUpdatesSuccessful = results.every(
              (result) => result.success
            );

            if (allUpdatesSuccessful) {
              update();
              toast({
                title: "Payment Successful",
                description: `Amount: ₱ ${formatNumber(paymentData.amount)}`,
                status: "success",
                position: "bottom-right",
                duration: 5000,
                isClosable: true,
              });
              form.reset();
              setOpen(false); // Presuming you want to close a modal or similar UI element
            }

            // Now that all transactions are updated, refresh the page once
            router.refresh();
            router.push(`/user/finance/statement-of-account`);
          })
          .catch((error) => {
            // If there was an error with any transaction, log it and potentially handle it
            console.log(error);
          })
          .finally(() => {
            setIsPending(false); // Re-enable the button by setting isPending back to false
            window.location.reload();
          });
      });
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="hide-in-print">
        <Button mt={5} fontWeight="semibold" colorScheme="green">
          Pay Now
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pay Outstanding Balance</DialogTitle>
          <DialogDescription>
            Please enter your credentials to proceed to payment.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-8 pb-3"
          >
            <div className="grid py-4 gap-y-4">
              <FormField
                control={form.control}
                name="paymentType"
                render={({ field }) => (
                  <FormItem>
                    <FormDescription>Payment Method</FormDescription>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full font-semibold">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="card">
                          <div className="flex items-center justify-center">
                            <Card className="w-4 h-4 mr-2" />
                            Pay with Card
                          </div>
                        </SelectItem>
                        <SelectItem value="gcash">
                          <div className="flex items-center justify-center">
                            <GCash className="w-4 h-4 mr-2" />
                            GCash
                          </div>
                        </SelectItem>
                        <SelectItem value="maya">
                          <div className="flex items-center justify-center">
                            <Maya className="w-4 h-4 mr-2" />
                            Maya
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("paymentType") === "card" && (
                <>
                  <FormField
                    control={form.control}
                    name="cardHolderName"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormDescription>
                          Card Number Holder&apos;s Name
                        </FormDescription>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            placeholder="First Last"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cardNumber"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormDescription>Card Number</FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isPending}
                            placeholder="XXXX - XXXX - XXXX - XXXX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex">
                    <FormField
                      control={form.control}
                      name="monthExpiry"
                      render={({ field }) => (
                        <FormItem className="w-[20%] mb-5">
                          <FormDescription>Expiry Date</FormDescription>
                          <FormControl>
                            <Input
                              placeholder="MM"
                              type="number"
                              min={1}
                              max={12}
                              minLength={2}
                              maxLength={2}
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="yearExpiry"
                      render={({ field }) => (
                        <FormItem className="w-[20%] mb-5 mr-10">
                          <FormDescription className="opacity-0">
                            Date
                          </FormDescription>
                          <FormControl>
                            <Input
                              placeholder="YY"
                              type="number"
                              min={24}
                              max={99}
                              minLength={2}
                              maxLength={2}
                              disabled={isPending}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="mb-5">
                          <FormDescription>Security Code (CVV)</FormDescription>
                          <FormControl>
                            <Input
                              disabled={isPending}
                              placeholder="XXX"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              {form.watch("paymentType") === "gcash" && (
                <>
                  <FormField
                    control={form.control}
                    name="gcashNumber"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormDescription>GCash Mobile Number</FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isPending}
                            placeholder="ex. 09XX-XXX-XXXX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gcashPin"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormDescription>GCash MPIN</FormDescription>
                        <FormControl>
                          <Input
                            className="text-2xl"
                            type="password"
                            disabled={isPending}
                            placeholder="****"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {form.watch("paymentType") === "maya" && (
                <>
                  <FormField
                    control={form.control}
                    name="mayaNumber"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormDescription>
                          Account (Mobile) Number
                        </FormDescription>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isPending}
                            placeholder="ex. 09XX-XXX-XXXX"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="mayaPassword"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormDescription>Password</FormDescription>
                        <FormControl>
                          <Input
                            className="text-2xl"
                            type="password"
                            disabled={isPending}
                            placeholder="********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {form.watch("paymentType") && (
                <FormItem>
                  <FormDescription>Installment Option</FormDescription>
                  <Select onValueChange={(e) => setInstallment(Number(e))}>
                    <FormControl>
                      <SelectTrigger className="w-full font-semibold">
                        <SelectValue placeholder="Select installment option" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={(1).toString()}>
                        <div className="flex items-center justify-center">
                          Full Payment
                        </div>
                      </SelectItem>
                      <SelectItem value={(2).toString()}>
                        <div className="flex items-center justify-center">
                          2 Installments
                        </div>
                      </SelectItem>
                      <SelectItem value={(3).toString()}>
                        <div className="flex items-center justify-center">
                          3 Installments
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            </div>
            <DialogFooter>
              <Button
                w="full"
                colorScheme="yellow"
                isDisabled={
                  isPendings || !form.watch("paymentType") || installment === 0
                }
                type="submit"
              >
                {isPendings ? (
                  <Spinner />
                ) : (
                  `Pay ${
                    amountToPay
                      ? `₱ ${formatNumber(
                          parseFloat(amountToPay) / installment
                        )}`
                      : ""
                  }                  
                 `
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
