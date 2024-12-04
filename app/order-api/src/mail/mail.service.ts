import { MailerService } from '@nestjs-modules/mailer';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { resolve } from 'path';
import { User } from 'src/user/user.entity';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,

    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  async sendNewPassword(user: User, newPassword: string) {
    const context = `${MailService.name}.${this.sendNewPassword.name}`;
    try {
      await this.mailerService.sendMail({
        to: user.email, // list of receivers
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Reset Password', // Subject line
        template: resolve('public/templates/mail/reset-password'), // `.ejs` extension is appended automatically
        context: {
          name: `${user.firstName} ${user.lastName}`,
          newPassword,
        },
      });
    } catch (error) {
      this.logger.error(
        `Error sending email to ${JSON.stringify(error)}`,
        context,
      );
      throw new BadRequestException(`Error sending email to ${user.email}`);
    }
  }
}
