import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRoomStore } from "@/store/roomStore";
import { toast } from "react-hot-toast";

const RequestModal = ({ room, isOpen, onClose }) => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestRoom } = useRoomStore();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      const result = await requestRoom(room._id, message);
      if (result.success) {
        toast.success('Room request sent successfully!');
        onClose();
        setMessage('');
      }
    } catch (error) {
      toast.error('Failed to send room request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to Rent Room</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">{room.title}</h3>
            <p className="text-sm text-gray-600">{room.address?.city}, {room.address?.state}</p>
          </div>
          <div>
            <label className="text-sm font-medium">Message to Owner</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the owner why you're interested in this room..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Sending...' : 'Send Request'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RequestModal;