import axios from 'axios';

export default async function roomJoinAPI(id: number) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_CHAT_SERVER}/api/v1/rooms/join/${id}`, {}, {
      headers: {
        'Authorization': localStorage.getItem('jwt')
      }
    });
  } catch (error) {
    throw error;
  }
};
