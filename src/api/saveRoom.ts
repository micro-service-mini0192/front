// utils/api.js
import { FindByIdRoomDto, SaveRoomDto } from '@/type/room';
import axios from 'axios';

export const saveRoom = async (data: SaveRoomDto): Promise<FindByIdRoomDto> => {
  try {
    const response = await axios.post('http://localhost:8080/rooms', data);
    return response.data;
  } catch (error) {
    console.error("Error saving room:", error);
    throw error;
  }
};
