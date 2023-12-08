import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
// No topo do seu arquivo, antes de acessar as variáveis de ambiente
import * as dotenv from 'dotenv';
dotenv.config();


@Injectable()
export class AppService {
  
  async getToken (authorizationCode:string) : Promise<any> {
    
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    const redirectUri = process.env.REDIRECT_URI;

    console.info("client="+ clientId );

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
