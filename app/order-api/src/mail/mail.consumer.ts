import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bullmq';
import { QueueRegisterKey } from 'src/app/app.constants';

@Processor(QueueRegisterKey.MAIL)
@Injectable()
export class MailConsumer extends WorkerHost {
  constructor(private readonly mailerService: MailerService) {
    super();
  }

  async process(job: Job<ISendMailOptions>, token?: string): Promise<any> {
    switch (job.name) {
      case 'send-mail':
        const result = await this.mailerService.sendMail(job.data);
        console.log({ result });
        return result;
    }
  }
}
