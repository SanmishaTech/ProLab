import { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import axios from "axios";
// import { Button } from "@/components/ui/button";

export default function AlertDialogbox({
  url,
  backdrop = "blur",
  isOpen,
  onOpen,
}) {
  console.log("This is Delete url", url);
  const DeleteApi = async () => {
    console.log("This is Delete url", `/api/${url}`);
    await axios.delete(`/api/department/delete/${url}`);
    window.location.reload();
  };
  const onClose = () => {
    onOpen();
  };

  useEffect(() => {
    console.log("Fetching idasdsadasdasd", isOpen);
  }, [isOpen]);

  return (
    <>
      <Modal backdrop={backdrop} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete Item
              </ModalHeader>
              <ModalBody>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={DeleteApi}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
