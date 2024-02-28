import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class channel_listDTO {
  @IsNotEmpty()
  @IsString()
  lastMessage: string;

  @IsNotEmpty()
  @IsString()
  lastAvatar: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsString()
  type: string;
  timestamp: any;

  constructor(
    lastMessage: string,
    lastAvatar: string,
    userName: string,
    channelId: number,
    type: string,
  ) {
    this.lastMessage = lastMessage;
    this.lastAvatar = lastAvatar;
    this.userName = userName;
    this.channelId = channelId;
    this.type = type;
  }

    //@SubscribeMessage('get_channel_list')
  // mandar lista dos canais do usuário
  // com a ultima mensagem do canal, - ok
  // usuário que mandou nome do canal, - ok
  //id do canal - ok
  // e avatar - ok
  // mensagem - ok
  // ordenado pela ultima mensagem
  // em lista de objetos
  // e o tipo do canal - ok
}
