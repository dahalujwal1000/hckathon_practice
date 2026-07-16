import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Boolean(process.env.SMTP_SECURE) || false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendAppointmentConfirmation(
    patientEmail: string,
    patientName: string,
    appointmentDetails: {
      doctorName: string;
      hospitalName: string;
      appointmentDateTime: Date;
      status: string;
      notes?: string;
    },
  ): Promise<void> {
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@nepalhealthhospital.com',
      to: patientEmail,
      subject: 'Appointment Confirmation - Nepal Health Hospital',
      html: `
        <h2>Appointment Confirmation</h2>
        <p>Dear ${patientName},</p>
        <p>Your appointment has been successfully booked.</p>
        <ul>
          <li><strong>Doctor:</strong> ${appointmentDetails.doctorName}</li>
          <li><strong>Hospital:</strong> ${appointmentDetails.hospitalName}</li>
          <li><strong>Date & Time:</strong> ${new Date(appointmentDetails.appointmentDateTime).toLocaleString()}</li>
          <li><strong>Status:</strong> ${appointmentDetails.status}</li>
          ${appointmentDetails.notes ? `<li><strong>Notes:</strong> ${appointmentDetails.notes}</li>` : ''}
        </ul>
        <p>Please arrive 15 minutes before your scheduled time.</p>
        <p>Thank you for choosing Nepal Health Hospital!</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      // Log the error but do not throw because we don't want to fail the appointment creation if email fails
      console.error('Failed to send appointment confirmation email:', error);
      // Optionally, you can re-throw if you want to fail the appointment creation
      // throw new Error('Failed to send email');
    }
  }
}