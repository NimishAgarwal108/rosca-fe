import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditRoomModal({ room, formData, isOpen, onClose, onChange, onSubmit }) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Room</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="roomTitle" className="text-sm font-medium block mb-1.5">
              Room Title
            </label>
            <Input 
              id="roomTitle"
              name="roomTitle" 
              value={formData.roomTitle || ''} 
              onChange={onChange}
              placeholder="Room title"
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="text-sm font-medium block mb-1.5">
              Location
            </label>
            <Input 
              id="location"
              name="location" 
              value={formData.location || ''} 
              onChange={onChange}
              placeholder="Location"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="text-sm font-medium block mb-1.5">
                Price (₹/month)
              </label>
              <Input 
                id="price"
                name="price" 
                value={formData.price || ''} 
                onChange={onChange}
                placeholder="Price"
                type="number"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="text-sm font-medium block mb-1.5">
                Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type || ''}
                onChange={onChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
              >
                <option value="">Select type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="room">Room</option>
                <option value="studio">Studio</option>
                <option value="villa">Villa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="beds" className="text-sm font-medium block mb-1.5">
                Beds
              </label>
              <Input 
                id="beds"
                name="beds" 
                value={formData.beds || ''} 
                onChange={onChange}
                type="number"
                min="0"
                required
              />
            </div>

            <div>
              <label htmlFor="bathrooms" className="text-sm font-medium block mb-1.5">
                Bathrooms
              </label>
              <Input 
                id="bathrooms"
                name="bathrooms" 
                value={formData.bathrooms || ''} 
                onChange={onChange}
                type="number"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">Save Changes</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}