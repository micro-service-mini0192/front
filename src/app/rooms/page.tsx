'use client'

import { useEffect, useState } from 'react';
import { RoomFindAllDto } from '@/type/room';
import Link from 'next/link';
import roomFindAllAPI from '@/api/RoomfindAllAPI';

export default function RoomFindAll() {
  const [rooms, setRooms] = useState<RoomFindAllDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data: RoomFindAllDto[] = await roomFindAllAPI();
      setRooms(data);
    } catch (err) {
      setError('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div className="container">
      <h1>Room List</h1>
      
      {loading && <p className="findAllRoom-loading">Loading...</p>}
      {error && <p className="findAllRoom-error">{error}</p>}
      
      <div>
        {rooms.length > 0 ? (
          <ul className="findAllRoom-roomList">
            {rooms.map((room) => (
              <li key={room.id} className="findAllRoom-roomItem">
                <div className="findAllRoom-roomLinkWrapper">
                  <p>{room.id}</p>
                  <Link href={`/rooms/${room.id}`} className="findAllRoom-roomLink">
                    {room.roomName}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="findAllRoom-noRoomsText">No rooms available</p>
        )}
      </div>
      
      <Link href={`/rooms/create`} className="button" style={{margin: "5px"}}>
        Create Room
      </Link>
      <Link href={`/rooms/join`}className="button" style={{margin: "5px"}}>
        Join Room
      </Link>
    </div>
  );
}
