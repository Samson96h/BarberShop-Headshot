import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SenderService } from 'libs/common/email/sender.service';
import { userStatus } from '@app/common';
import { createRandomCode } from '@app/common/helpers';
import { IJWTConfig } from '@app/common/models';
import { BarberOrClientDTO, ChangeStatusDTO, VerifyCodeDto } from './dto';
import type { IAuthRepository } from './interfaces';


@Injectable()
export class AuthService {

  private jwtConfig: IJWTConfig;

  constructor(
    @Inject('AUTH_REPOSITORY')
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly senderService: SenderService,
  ) {
    this.jwtConfig = this.configService.get("JWT_CONFIG") as IJWTConfig
  }


  async sendCode(dto: BarberOrClientDTO) {

    let user = await this.authRepository.findUserByPhone(dto.phone)

    if (!user) {
      user = await this.authRepository.createUser({
        phone: dto.phone,
        role: dto.statusUser
      })
    }

    if (!user.security) {
      const security = await this.authRepository.createSecurity(user)
      user.security = security
    }

    if (user.status === userStatus.PERMAMENTLY_BLOCK) {
      throw new BadRequestException({key: 'USER_PERMANENTLY_BLOCKED'})
    }

    if (user.security.blockedUntil && new Date() < user.security.blockedUntil) {
      const remaining = Math.ceil((user.security.blockedUntil.getTime() - new Date().getTime()) / 60000)

      throw new BadRequestException({key: "YOU_ARE_TEMPORARILY_BLOCKED"})
    }

    if (user.security.blockedUntil && new Date() >= user.security.blockedUntil) {
      user.security.blockedUntil = null
      user.security.attemptsCount = 0

      await this.authRepository.saveSecurity(user.security)
    }

    await this.authRepository.deleteOldCodes(dto.phone)

    const code = createRandomCode().toString()

    await this.authRepository.createCode(user, code)

    const tempToken = this.jwtService.sign(
      { sub: user.id, phone: user.phone, temp: true },
      { secret: this.jwtConfig.tempSecret, expiresIn: '10m' }
    )

    return {
      accessToken: tempToken,
      code
    }
  }


  async verifyCode(phone: string, dto: VerifyCodeDto) {

    const user = await this.authRepository.findUserByPhone(phone)

    if (!user) throw new BadRequestException({key: 'USER_NOT_FOUND'})


    if (!user.security) {
      const security = await this.authRepository.createSecurity(user)
      user.security = security
    }

    if (user.status === userStatus.PERMAMENTLY_BLOCK) throw new BadRequestException({key: 'USER_PERMANENTLY_BLOCKED'})


    if (user.security.blockedUntil && new Date() < user.security.blockedUntil) {
      const remaining = Math.ceil((user.security.blockedUntil.getTime() - new Date().getTime()) / 60000)

      throw new BadRequestException({key: "YOU_ARE_TEMPORARILY_BLOCKED"})
    }

    if (user.security.blockedUntil && new Date() >= user.security.blockedUntil) {
      user.security.blockedUntil = null
      user.security.attemptsCount = 0
      await this.authRepository.saveSecurity(user.security)
    }

    const existing = await this.authRepository.findCode(phone, dto.code)

    if (!existing) {
      user.security.attemptsCount += 1
      if (user.security.attemptsCount === 3) {

        user.status = userStatus.TEMPORARY_BLOCK
        user.security.blockCount += 1

        if (user.security.blockCount === 5) {
          user.status = userStatus.PERMAMENTLY_BLOCK

          await this.authRepository.saveUser(user)
          await this.authRepository.saveSecurity(user.security)

          throw new BadRequestException({key: 'USER_PERMANENTLY_BLOCKED'})
        }

        user.security.attemptsCount = 0

        user.security.blockedUntil = new Date(Date.now() + 15 * 60 * 1000)

        await this.authRepository.saveUser(user)

        await this.authRepository.saveSecurity(user.security)

        return {
          message: 'You are temporarily blocked for 15 minutes'
        }
      }

      await this.authRepository.saveSecurity(user.security)

      return {
        message: 'Invalid code'
      }
    }

    user.status = userStatus.ACTIVE

    user.security.attemptsCount = 0
    user.security.blockCount = 0
    user.security.blockedUntil = null

    await this.authRepository.deleteCode(existing.id.toString())

    await this.authRepository.saveUser(user)

    await this.authRepository.saveSecurity(user.security)

    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      name: user.firstName
    },
      {
        secret: this.jwtConfig.secret,
        expiresIn: '1d'
      }
    )

    return {
      accessToken,
      message: 'Authentication successful'
    }
  }


  async changeStatusUser(userId: string, dto: ChangeStatusDTO) {
    const user = await this.authRepository.changeStatusUser(userId, dto)

    if (!user) throw new NotFoundException({key: 'USER_NOT_FOUND'})

    if (user.email) {

      await this.senderService.sendEmail({
        to: user.email,
        from: process.env.SMTP_FROM || 'no-reply@example.com',
        subject: 'Change role',
        template: 'change_data',
        context: { ole: user.role }
      })
    }

    return user
  }

}