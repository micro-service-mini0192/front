'use client'

import memberLoginAPI from "@/api/MemberLoginAPI";
import { MemberLoginDto } from "@/type/member";
import { Button, Input } from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export default function Login() {
  const route = useRouter();
  const { register, handleSubmit } = useForm<MemberLoginDto>();

  const onSubmit = async (data: MemberLoginDto) => {
      if(!data) return;
      try {
        const response = await memberLoginAPI(data);
        localStorage.setItem('jwt', response.headers.authorization)
        route.push("/");
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className="mid">
      <div className="box">
        <h1>LOGIN</h1>
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

          <Button type="submit" className="button inline" style={{margin: "5px"}}>
            Login
          </Button>
          <Link href={`/join`} className="button inline" style={{margin: "5px"}}>
            Join
          </Link>
        </form>
      </div>
    </div>
  );
}
