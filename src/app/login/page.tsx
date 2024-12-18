'use client'

import memberLoginAPI from "@/api/MemberLoginAPI";
import { MemberLoginDto } from "@/type/member";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();

  const submit = async () => {
    try {
      const data: MemberLoginDto = {
        username: username,
        password: password
      }
      const response = await memberLoginAPI(data);
      localStorage.setItem('jwt', response.headers.authorization)
      console.log(response);
      route.push("/");
    } catch (error) {
      alert("Login fail");
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="USERNAME"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <br/>
      <input
        type="text"
        placeholder="PASSWORD"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br/>
      <button onClick={submit}>Login</button>
      <Link href={`/join`}>
        Join
      </Link>
    </div>
  );
}
