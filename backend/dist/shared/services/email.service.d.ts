export declare class EmailService {
    private transporter;
    constructor();
    sendAppointmentConfirmation(patientEmail: string, patientName: string, appointmentDetails: {
        doctorName: string;
        hospitalName: string;
        appointmentDateTime: Date;
        status: string;
        notes?: string;
    }): Promise<void>;
}
