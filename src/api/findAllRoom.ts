// utils/api.js
import { FindAllRoomDto } from '@/type/room'; // 타입 가져오기
import axios from 'axios';

export const findAllRoom = async (): Promise<FindAllRoomDto[]> => {
  try {
    const response = await axios.get(`http://localhost:8080/rooms`); // ID로 방 정보 요청
    return response.data;
  } catch (error) {
    console.error('Error fetching room details:', error);
    throw error;
  }
};
