import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import NjangiRepository from './njangi.repository';

@Injectable()
export class NjangiRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private njangiRepository: NjangiRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<string>('role', context.getHandler());
    const request = context.switchToHttp().getRequest();

    const { njangiId } = request.params;

    if (request?.user) {
      const { userId } = request.user;
      if (!njangiId) {
        return false;
      }
      const query = { userId, njangiId };
      if (role == 'creator') {
        query['role'] = 'creator';
      }
      const njangiUser = await this.njangiRepository.findOneNjangiUser(query);
      return njangiUser ? true : false;
    }

    return false;
  }
}
