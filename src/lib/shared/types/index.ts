// User and Session Types
export interface UserStu {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    student_id?: string | null;
    role?: string | null;
}

export interface Session {
    user?: UserStu;
    expires?: string;
}

export interface LabRoom {
    lab_id: number;
    lab_name: string;
}

export interface BookingStats {
    userUpcoming: number,
    userTotal: number,
    allTotal: number,
    percentage: number
}

export interface LabData {
    roomId: number;
    bookings: ReservedTable[]
    classPeriods: ClassPeriod[];
}

export interface LabHandleSelected {
    tables: TableReservation[];
    status: string;
    statusDescribe: string;
    isReserved: boolean;
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

export interface ClassPeriod {
    day_of_week: number;
    slot: string;
    subject: string;
}

export interface ScheduleData {
    roomId: number | undefined;
    classPeriods: ClassPeriod[];
}

// Auth Types
export interface AuthCallbacks {
    signIn: (params: { user: UserStu; account?: any; profile?: any }) => Promise<boolean>;
    session: (params: { session: Record<string, any>; token: any }) => Promise<Session>;
}