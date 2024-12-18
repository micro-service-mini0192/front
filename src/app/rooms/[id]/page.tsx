'use client'

import { useEffect, useState, useRef, RefObject } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams, useSearchParams } from 'next/navigation';
import { RoomFindByIdDto } from '@/type/room';
import roomFindByIdAPI from '@/api/RoomfindByIdAPI';

interface Message {
  id: number;
  message: string;
}

export default function RoomFindById() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const stompClient: RefObject<Client | null> = useRef<Client | null>(null);

  const [room, setRoom] = useState<RoomFindByIdDto>();
  const [loading, setLoading] = useState<boolean>(false);

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
    fetchRoom(id)
  }, []);
  useEffect(() => {
    const socketUrl = 'http://localhost:8080/websocket';
    const socket = new SockJS(socketUrl);

    stompClient.current = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        stompClient.current?.subscribe(`/topic/${id}`, (message) => {
          const receivedMessage = JSON.parse(message.body);
          setMessages((prevMessages) => [
            ...prevMessages,
            { id: Date.now(), message: receivedMessage.message },
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

    // Cleanup: component unmount 시 WebSocket 비활성화
    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [id]); // id 값이 변경될 때마다 실행

  const submit = () => {
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Number(id),
      message: input,
    };

    setInput('');

    if (stompClient.current) {
      stompClient.current.publish({
        destination: '/app/chat.sendMessage',
        body: JSON.stringify(newMessage),
      });
    }
  };

  return (
    <div>
      <div>
        {error && <div>{error}</div>}
        {messages.map((message) => (
          <div key={message.id}>
            <div>
              {message.message}
            </div>
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요..."
          autoFocus
        />
        <button onClick={submit} style={{ padding: '10px', cursor: 'pointer' }}>
          전송
        </button>
      </div>
    </div>
  );
}
