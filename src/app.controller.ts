import {Controller, Get} from '@nestjs/common';
import {ApiExcludeController} from "@nestjs/swagger";
@ApiExcludeController()
@Controller()
export class AppController {
    @Get()
    getWelcome(): string {
        return "<h1>Welcome server app-posts</h1>"
    }
}
