import axios from 'axios';
import { MemberJoinDto } from '@/type/member';

export default async function memberJoinAPI(data: MemberJoinDto) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/v1/members`, data);
  } catch (error) {
    throw error;
  }
};
