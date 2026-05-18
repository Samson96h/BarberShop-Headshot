export interface IAppointmentRepository {

    findAppointmentById(id: string): Promise<any>;

    removeAppointment(id: string): Promise<void>;

    findUserById(id: string): Promise<any>;

    getAppointmentsForBarber(barberId: string): Promise<any[]>;

    getAppointmentsForClient(clientId: string): Promise<any[]>;
}