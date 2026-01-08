import {CanActivate,ExecutionContext,ForbiddenException,Injectable,} from '@nestjs/common';


@Injectable()
export class OwnerCheckGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const targetUserId = Number(request.params.id);

    if (!user) {
      throw new ForbiddenException('No user in request');
    }


    if (user.id === targetUserId) {
      return true;
    }

    throw new ForbiddenException(
      `You cannot update this user. Your id=${user.id}, target id=${targetUserId}`,
    );
  }
}
