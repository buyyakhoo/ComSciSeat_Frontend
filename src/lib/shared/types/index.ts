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

export interface TableReservation {
    table_id: number;
    table_code: string;
    is_booked: boolean;
}
    

export type TableStatusType = 'available' | 'reserved';

// Stats Types
export interface TableStats {
    available: number;
    reserved: number;
}

// Auth Types
export interface AuthCallbacks {
    signIn: (params: { user: UserStu; account?: any; profile?: any }) => Promise<boolean>;
    session: (params: { session: Record<string, any>; token: any }) => Promise<Session>;
}