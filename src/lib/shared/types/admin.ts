import type { LabRoom } from "./usermode";

export interface AdminCardHeaderProps {
    title: string;
    describe: string;
    btnDetail?: string;
    onButton?: () => void;
}

// export interface AddClassScheduleModalProps {
//     labs: LabRoom[];
//     onClose: () => void;
//     onSubmit: (data: ClassScheduleData) => void;   
// }