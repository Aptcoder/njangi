import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import NjangiRepository from './njangi.repository';

@Injectable()
export class InviteGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private njangiRepository: NjangiRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { inviteId } = request.params;

    if (request?.user) {
      const { userId } = request.user;
      if (!inviteId) {
        return false;
      }
      const query = { userId, id: inviteId };
      const njangiUser = await this.njangiRepository.findOneNjangiInvite(query);
      return njangiUser ? true : false;
    }

    return false;
  }
}
