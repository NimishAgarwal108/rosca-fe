// components/custom/view-room-modal.jsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function ViewRoomModal({ room, isOpen, onClose }) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{room.roomTitle}</DialogTitle>
        </DialogHeader>
        <div>
          <img src={room.images?.[0]} alt={room.roomTitle} className="w-full h-64 object-cover rounded-lg mb-4" />
          <p><strong>Location:</strong> {room.location}</p>
          <p><strong>Price:</strong> ₹{room.price.toLocaleString()}/month</p>
          {/* Add more room details */}
        </div>
        <Button onClick={onClose} className="mt-4">Close</Button>
      </DialogContent>
    </Dialog>
  );
}
