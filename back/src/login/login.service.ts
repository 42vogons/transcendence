import { Injectable, Response } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ProfileDto } from 'src/users/dto/profile.dto';
import { TwoFactorAutenticateService } from './two-factor-autenticate/two-factor-autenticate.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly twoFactorAutenticateService: TwoFactorAutenticateService,
  ) {}

  async getToken(
    authorizationCode: string,
    @Response() res,
  ): Promise<ProfileDto> {
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;
    console.log('Client' + clientId);

    try {
      const formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);
      formData.append('code', authorizationCode);
      formData.append('redirect_uri', redirectUri);
      const token = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );

      const profile = await this.getInfo(token.data.access_token);
      this.insertToken(profile, res);
      if (profile.two_factor_enabled === true) {
        return null;
      }
      if (profile) return this.mapToDto(profile, ProfileDto);
      return null;
    } catch (error) {
      throw new Error(
        `Erro ao obter token ${authorizationCode} de acesso: ${error.message}`,
      );
    }
  }

  async getInfo(token: string): Promise<any> {
    try {
      console.log('token ' + token);
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return this.checkUser(response.data);
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
      throw error; // ou trate o erro de acordo com suas necessidades
    }
  }

  async insertToken(profile: any, @Response() res) {
    const payload = {
      id: profile.user_id,
      login: profile.username,
    };
    const token = this.generateToken(payload);
    res.cookie('accessToken', token, {
      expires: new Date(new Date().getTime() + 30 * 10000),
      httpOnly: true,
      domain: 'localhost',
    });
  }

  async checkUser(profile: any): Promise<any | null> {
    try {
      const user = await this.usersService.findOne(profile.id);
      if (!user) {
        return this.usersService.createNewUser(profile);
      }
      return user;
    } catch (error) {
      // Trate os erros aqui, por exemplo, registre ou lance uma exceção
      console.error('Erro ao verificar o usuário:', error.message);
      throw new Error('Erro ao verificar o usuário');
    }
  }

  async checkTwoFactor(token: string, code: string): Promise<boolean> {
    const user = await this.usersService.findByToken(token);
    console.log(user.token_secret);
    const valid =
      this.twoFactorAutenticateService.isTwoFactorAuthenticationCodeValid(
        code,
        user.token_secret,
      );
    return valid;
  }

  private mapToDto<T>(source: any, dto: new () => T): T {
    const dtoInstance = new dto();
    Object.keys(dtoInstance).forEach(key => {
      if (source.hasOwnProperty(key)) {
        dtoInstance[key] = source[key];
      }
    });
    return dtoInstance;
  }

  generateToken(payload: any): string {
    return this.jwtService.sign(payload);
  }
}
