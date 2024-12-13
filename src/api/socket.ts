// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from 'next';
import WebSocket from 'ws';

const WebSocketHandler = (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    // 웹소켓 서버 생성
    const wss = new WebSocket.Server({ noServer: true });

    wss.on('connection', (ws: WebSocket) => {
      console.log('클라이언트가 연결됨');

      ws.on('message', (message: string) => {
        console.log(`수신된 메시지: ${message}`);

        // 받은 메시지를 모든 클라이언트에 브로드캐스트
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      });

      ws.on('close', () => {
        console.log('클라이언트 연결 끊어짐');
      });
    });

    // HTTP 요청을 WebSocket 서버에 넘겨주기 위한 설정
    res.socket.server.on('upgrade', (request, socket, head) => {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    });

    res.status(200).end();
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

export default WebSocketHandler;
