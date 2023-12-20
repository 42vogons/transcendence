import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class LoginService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) {}
    
    async getToken (authorizationCode:string) : Promise<any> {
    
        const clientId = process.env.CLIENT_ID;
        const clientSecret = process.env.CLIENT_SECRET;
        const redirectUri = process.env.REDIRECT_URI;
        console.log("Client" + clientId);
    
        try {
            const formData = new FormData();
            formData.append('grant_type', 'authorization_code');
            formData.append('client_id', clientId);
            formData.append('client_secret', clientSecret);
            formData.append('code', authorizationCode);
            formData.append('redirect_uri', redirectUri);
            const token = await axios.post('https://api.intra.42.fr/oauth/token', formData, {
            headers: {
                ...formData.getHeaders(),
                },
            });
            return this.getInfo(token.data.access_token);
        } catch (error) {
            throw new Error(`Erro ao obter token ${authorizationCode} de acesso: ${error.message}`);
        }
    }
    
    async getInfo(token:string) : Promise<any> {
        try {
            console.log('token ' + token);
            const response = await axios.get('https://api.intra.42.fr/v2/me', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
           
            this.checkUser(response.data);

          return response.data; // ou retorne o que desejar aqui
        } catch (error) {
            console.error('Erro ao fazer a requisição:', error.message);
            throw error; // ou trate o erro de acordo com suas necessidades
        }
    }

    async checkUser(profile : any){

        console.log("user id = " + profile.id);
        
        const payload = {
           id: profile.id, 
           login: profile.login
        }
        const token = this.generateToken(payload);

        console.log("token =" , token);

        const atoken = this.jwtService.decode(token);
        console.log("destoken = ",atoken);


        try {
            const user = await this.usersService.findOne(profile.id);
            console.log("user =", user.username);
            

            if (user == null)
                console.log("??");
        } catch (error) {
            await this.usersService.createNewUser(profile);
            console.info('User not found');
        }
    }

    generateToken(payload: any): string {
        return this.jwtService.sign(payload);
      }

}
