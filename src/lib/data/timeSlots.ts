// export const timeSlots = [
//   { id: 'slot-08', displayTime: '08:00' },
//   { id: 'slot-09', displayTime: '09:00' },
//   { id: 'slot-10', displayTime: '10:00' },
//   { id: 'slot-11', displayTime: '11:00' },
//   { id: 'slot-12', displayTime: '12:00' },
//   { id: 'slot-13', displayTime: '13:00' },
//   { id: 'slot-14', displayTime: '14:00' },
//   { id: 'slot-15', displayTime: '15:00' },
//   { id: 'slot-16', displayTime: '16:00' },
// ] as const;

// export const timeSlots = [
//   { id:'slot-08', startTime:'08:00', endTime:'09:00', displayTime:'08:00' },
//   { id:'slot-09', startTime:'09:00', endTime:'10:00', displayTime:'09:00' },
//   { id:'slot-10', startTime:'10:00', endTime:'11:00', displayTime:'10:00' },
//   { id:'slot-11', startTime:'11:00', endTime:'12:00', displayTime:'11:00' },
//   { id:'slot-12', startTime:'12:00', endTime:'13:00', displayTime:'12:00' },
//   { id:'slot-13', startTime:'13:00', endTime:'14:00', displayTime:'13:00' },
//   { id:'slot-14', startTime:'14:00', endTime:'15:00', displayTime:'14:00' },
//   { id:'slot-15', startTime:'15:00', endTime:'16:00', displayTime:'15:00' },
//   { id:'slot-16', startTime:'16:00', endTime:'17:00', displayTime:'16:00' }
// ]

// import { env } from '$env/dynamic/private';
// import type { TimeSlot } from '$lib/shared/types';

// let _slots: TimeSlot[] = [];

// const fetchTimeSlots = async () => {
//     try {
//         console.log(1);
//         const BACKEND_URL = import.meta.env.VITE_BACKEND_API_URL

//         const response = await fetch(`${BACKEND_URL}/table_service/timeslots`, {
//             method: 'GET',
//             headers: {
//                 'Content-Type': 'application/json',
//             }
//         });

//         if (!response.ok) {
//             console.error('Failed to fetch time slots:', response.status);
//         }

//         const data = await response.json();
        
//         // Backend returns: { success: true, timeslots: [...] }
//         if (!data.success || !Array.isArray(data.timeslots)) {
//             console.error('Invalid response format:', data);
//         }

//         // Map backend fields to frontend TimeSlot type
//         const slots: TimeSlot[] = data.timeslots.map((slot: any) => ({
//             id: slot.slot_id,              
//             startTime: slot.start_at,      
//             endTime: slot.end_at,          
//             displayTime: `${slot.start_at} - ${slot.end_at}`
//         }));
//         console.log('Loaded', slots.length, 'time slots');
//         _slots = slots;

//     } catch (error) {
//         console.error('Error fetching time slots:', error);
//         return [];
//     }
// };
// export const getTimeSlots = (): TimeSlot[] => {
//   if (!_slots) throw new Error("not loaded yet");
//   return _slots;
// }

// export const timeSlots: TimeSlot[];