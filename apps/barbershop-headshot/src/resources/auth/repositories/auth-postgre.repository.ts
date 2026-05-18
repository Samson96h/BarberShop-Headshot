import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { JwtService } from "@nestjs/jwt";
import { Repository } from "typeorm";

import { UserSecurityEntity } from "@app/common/database/entities/user.secutity.entity";
import { BarberOrClientDTO, VerifyCodeDto, ChangeStatusDTO } from "../dto";
import { SenderService } from "libs/common/email/sender.service";
import { SecretCode, UserEntity } from "@app/common/database/entities";
import { IAuthRepository } from "../interfaces/auth.repository";
import { createRandomCode } from "@app/common/helpers";
import { IJWTConfig } from "@app/common/models";
import { userStatus } from "@app/common";


@Injectable()
export class AuthPostgreRepository implements IAuthRepository {
    private jwtConfig: IJWTConfig;

    constructor(
        private readonly jwtService: JwtService,
        private readonly senderService: SenderService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        @InjectRepository(SecretCode)
        private readonly secretRepository: Repository<SecretCode>,
        @InjectRepository(UserSecurityEntity)
        private readonly securityRepository: Repository<UserSecurityEntity>,
    ) { }

    async sendCode(dto: BarberOrClientDTO): Promise<any> {
        const phone = dto.phone;

        let user = await this.userRepository.findOne({
            where: { phone },
            relations: ['security'],
        });

        if (!user) {
            user = this.userRepository.create({ phone });
            user = await this.userRepository.save(user);
        }

        if (!user.security) {
            const security = this.securityRepository.create({ user });
            await this.securityRepository.save(security);
            user.security = security;
        }

        if (user.status === userStatus.PERMAMENTLY_BLOCK) {
            throw new BadRequestException('User is permanently blocked');
        }

        if (user.security.blockedUntil && new Date() < user.security.blockedUntil) {
            const remaining = Math.ceil(
                (user.security.blockedUntil.getTime() - new Date().getTime()) / 60000,
            );
            throw new BadRequestException(
                `Account temporarily blocked. Try again in ${remaining} minute(s).`,
            );
        }

        if (user.security.blockedUntil && new Date() >= user.security.blockedUntil) {
            user.security.blockedUntil = null;
            user.security.attemptsCount = 0;
            await this.securityRepository.save(user.security);
        }

        const existing = await this.secretRepository.findOne({
            where: { user: { id: user.id } },
        });

        if (existing) {
            await this.secretRepository.delete({ id: existing.id });
        }

        const tempToken = this.jwtService.sign(
            { sub: user.id, phone: user.phone, name: user.firstName, temp: true },
            {
                secret: this.jwtConfig.tempSecret,
                expiresIn: '10m',
            },
        );
        const code = createRandomCode().toString();

        const secretCode = this.secretRepository.create({
            code,
            user,
        });

        await this.secretRepository.save(secretCode);

        return {
            accessToken: tempToken,
            code,
        };
    }

    async verifyCode(phone: string, dto: VerifyCodeDto): Promise<any> {
        const user = await this.userRepository.findOne({
            where: { phone },
            relations: ['security']
        })

        if (!user) {
            throw new BadRequestException('User not found')
        }

        if (!user.security) {
            user.security = this.securityRepository.create({ user })
            await this.securityRepository.save(user.security)
        }

        if (user.status === userStatus.PERMAMENTLY_BLOCK) {
            throw new BadRequestException('your accaunt is permamently blocket -| good by')
        }

        if (user.security.blockedUntil && new Date() < user.security.blockedUntil) {
            const remaining = Math.ceil(
                (user.security.blockedUntil.getTime() - new Date().getTime()) / 60000,
            )
            throw new BadRequestException(
                `Account temporarily blocked. Try again in ${remaining} minute(s).`
            )
        }

        if (user.security.blockedUntil && new Date() >= user.security.blockedUntil) {
            user.security.blockedUntil = null
            user.security.attemptsCount = 0
            await this.securityRepository.save(user.security)
        }

        const existing = await this.secretRepository.findOne({
            where: { code: dto.code, user: { id: user.id } },
            relations: ['user']
        })

        if (!existing) {
            user.security.attemptsCount += 1;

            if (user.security.attemptsCount === 3) {
                user.status = userStatus.TEMPORARY_BLOCK
                user.security.blockCount += 1

                if (user.security.blockCount === 5) {
                    user.status = userStatus.PERMAMENTLY_BLOCK
                    await this.userRepository.save(user);
                    await this.securityRepository.save(user.security);
                    throw new BadRequestException("User permanently blocked");
                }
                user.security.attemptsCount = 0
                user.security.blockedUntil = new Date(Date.now() + 1 * 1000)

                await this.userRepository.save(user)
                await this.securityRepository.save(user.security)

                return { message: 'You are temporarily blocked for 15 minutes' }
            }

            await this.securityRepository.save(user.security);
            return { message: 'Invalid code' };
        }

        user.status = userStatus.ACTIVE
        user.security.attemptsCount = 0
        user.security.blockCount = 0
        user.security.blockedUntil = null

        await this.secretRepository.delete({ id: existing.id })
        await this.userRepository.save(user)
        await this.securityRepository.save(user.security)

        const accessToken = this.jwtService.sign(
            { sub: user.id, phone: user.phone, name: user.firstName },
            {
                secret: this.jwtConfig.secret,
                expiresIn: '1d'
            }
        )

        return {
            accessToken: accessToken,
            message: 'Authentication successful',
        };
    }

    async changeStatusUser(userId: string, dto: ChangeStatusDTO): Promise<UserEntity> {

        const user = await this.userRepository.findOne({ where: { id: +userId } })
        if (!user) throw new NotFoundException('user not found')

        user.role = dto.role

        if (user.email) {
            await this.senderService.sendEmail({
                to: user.email,
                from: process.env.SMTP_FROM || 'no-reply@example.com',
                subject: 'Change--your--role !',
                template: 'change_data',
                context: {
                    role: user.role || 'User',
                },
            });
        }

        return this.userRepository.save(user)

    }

}