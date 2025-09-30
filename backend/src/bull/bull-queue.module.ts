import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QueueEnum } from '@/bull/enums/queue.enum';
import { BullConfigService } from '@/bull/bull-config.service';

const registeredQueues = Object.values(QueueEnum).map((name) =>
  BullModule.registerQueue({ name }),
);

@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: BullConfigService,
    }),
    ...registeredQueues,
  ],
  providers: [BullConfigService],
  exports: [...registeredQueues],
})
export class BullQueueModule {}
