'use client'

import roomSaveAPI from '@/api/RoomSaveAPI';
import { RoomSaveDto } from '@/type/room';
import { Button, Input } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function RoomSave() {
  const route = useRouter();
  const { register, handleSubmit } = useForm<RoomSaveDto>();

  const onSubmit = async (data: RoomSaveDto) => {
    try {
      await roomSaveAPI(data);
      route.back();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Save Room</h1>
      <form
        onSubmit={ handleSubmit(onSubmit) }
      >
        <Input
          type="text"
          placeholder='ROOM NAME'
          {...register("roomName")}
        />

        <Button type="submit" className="button">
          Create Room
        </Button>
      </form>
    </div>
  );
}
