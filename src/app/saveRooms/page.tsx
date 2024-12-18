'use client'

import roomSaveAPI from '@/api/RoomSaveAPI';
import { RoomSaveDto } from '@/type/room';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RoomSave() {
  const [roomName, setRoomName] = useState('');
  const route = useRouter();

  const submit = async () => {
    try {
      const data: RoomSaveDto = {
          roomName: roomName
      };
      await roomSaveAPI(data);
      alert("Create successful");
      route.back();
    } catch (error) {
      alert("Create fail");
      console.log(error);
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
      <button onClick={submit}>Save Room</button>
    </div>
  );
}
