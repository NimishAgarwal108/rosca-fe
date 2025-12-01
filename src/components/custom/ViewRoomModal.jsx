// components/custom/view-room-modal.jsx
export default function ViewRoomModal({ room, isOpen, onClose }) {
  if (!room) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{room.roomTitle}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-80 rounded-lg overflow-hidden bg-gray-100">
            {room.images?.[0] ? (
              <img 
                src={room.images[0]} 
                alt={room.roomTitle} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full text-6xl">🏠</div>';
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-6xl">🏠</div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Location</p>
                <p className="font-medium flex items-center gap-2">
                  <span>📍</span> {room.location}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Price</p>
                <p className="font-semibold text-indigo-600 text-xl flex items-center gap-2">
                  <span>💰</span> ₹{room.price.toLocaleString()}/month
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Type</p>
                <p className="font-medium capitalize">{room.type}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500 mb-1">Bedrooms</p>
                <p className="font-medium flex items-center gap-2">
                  <span>🛏️</span> {room.beds}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Bathrooms</p>
                <p className="font-medium flex items-center gap-2">
                  <span>🚿</span> {room.bathrooms}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Views</p>
                <p className="font-medium flex items-center gap-2">
                  <span>👁️</span> {room.views || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Description if you have it */}
          {room.description && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Description</p>
              <p className="text-gray-700 leading-relaxed">{room.description}</p>
            </div>
          )}

          {/* All Images if multiple */}
          {room.images && room.images.length > 1 && (
            <div>
              <p className="text-sm text-gray-500 mb-3">All Photos</p>
              <div className="grid grid-cols-3 gap-3">
                {room.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${room.roomTitle} ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Button onClick={onClose} className="mt-6 w-full">Close</Button>
      </DialogContent>
    </Dialog>
  );
}