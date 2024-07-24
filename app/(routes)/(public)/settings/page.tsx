import { getHoaInfo } from "@/server/data/hoa-info";
import CreateHoa from "./_components/createHoa";
import { Box } from "@chakra-ui/react";

const Settings = async () => {
  return (
    <Box p={160}>
      <CreateHoa />
    </Box>
  );
};

export default Settings;
