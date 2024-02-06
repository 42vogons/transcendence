import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMatchHistoryDto } from '../dto/create-match-history';
import { MatchHistoryEntity } from '../entities/match-history';

@Injectable()
export class MatchHistoryRespository {
  constructor(private readonly prisma: PrismaService) {}
  
  async create(matchHistoryDto: CreateMatchHistoryDto): Promise<MatchHistoryEntity> {
    return this.prisma.match_history.create({
      data: matchHistoryDto,
    });
  }
  
  async getAllMatchHistoryByUserID(userID: number): Promise<MatchHistoryEntity[] | []> {
	const allHistory = this.prisma.match_history.findMany({
		where: {
			OR: [
				{
					player1_user_id: userID
				},
				{
					player2_user_id: userID
				}
			]
		}
	})
	return allHistory
  }
}
