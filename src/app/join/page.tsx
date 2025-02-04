'use client'

import memberJoinAPI from "@/api/MemberJoinAPI";
import { Button, Input } from "@nextui-org/react";
import { MemberJoinDto } from "@/type/member";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Login() {
  const route = useRouter();
  const { register, handleSubmit } = useForm<MemberJoinDto>();

  const onSubmit = async (data: MemberJoinDto) => {
    if(!data) return;
    try {
      await memberJoinAPI(data);
      route.push("/login");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mid">
      <div className="box inline">
        <h1>JOIN</h1>
        <form
          onSubmit={ handleSubmit(onSubmit) }
        >
          <Input
            type="text"
            placeholder="USERNAME"
            {...register("username")}
          />

          <Input
            type="password"
            placeholder="PASSWORD"
            {...register("password")}
          />

          <Input
            type="text"
            placeholder="NICKNAME"
            {...register("nickname")}
          />

          <Button type="submit" className="button">
            Join
          </Button>
        </form>
      </div>
    </div>
  );
}
