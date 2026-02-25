// User and Session Types
export interface UserStu {
    name?: string;
    email?: string;
    image?: string;
    student_id?: string;
    role?: string;
}

export interface Session {
    user?: UserStu;
    expires?: string;
}

export interface LabRoom {
    lab_id: number;
    lab_name: string;
}

export interface LabData {
    roomId: number;
    tables: TableReservation[];
    status: string;
    statusDescribe: string;
    selectedDate: string;
    selectedTime: string;
}

export interface TableReservation {
    table_id: number;
    table_code: string;
    is_available: boolean;
}

export interface ReservedTable {
    booking_id: number;
    table_id: number;
    table_code: string;
    lab_id: number;
    lab_name: string;
    date: string;
    slot: string;
}

// Auth Types
export interface AuthCallbacks {
    signIn: (params: { user: UserStu; account?: any; profile?: any }) => Promise<boolean>;
    session: (params: { session: Record<string, any>; token: any }) => Promise<Session>;
}