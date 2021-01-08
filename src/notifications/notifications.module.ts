import { Module } from '@nestjs/common'
import { NotificationsGateway } from './notifications.gateway.js'

@Module({
  providers: [NotificationsGateway],
})
export class NotificationsModule {}
