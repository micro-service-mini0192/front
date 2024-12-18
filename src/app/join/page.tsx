'use client'

import memberJoinAPI from "@/api/MemberJoinAPI";
import { MemberJoinDto } from "@/type/member";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const route = useRouter();

  const submit = async () => {
    try {
      const data: MemberJoinDto = {
        username: username,
        password: password
      }
      await memberJoinAPI(data);
      route.push("/login");
    } catch (error) {
      alert("Join fail");
      console.log(error);
    }
  }

  return (
    <div>
      <h1>Join</h1>
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
      <button onClick={submit}>Join</button>
    </div>
  );
}
