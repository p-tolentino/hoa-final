import { getAllRegularMaintainService } from "@/server/data/maintenance-sched";
import MaintenanceSchedules from "./_components/schedule-list";
import { getFacilities } from "@/server/data/facilities";

export default async function RegularMaintenance() {
  const facilities = await getFacilities();

  const schedules = await getAllRegularMaintainService();

  return (
    <>
      <MaintenanceSchedules schedules={schedules} facilities={facilities} />
    </>
  );
}
