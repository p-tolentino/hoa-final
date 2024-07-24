"use client";

import { UploadDropzone } from "@/lib/utils";
import { updateByLaws } from "@/server/actions/hoa";
import { Hoa } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useState, useEffect } from "react";
import { getHoaInfo } from "@/server/data/hoa-info";

export const PdfUpload = () => {
  const router = useRouter();
  const { update } = useSession();
  const [isPending, startTransition] = useTransition();

  // const [usersInfo, setUsersInfo] = useState<Hoa | null>();

  // useEffect(() => {
  //   const fetchHoaInfo = async () => {
  //     try {
  //     const hoaInfo = await getHoaInfo()
  //     setUsersInfo(hoaInfo); 
  //   }catch (error){
  //     console.error("Failed to fetch data:", error);
  //   }};
  //   fetchHoaInfo();
  // }, []); 

  const onSubmit = async (pdfUrl: string) => {
    startTransition(() => {
      updateByLaws(pdfUrl).then((data) => {
        if (data.success) {
          console.log(data.success);
        }
      });
    });
  };

  return (
    <div>
      <UploadDropzone
        appearance={{
          button:
            "ut-uploading:cursor-not-allowed rounded-r-none bg-[#e6c45e] text-black bg-none after:bg-[#dbac1d]",
          label: {
            color: "#ffaa00",
          },
          uploadIcon: {
            color: "#355E3B",
          },
        }}
        endpoint="pdfUploader"
        onClientUploadComplete={(res: any) => {
          onSubmit(res[0].url);
          alert("Upload Completed");
          router.refresh();
        }}
        onUploadError={(error: Error) => {
          alert(`ERROR! ${error.message}`);
        }}
      />
    </div>
  );
};

export default PdfUpload;
