"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PiWarningCircleLight as Warning } from "react-icons/pi";

import Link from "next/link";

const DelinquentGate = () => {
  return (
    <div className="flex items-center justify-center min-h-full align-middle">
      <Card className="w-[600px] mt-10">
        <CardHeader>
          <p className="flex justify-center text-2xl font-semibold">
            <Warning className="mr-2 text-5xl" />
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-center">
            Delinquency Notice: In order to continue using features of the
            system, kindly settle any overdue fees you have in your account. If
            you have any other concerns, please raise them to the HOA Office.
          </div>
          <div className="flex items-center justify-center">
            <Link href="/user/dashboard">
              <Button className="text-black bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-600">
                Proceed to system →
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DelinquentGate;
