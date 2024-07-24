"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaUserShield as Admin } from "react-icons/fa";

import Link from "next/link";
import { FormError } from "@/components/form-error";

const AdminGate = () => {
  return (
    <div className="flex items-center justify-center min-h-full align-middle">
      <Card className="w-[600px] mt-10">
        <CardHeader>
          <p className="flex justify-center text-2xl font-semibold">
            <Admin className="mr-2 text-3xl" />
            Sign In with your Personal Account
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormError message="You do not have permission to view this page." />
          <div className="flex items-center justify-center">
            You are trying to access user modules as System Administrator. If
            you have a user account try logging in with it instead.
          </div>
          <div className="flex items-center justify-center">
            <Link href="/admin/membership">
              <Button className="text-black bg-yellow-400 hover:bg-yellow-500 focus:bg-yellow-600">
                Go to User Directory
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGate;
