import { getHoaInfo } from "@/server/data/hoa-info";
import CreateHoa from "./_components/createHoa";

const Settings = async () => {
  const hoa = await getHoaInfo();

  return <CreateHoa hoa={hoa} />;
};

export default Settings;
