import React from "react";
import { Box, FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { UploadDropzone } from "@/lib/utils";
import { Json } from "@uploadthing/shared";
import { UploadThingError } from "uploadthing/server";

const FileUploadField = () => {
  const { setValue } = useFormContext();
  const toast = useToast();

  const handleUploadComplete = (url: string) => {
    setValue("logoImg", url, { shouldValidate: true });
    toast({
      title: "Upload successful",
      description: "Your file has been uploaded successfully.",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };

  const handleUploadError = (error: UploadThingError<Json>) => {
    toast({
      title: "Upload failed",
      description: `File upload failed: ${error.message}`,
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box py="10px">
      <FormControl>
        <FormLabel fontSize="sm" fontWeight="semibold">
          Upload Contact/Organization Image
        </FormLabel>
        <UploadDropzone
          appearance={{
            button:
              "ut-uploading:cursor-not-allowed rounded-r-none bg-[#e6c45e] text-black bg-none after:bg-[#dbac1d]",
            label: { color: "#ffaa00" },
            uploadIcon: { color: "#355E3B" },
          }}
          endpoint="mixedUploader" // Adjust this endpoint as needed
          onClientUploadComplete={(res) => handleUploadComplete(res[0].url)}
          onUploadError={(error) => handleUploadError(error)}
        />
      </FormControl>
    </Box>
  );
};

export default FileUploadField;
