import { currentUser } from "@/lib/auth";
import { SettingsForm } from "./_components/settings-form";

const Settings = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  return (
    <div className="flex-col">
      <div className="flex-1 p-8 pt-6 space-y-4">
        <SettingsForm initialData={user} />
      </div>
    </div>
  );
};

export default Settings;
