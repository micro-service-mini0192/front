'use client'

import { useEffect, useState } from 'react';
import { FindAllRoomDto } from '@/type/room';
import { findAllRoom } from '@/api/findAllRoom';
import Link from 'next/link';

export default function FindAll() {
  const [rooms, setRooms] = useState<FindAllRoomDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const roomsData = await findAllRoom();
      setRooms(roomsData);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Room List</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {rooms.length > 0 ? (
          <ul>
            {rooms.map((room) => (
              <li key={room.id} style={{ marginBottom: '15px' }}>
                <div
                  style={{
                    border: '1px solid #ccc',
                    padding: '15px',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <Link href={`/rooms/${ room.id }`}>{room.roomName}</Link>
                  <p>ID: { room.id }</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rooms available</p>
        )}
      </div>
      <Link
        href={`/create-room`}
        style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Create Room
      </Link>
    </div>
  );
}
