import { db } from "@/lib/db";

export const getAllProperties = async () => {
  try {
    const properties = await db.property.findMany({
      include: {
        documents: true,
      },
    });

    return properties;
  } catch {
    return null;
  }
};
