import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

// DeleteDialogBox component shows a confirmation modal for deletion
const DeleteDialogBox = ({
  description,
  onDelete,
  deleteHandleModalClose,
  deleteOpenModal,
  deleteLoading,
}) => {
  return (
    <Dialog open={deleteOpenModal} onOpenChange={deleteHandleModalClose}>
      <DialogContent className="custom-modal">
        <DialogHeader className="!text-center">
          <DialogTitle className="!text-2xl">Delete Confirmation</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter className="!justify-center">
          <Button
            onClick={deleteHandleModalClose}
            color="primary"
            className="site-button cursor-pointer rounded-6 !shadow-none"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            disabled={deleteLoading}
            color="error"
            autoFocus
            className="site-button bg-red-500 cursor-pointer rounded-6 !shadow-none"
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialogBox;
