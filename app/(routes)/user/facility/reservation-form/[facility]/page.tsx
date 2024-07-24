import { db } from "@/lib/db";
import ReservationForm from "./_components/reservationForm";
import { getHoaInfo } from "@/server/data/hoa-info";

export const ReservationPage = async ({
  params,
}: {
  params: { facility: string };
}) => {
  const hoaInfo = await getHoaInfo();

  if (!hoaInfo) {
    return null;
  }

  const facilities = await db.facility.findUnique({
    where: {
      id: params.facility,
    },
  });

  const facilityLoc = facilities?.name;

  const reservations = await db.facilityReservation.findMany({
    where: {
      facilityId: params.facility,
    },
  });

  const regularMaintenance = await db.maintenanceSchedule.findMany({
    where: {
      service: {
        facilityId: params.facility,
      },
    },
    include: { service: true },
  });

  const maintenance = await db.maintenanceNotice.findMany({
    where: {
      location: facilityLoc,
    },
  });

  return (
    <div>
      <ReservationForm
        facility={facilities}
        reservations={reservations}
        regMaintenance={regularMaintenance}
        maintenance={maintenance}
        hoaInfo={hoaInfo}
      />
    </div>
  );
};

export default ReservationPage;
