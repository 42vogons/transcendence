import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
// No topo do seu arquivo, antes de acessar as variáveis de ambiente
import * as dotenv from 'dotenv';





@Injectable()
export class AppService {
  

  getHello(): string {
    return 'Hello World!';
  }

  async checkLogin(): Promise<any> {
    try {
      const url = "https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2cee1c10ee2d5b0870296f9dcba4e1adf9ed0db36dfaab25de3e4fd69ae170ce&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Fauth%2Fredirect&response_type=code"
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao acessar a API externa:', error.message);
      throw error;
    }
  }

   async getToken (authorizationCode:string) : Promise<any> {
    dotenv.config();
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    try {
      const formData = new FormData();
      formData.append('grant_type', 'authorization_code');
      formData.append('client_id', clientId);
      formData.append('client_secret', clientSecret);
      formData.append('code', authorizationCode);
      formData.append('redirect_uri', redirectUri);


      const response = await axios.post('https://api.intra.42.fr/oauth/token', formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter token ${authorizationCode} de acesso: ${error.message}`);
    }
  }

  async getInfo(token:string) : Promise<any> {
    try {
      const response = await axios.get('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // ou retorne o que desejar aqui
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
      throw error; // ou trate o erro de acordo com suas necessidades
    }
  
  }

};
