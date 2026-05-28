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
    backendToken?: string;
}

export interface LabRoom {
    lab_id: number;
    lab_name: string;
    lab_code: string;
}

export interface BookingStats {
    userUpcoming: number,
    userTotal: number,
    allTotal: number,
    percentage: number
}

export interface BookingStatsDescribe {
    title: string;
    value: number | string;
    desc: string;
}

export interface LabData {
    roomId: number;
    roomCode: string;
    bookings: ReservedTable[]
    classPeriods: ClassPeriod[];
}

export interface LabHandleSelected {
    tables: TableBooking[];
    status: string;
    statusDescribe: string;
    isReserved: boolean;
    selectedDate: string;
    selectedTime: string;
}

export interface TableBooking {
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
    roomCode: string;
    classPeriods: ClassPeriod[];
}

export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    displayTime: string;
}

export interface Table {
    id: number;
    capacity: number;
    minCapacity: number;
    status: 'available' | 'reserved' | 'occupied';
}

export interface TableStatus {
    tableId: number;
    timeSlot: string;
    status: 'available' | 'reserved' | 'occupied';
    userName?: string;
    partySize?: number;
}
export interface AuthCallbacks {
    signIn: (params: { user: UserStu; account?: any; profile?: any }) => Promise<boolean>;
    session: (params: { session: Record<string, any>; token: any }) => Promise<Session>;
}
