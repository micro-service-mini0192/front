import axios from 'axios';
import { MemberJoinDto } from '@/type/member';

export default async function memberJoinAPI(data: MemberJoinDto) {
  try {
    await axios.post('http://localhost:8080/members', data);
  } catch (error) {
    throw error;
  }
};
