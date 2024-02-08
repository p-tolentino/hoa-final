import { currentUser } from "@/lib/auth";
import { SettingsForm } from "./_components/settings-form";
import { getAllProperties } from "@/server/data/property";

const Settings = async () => {
  const user = await currentUser();
  const properties = await getAllProperties();

  if (!user || !properties) {
    return null;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SettingsForm initialData={user} properties={properties} />
      </div>
    </div>
  );
};

export default Settings;
