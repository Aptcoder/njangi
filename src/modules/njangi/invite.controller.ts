import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UpdateNjangiInviteDTO } from 'src/common/dtos/njangi.dtos';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import Helper from 'src/common/helpers';
import { InviteGuard } from './invite.guard';
import NjangiService from './njangi.service';

@Controller('invites')
export default class InviteController {
  constructor(private readonly njangiService: NjangiService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getInvites(@Req() req) {
    const { userId } = req.user;
    const invites = await this.njangiService.getNjangiInvites(null, userId);
    return Helper.formatResponse('Invites', { invites });
  }

  @UseGuards(JwtAuthGuard, InviteGuard)
  @Patch('/:inviteId')
  async updateInvite(
    @Req() req,
    @Param('inviteId') inviteId: string,
    @Body() updateInviteDTO: UpdateNjangiInviteDTO,
  ) {
    // const { userId } = req.user;
    const invite = await this.njangiService.updateNjangiInvite(
      inviteId,
      updateInviteDTO,
    );
    return Helper.formatResponse('Invites', { invite });
  }
}
