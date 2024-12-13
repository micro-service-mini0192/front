'use client'

import { saveRoom } from '@/api/saveRoom';
import { FindByIdRoomDto } from '@/type/room';
import { useState } from 'react';

export default function CreateRoom() {
  const [roomName, setRoomName] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('');
  const [message, setMessage] = useState('');

  const handleSaveRoom = async () => {
    try {
      const roomData = { roomName, roomCapacity };
      const result: FindByIdRoomDto = await saveRoom(roomData);
      alert("created")
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div>
      <h1>Save Room</h1>
      <input
        type="text"
        placeholder="Room Name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <button onClick={handleSaveRoom}>Save Room</button>

      {message && <p>{message}</p>}
    </div>
  );
}
