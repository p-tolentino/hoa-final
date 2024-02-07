"use server";

import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/server/data/user";
import { currentUser } from "@/lib/auth";

interface Vehicle {
  plate: string;
  // Add other vehicle properties here
}

interface PersonalInformationFormProps {
  first: string;
  middle: string;
  last: string;
  phone: string;
  birth: string;
  vehicles: Vehicle[];
  type: string;
}

export const submit = async (formData: PersonalInformationFormProps) => {
  const user = await currentUser();

  if (!user) {
    return { error: "Unauthorized" };
  }

  const dbUser = await getUserById(user.id);

  if (!dbUser) {
    return { error: "Unauthorized" };
  }

  // Use destructuring to make the code cleaner
  const { first, middle, last, phone, birth, vehicles, type } = formData;

  await db.personalInfo.create({
    data: {
      userId: dbUser.id,
      firstName: first,
      middleName: middle,
      lastName: last,
      phoneNumber: phone,
      birthDay: new Date(birth),
      vehicles: {
        create: vehicles.map((vehicle) => ({
          plateNum: vehicle.plate,
          // Add other vehicle fields here as needed
        })),
      },
      type: type,
    },
  });

  return { success: "Account Setup Complete" };
};
