"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";

interface ViewDocumentProps {
  title: string;
  description: string;
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const ViewDocument: React.FC<ViewDocumentProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  description,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title={title}
      description={description}
      isOpen={isOpen}
      onClose={onClose}
    >
      {imageUrl.length ? (
        <div>
          <Image src={imageUrl} alt="image" width={2000} height={2000} />
        </div>
      ) : null}
    </Modal>
  );
};
