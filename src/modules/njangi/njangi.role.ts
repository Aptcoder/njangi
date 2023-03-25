import { SetMetadata } from '@nestjs/common';

export const NjangiRole = (role: string) => SetMetadata('role', role);
