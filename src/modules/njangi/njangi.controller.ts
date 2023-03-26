import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CreateNjangiDTO,
  CreateNjangiInviteDTO,
} from 'src/common/dtos/njangi.dtos';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { NjangiRoleGuard } from './njangi.guard';
import Helper from 'src/common/helpers';
import NjangiService from './njangi.service';
import { NjangiRole } from './njangi.role';

@Controller('/njangis')
export default class NjangiController {
  constructor(private readonly njangiService: NjangiService) {}

  @Get('/')
  async getAllNjangis() {
    const njangis = await this.njangiService.getNjangis();
    return Helper.formatResponse('Njangis', { njangis });
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async getAllUserNjangis(@Req() req) {
    const { userId } = req.user;
    const njangis = await this.njangiService.getUserNjangis(userId);
    return Helper.formatResponse('Njangis', { njangis });
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  async createNjangi(@Body() createNjangiDTO: CreateNjangiDTO, @Req() req) {
    const { userId } = req.user;
    const njangi = await this.njangiService.createNjangi(
      createNjangiDTO,
      userId,
    );
    return Helper.formatResponse('Njangi created', { njangi });
  }

  @NjangiRole('creator')
  @UseGuards(JwtAuthGuard, NjangiRoleGuard)
  @Post('/:njangiId/invites')
  async createNjangiInvite(
    @Body() createNjangiInviteDTO: CreateNjangiInviteDTO,
    @Req() req,
    @Param('njangiId') njangiId: string,
  ) {
    // const { userId } = req.user;
    const invite = await this.njangiService.createNjangiInvite(
      createNjangiInviteDTO.phoneNumber,
      njangiId,
    );
    return Helper.formatResponse('Njangi invite created', { invite });
  }

  @NjangiRole('member')
  @UseGuards(JwtAuthGuard, NjangiRoleGuard)
  @Get('/:njangiId/invites')
  async getNjangiInvites(@Req() req, @Param('njangiId') njangiId: string) {
    // const { userId } = req.user;
    const invites = await this.njangiService.getNjangiInvites(njangiId);
    return Helper.formatResponse('Njangi invites', { invites });
  }

  @NjangiRole('member')
  @UseGuards(JwtAuthGuard, NjangiRoleGuard)
  @Get('/:njangiId')
  async getNjangi(@Req() req, @Param('njangiId') njangiId: string) {
    // const { userId } = req.user;
    const njangi = await this.njangiService.getNjangi(njangiId);
    return Helper.formatResponse('Njangi', { njangi });
  }
}
