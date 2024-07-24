import { Navbar } from "@/components/system/Navbar";
import Homepage from "./(routes)/(public)/homepage/page";
import { Footer } from "@/components/system/Footer";
import { getHoaInfo } from "@/server/data/hoa-info";
import { generateHoa } from "@/server/actions/hoa";

export default async function Home() {
  const existingHoaInfo = await getHoaInfo();

  // if (!existingHoaInfo) {
  //   console.log("No existing HOA; Generating...");
  //   await generateHoa().then((data) => {
  //     console.log(data.success);
  //   });
  // }

  // TODO: Automate generation of properties if(!properties), provide .json file for values

  return (
    <>
      <Navbar existingHoa={existingHoaInfo} />
      <Homepage existingHoa={existingHoaInfo} />;
      <Footer existingHoa={existingHoaInfo} />
    </>
  );
}
