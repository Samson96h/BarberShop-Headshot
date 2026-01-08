export interface JwtPayload {
    sub: number | string;
    phone?: string;
    temp?: boolean
}