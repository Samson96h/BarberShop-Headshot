import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const AuthUser = createParamDecorator(
  (field: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const source = request.user ?? request.tempSession;
    return field ? source?.[field] : source;
  },
);
