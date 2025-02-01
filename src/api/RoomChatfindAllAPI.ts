import { RoomChatFindAllDto } from '@/type/room'; // 타입 가져오기
import axios from 'axios';

export default async function roomChatFindAllAPI(id: number, page:number): Promise<RoomChatFindAllDto> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/api/v1/rooms/chats/${id}?page=${page}`, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    }); // ID로 방 정보 요청
    return response.data;
  } catch (error) {
    throw error;
  }
};
