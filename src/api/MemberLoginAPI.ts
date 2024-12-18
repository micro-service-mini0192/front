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
    const response = await axios.post('http://localhost:8080/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    throw error;
  }
};
