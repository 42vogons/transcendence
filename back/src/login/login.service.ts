import { Injectable, Response, Body } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class LoginService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly twoFactorAutenticateService: TwoFactorAutenticateService,
  ) {}

  async getToken(authorizationCode: string): Promise<string> {
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
      const response = await axios.post(
        'https://api.intra.42.fr/oauth/token',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
        },
      );
      if (response.data && response.data.access_token) {
        return response.data.access_token;
      } else {
        throw new Error('Token de acesso não encontrado na resposta');
      }
    } catch (error) {
      throw new Error(
        `Erro ao obter token ${authorizationCode} de acesso: ${error.message}`,
      );
    }
  }

  async getInfo(token: string): Promise<any> {
    try {
      console.log('token ' + token);
      return await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
      throw error; // ou trate o erro de acordo com suas necessidades
    }
  }

  async insertToken(profile: any, expiresAt: Date, @Response() res) {
    const payload = {
      id: profile.user_id,
      login: profile.username,
    };
    const token = await this.generateToken(payload);
    console.log('cookie=' + token);
    res.cookie('accessToken', token, {
      expires: expiresAt,
      httpOnly: true,
      domain: 'localhost',
    });
  }

  async checkUser(profile: any): Promise<UserEntity | null> {
    try {
      const user = await this.usersService.findEmail(profile.data.email);
      console.info('Usuário encontrado');
      return user;
    } catch (error) {
      return this.createNewUser(profile);
    }
  }

  private createNewUser(profile: any) {
    console.info('Criando novo usuário');
    const newUser: CreateUserDto = new CreateUserDto();
    newUser.username = profile.data.login;
    newUser.email = profile.data.email;
    newUser.two_factor_enabled = false;
    newUser.user_id_42 = profile.data.id.toString();
    return this.usersService.create(newUser);
  }

  async checkTwoFactor(token: string, code: string): Promise<boolean> {
    const user = await this.usersService.findByToken(token);
    const valid =
      this.twoFactorAutenticateService.isTwoFactorAuthenticationCodeValid(
        code,
        user.token_secret,
      );
    return valid;
  }

  async login(@Body() body: any, @Response() res) {
    console.log('body:', body);
    const token = await this.getToken(body.code);
    const profile = await this.getInfo(token);
    const user = await this.checkUser(profile);
    const expiresAt = new Date(new Date().getTime() + 30 * 10000);
    await this.insertToken(user, expiresAt, res);
    //todo adicionar expire do cookie no retorno res
    console.log('user ', user);
    let action = 'logged';
    const { user_id: userID, username } = user;
    if (user.two_factor_enabled) {
      action = 'authenticate';
      return res
        .status(200)
        .send({ action, user: { userID, username, expiresAt } });
    }

    return res
      .status(200)
      .send({ action, user: { userID, username, expiresAt } });
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

  async generateToken(payload: any): Promise<string> {
    return await this.jwtService.signAsync(payload);
  }
}
