import type { Table, TimeSlot, TableStatus } from '$lib/shared/types';

// Generate time slots from 8:00 AM to 4:00 PM (8 slots)
export const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  for (let hour = 8; hour <= 15; hour++) {
    const startTime = `${hour.toString().padStart(2, '0')}:00`;
    const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
    slots.push({
      id: `slot-${hour}`,
      startTime,
      endTime,
      displayTime: `${startTime} - ${endTime}`
    });
  }
  return slots;
};

// Generate tables: 20 tables (2 seats), 20 tables (4 seats), 10 tables (6 seats)
// export const generateTables = (): Table[] => {
//   const tables: Table[] = [];
  
//   // 2-seat tables (IDs 1-20)
//   for (let i = 1; i <= 20; i++) {
//     tables.push({
//       id: i,
//       capacity: 2,
//       minCapacity: 2,
//       status: 'available' // Default status, will be overridden by time slot
//     });
//   }
  
//   // 4-seat tables (IDs 21-40)
//   for (let i = 21; i <= 40; i++) {
//     tables.push({
//       id: i,
//       capacity: 4,
//       minCapacity: 2,
//       status: 'available'
//     });
//   }
  
//   // 6-seat tables (IDs 41-50)
//   for (let i = 41; i <= 50; i++) {
//     tables.push({
//       id: i,
//       capacity: 6,
//       minCapacity: 4,
//       status: 'available'
//     });
//   }
  
//   return tables;
// };

// Generate mock table statuses for each time slot
// export const generateTableStatuses = (): TableStatus[] => {
//   const statuses: TableStatus[] = [];
//   const tables = generateTables();
//   const timeSlots = generateTimeSlots();
  
//   const sampleUsers = [
//     { name: 'John Doe', size: 2 },
//     { name: 'Jane Smith', size: 4 },
//     { name: 'Bob Wilson', size: 3 },
//     { name: 'Alice Brown', size: 6 },
//     { name: 'Charlie Davis', size: 2 },
//     { name: 'Eva Johnson', size: 5 }
//   ];
  
//   // Generate different statuses for each table in each time slot
//   tables.forEach(table => {
//     timeSlots.forEach(slot => {
//       // Different probability for different time slots (lunch time more busy)
//       const isLunchTime = slot.id === 'slot-12' || slot.id === 'slot-13'; // 12:00-13:00, 13:00-14:00
//       const busyProbability = isLunchTime ? 0.8 : 0.4;
      
//       let status: 'available' | 'reserved' | 'occupied' = 'available';
//       let userName: string | undefined = undefined;
//       let partySize: number | undefined = undefined;
      
//       if (Math.random() < busyProbability) {
//         status = Math.random() > 0.6 ? 'occupied' : 'reserved';
//         const randomUser = sampleUsers[Math.floor(Math.random() * sampleUsers.length)];
//         userName = randomUser.name;
//         partySize = Math.min(randomUser.size, table.capacity);
//       }
      
//       statuses.push({
//         tableId: table.id,
//         timeSlot: slot.id,
//         status,
//         userName,
//         partySize
//       });
//     });
//   });
  
//   return statuses;
// };

// Get table status for specific time slot
// export const getTableStatus = (tableId: number, timeSlotId: string, tableStatuses: TableStatus[]): TableStatus => {
//   const status = tableStatuses.find(s => s.tableId === tableId && s.timeSlot === timeSlotId);
//   return status || {
//     tableId,
//     timeSlot: timeSlotId,
//     status: 'available'
//   };
// };

// Export instances
// export const timeSlots = generateTimeSlots();
// export const tables = generateTables();
// export const tableStatuses = generateTableStatuses();