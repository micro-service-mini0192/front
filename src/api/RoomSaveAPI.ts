import { RoomSaveDto } from '@/type/room';
import axios from 'axios';

export default async function roomSaveAPI(data: RoomSaveDto) {
  try {
    await axios.post('http://localhost:8080/rooms', data, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    });
  } catch (error) {
    throw error;
  }
};
