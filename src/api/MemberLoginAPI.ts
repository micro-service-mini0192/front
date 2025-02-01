import axios from 'axios';
import { MemberLoginDto } from '@/type/member';

export default async function memberLoginAPI(data: MemberLoginDto) {
  const formData = new FormData();

  for (const key in data) {
    if (data.hasOwnProperty(key)) {
      formData.append(key, data[key]);
    }
  }

  try {
    console.log(`${process.env.NEXT_PUBLIC_AUTH_SERVER}`)
    const response = await axios.post(`${process.env.NEXT_PUBLIC_AUTH_SERVER}/api/v1/login`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
