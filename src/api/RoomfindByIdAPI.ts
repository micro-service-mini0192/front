import { RoomFindByIdDto } from '@/type/room'; // 타입 가져오기
import axios from 'axios';

export default async function roomFindByIdAPI(id: number): Promise<RoomFindByIdDto> {
  try {
    const response = await axios.get(`http://localhost:8080/rooms/${id}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
