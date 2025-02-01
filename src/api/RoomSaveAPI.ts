import { RoomSaveDto } from '@/type/room';
import axios from 'axios';

export default async function roomSaveAPI(data: RoomSaveDto) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/api/v1/rooms`, data, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    });
  } catch (error) {
    throw error;
  }
};
