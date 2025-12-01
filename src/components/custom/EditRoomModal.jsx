// components/custom/edit-room-modal.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function EditRoomModal({ room, formData, isOpen, onClose, onChange, onSubmit }) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <Input 
            name="roomTitle" 
            value={formData.roomTitle || ''} 
            onChange={onChange}
            placeholder="Room title"
            className="mb-4"
          />
          <Input 
            name="price" 
            value={formData.price || ''} 
            onChange={onChange}
            placeholder="Price"
            type="number"
            className="mb-4"
          />
          {/* Add more fields */}
          <div className="flex gap-2">
            <Button type="submit">Save</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
