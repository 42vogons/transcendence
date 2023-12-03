import { Controller, Post, Body, HttpCode } from '@nestjs/common';

@Controller('greeting')
export class GreetingController {

    @Post()
    @HttpCode(200)
    greetUser(@Body('user') user: string): string {
        return `Olá ${user}`;
    }
}