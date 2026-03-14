import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class DashboardGateway {

  @WebSocketServer()
  server!: Server;

  emitDashboardUpdate(data: any) {
    this.server.emit('dashboardUpdate', data);
  }

}