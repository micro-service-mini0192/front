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
    <div>
      <h1>Room List</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <div>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li key={room.id}>
                <div>
                  <Link href={`/rooms/${ room.id }`}>{ room.roomName }</Link>
                  <p>ID: { room.id }</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rooms available</p>
        )}
      </div>
      <Link href={`/saveRooms`}>
        Create Room
      </Link>
    </div>
  );
}
