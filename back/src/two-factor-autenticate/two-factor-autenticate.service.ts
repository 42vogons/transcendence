import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAutenticateService {
  public async generateSecret(email: string) {
    const appName = 'ft_transcendence';
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, appName, secret);
    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    secret: string,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: secret,
    });
  }
}
