export interface AdminJwtPayload {
    sub: number | string;
    name: string;
    temp?: boolean
}