import { Job } from 'bullmq';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';

import {
  IAddImage,
  MediaProcessingService,
} from '@/media/media-processing.service';
import { JobEnum } from '@/bull/enums/job.enum';
import { QueueEnum } from '@/bull/enums/queue.enum';

@Processor(QueueEnum.MEDIA_PROCESSING_QUEUE)
export class MediaProcessingConsumer extends WorkerHost {
  constructor(private readonly mediaService: MediaProcessingService) {
    super();
  }

  async process(job: Job<IAddImage, any, JobEnum>) {
    switch (job.name) {
      case JobEnum.ADD_MEDIA_JOB:
        return this.mediaService.addImage(job.data);
      default:
        return;
    }
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<IAddImage, any, JobEnum>) {
    switch (job.name) {
      case JobEnum.ADD_MEDIA_JOB:
        return this.mediaService.onFailedAddImage(job);
      default:
        return;
    }
  }
}
