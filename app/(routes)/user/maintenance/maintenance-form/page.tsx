import { getAllMaintenanceTypes } from "@/server/data/maintenance-type";
import RequestForm from "./_components/request-form";
import { getFacilities } from "@/server/data/facilities";
import { getAllProperties } from "@/server/data/property";

const MaintenanceRequestForm = async () => {
  const types = await getAllMaintenanceTypes();

  const facilities = await getFacilities();

  const locations = await getAllProperties();

  if (!types || !facilities || !locations) {
    return null;
  }

  return (
    <>
      <RequestForm
        serviceTypes={types}
        facilities={facilities}
        locations={locations}
      />
    </>
  );
};

export default MaintenanceRequestForm;
