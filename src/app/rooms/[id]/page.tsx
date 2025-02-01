'use client'

import { useEffect, useState, useRef, RefObject } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams } from 'next/navigation';
import { RoomFindByIdDto } from '@/type/room';
import roomFindByIdAPI from '@/api/RoomfindByIdAPI';
import { useForm } from "react-hook-form";
import { Button, Input } from '@nextui-org/react';

type GetMessage = {
  roomId: number;
  message: string;
  createAt: string;
  member: {
    memberId: number;
    nickname: string;
  }
}

type SendMessage = {
  roomId: number;
  message: string;
}

export default function RoomFindById() {
  const [messages, setMessages] = useState<GetMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const stompClient: RefObject<Client | null> = useRef<Client | null>(null);

  const { register, handleSubmit, setValue, reset } = useForm<SendMessage>();

  const [room, setRoom] = useState<RoomFindByIdDto>();
  const [loading, setLoading] = useState<boolean>(false);

  const [jwt, setJwt] = useState<string | null>(null);

  const params = useParams();
  const id: number = Number(params.id);

  const fetchRoom = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await roomFindByIdAPI(id);
      setRoom(data);
    } catch (err) {
      setError('Failed to fetch rooms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedJwt = localStorage.getItem('jwt');
    setJwt(storedJwt);
  }, []);

  useEffect(() => {
    fetchRoom(id);
  }, [id]);

  useEffect(() => {
    console.log(messages)
  }, [messages])

  // WebSocket 연결 및 처리
  useEffect(() => {
    if (!jwt) return; // JWT가 없으면 WebSocket 연결을 하지 않음
    const socketUrl = `${process.env.NEXT_PUBLIC_CHAT_SERVER}/websocket`;
    const socket = new SockJS(socketUrl);

    // WebSocket 연결 초기화
    const connectWebSocket = () => {
      stompClient.current = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: jwt // 여기서 Authorization을 설정
        },
        onConnect: () => {
          console.log('WebSocket connected');
          stompClient.current?.subscribe(`/topic/${id}`, (message) => {
            const receivedMessage: GetMessage = JSON.parse(message.body);
            setMessages((prevMessages) => [
              ...prevMessages,
              {
                roomId: receivedMessage.roomId,
                message: receivedMessage.message,
                createAt: receivedMessage.createAt,
                member: {
                  memberId: receivedMessage.member.memberId,
                  nickname: receivedMessage.member.nickname
                }
              },
            ]);
          });
        },
        onStompError: (error) => {
          console.error('STOMP 오류: ', error);
          setError('서버와 연결에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        },
        onWebSocketError: (error) => {
          console.error('WebSocket 오류: ', error);
          setError('WebSocket 연결에 문제가 발생했습니다. 나중에 다시 시도해주세요.');
        },
        onWebSocketClose: (event) => {
          console.log('WebSocket 연결 종료: ', event);
          setError('WebSocket 연결이 종료되었습니다. 다시 시도해주세요.');
        },
      });

      stompClient.current.activate();
    };

    connectWebSocket();

    // Cleanup: component unmount 시 WebSocket 비활성화
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [id, jwt]); // id와 jwt가 변경될 때마다 실행

  // 메시지 전송 함수
  const onSubmit = (data: SendMessage) => {
    data.roomId = id;
    if (stompClient.current && jwt) {
      try {
        stompClient.current.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify(data),
          headers: {
            Authorization: jwt,  // 전송 시 헤더에 JWT 포함
          }
        });
      } catch (error) {
        console.error("Error while publishing the message:", error);
        alert("메시지를 전송하는 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
      
      reset();// 전송 후 입력값 초기화
    }
  };

  return (
    <div className="mid">
      <div className="box inline" style={{ width: "500px" }}>
        {error && <div>{error}</div>}
        {messages.map((message, index) => (
          <div key={index} className="message">
          <p className="nickname">{message.member.nickname}</p>
          <p className="message-content">{message.message}</p>
          <p className="timestamp">{new Date(message.createAt).toLocaleString()}</p>
        </div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            style={{ width: "400px" }}
            type="text"
            placeholder="MESSAGE"
            {...register("message")}
          />
          <Button type="submit" disabled={loading} className='button'>
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
