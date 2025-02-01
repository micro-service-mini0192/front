'use client'

import roomJoinAPI from '@/api/RoomJoinAPI';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type dataDto = {
    id: number
}
export default function RoomSave() {
  const route = useRouter();
  const { register, handleSubmit } = useForm<dataDto>();

  const onSubmit = async (data: dataDto) => {
    try {
      await roomJoinAPI(data.id);
      route.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Join Room</h1>
      <form
        onSubmit={ handleSubmit(onSubmit) }
      >
        <Input
          type="text"
          placeholder='ROOM ID'
          {...register("id")}
        />

        <Button type="submit" className="button">
          Create Room
        </Button>
      </form>
    </div>
  );
}
