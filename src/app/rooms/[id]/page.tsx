'use client'

import { useEffect, useState, useRef, RefObject } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useParams, useSearchParams } from 'next/navigation';
import { FindByIdRoomDto } from '@/type/room';
import { findByIdRoom } from '@/api/findByIdRoom';

interface Message {
  id: number;
  message: string;
}

export default function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const stompClient: RefObject<Client | null> = useRef<Client | null>(null);

  const [room, setRoom] = useState<FindByIdRoomDto>();
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const id: number = Number(params.id);

  const fetchRoom = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await findByIdRoom(id);
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

  const handleSendMessage = () => {
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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <div>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        {messages.map((message) => (
          <div key={message.id} style={{ marginBottom: '10px' }}>
            <div
              style={{
                padding: '8px 12px',
                marginBottom: '5px',
                borderRadius: '5px',
                backgroundColor: '#3e3e3e',
                maxWidth: '60%',
                wordWrap: 'break-word',
              }}
            >
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
          style={{ padding: '10px', width: '80%', marginRight: '10px' }}
          autoFocus
        />
        <button onClick={handleSendMessage} style={{ padding: '10px', cursor: 'pointer' }}>
          전송
        </button>
      </div>
    </div>
  );
}
