import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { resolve } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { SystemConfigService } from 'src/system-config/system-config.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: async (config: SystemConfigService) => ({
        transport: {
          host: await config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: await config.get('MAIL_USER'),
            pass: await config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${await config.get('MAIL_FROM')}>`,
        },
        template: {
          dir: resolve('public/templates/mail'),
          adapter: new EjsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [SystemConfigService],
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
