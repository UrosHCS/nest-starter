import { SubscribeMessage, WebSocketGateway, WebSocketServer, WsResponse } from '@nestjs/websockets'
import { from, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { Server } from 'ws'

@WebSocketGateway()
export class NotificationsGateway {
  @WebSocketServer()
  server: Server

  @SubscribeMessage('notifications')
  onEvent(client: any, data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map((item) => ({ event: 'notifications', data: item })))
  }
}
