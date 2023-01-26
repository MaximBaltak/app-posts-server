import {Controller, Get} from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    getWelcome(): string {
        return "<h1>Welcome server app-posts</h1>"
    }
}
