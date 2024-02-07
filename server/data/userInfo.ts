import { db } from "@/lib/db";

export const getInfoById = async (id: string) => {
  try {
    const info = await db.personalInfo.findUnique({
      where: { userId: id },
      include: {
        vehicles: true,
      },
    });

    return info;
  } catch {
    return null;
  }
};
