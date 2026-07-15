export declare enum UserRole {
    PATIENT = "patient",
    DOCTOR = "doctor",
    ADMIN = "admin"
}
export declare class User {
    id: string;
    email: string;
    name: string;
    avatarUrl: string;
    role: UserRole;
    provider: string;
    providerId: string;
    isActive: boolean;
    lastLoginAt: Date;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    password: string;
}
