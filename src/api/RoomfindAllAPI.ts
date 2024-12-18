import { RoomFindAllDto } from '@/type/room'; // 타입 가져오기
import axios from 'axios';

export default async function roomFindAllAPI(): Promise<RoomFindAllDto[]> {
  try {
    const response = await axios.get(`http://localhost:8080/rooms`, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    }); // ID로 방 정보 요청
    return response.data;
  } catch (error) {
    throw error;
  }
};
