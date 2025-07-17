// Utility functions for store status

// Convert time string to minutes since midnight
const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  
  // Handle 12-hour format (e.g., '2:30 PM')
  if (timeStr.includes(' ')) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes = 0] = time.split(':').map(Number);
    
    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
  }
  
  // Handle 24-hour format (e.g., '14:30')
  const [hours, minutes = 0] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Check if the store is currently open
export const isStoreOpen = (hours) => {
  if (!hours) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const dayHours = hours[currentDay];
  
  // If store is closed all day
  if (!dayHours || dayHours.isClosed) {
    return false;
  }
  
  // Check if store is open 24 hours
  if (dayHours.is24Hours) {
    return true;
  }
  
  // Check each time slot for the day
  const slots = dayHours.splitHours || [];
  
  return slots.some(slot => {
    const openMinutes = timeToMinutes(slot.open);
    let closeMinutes = timeToMinutes(slot.close);
    
    // Handle overnight hours (e.g., 22:00 - 02:00)
    if (closeMinutes <= openMinutes) {
      closeMinutes += 24 * 60; // Add 24 hours
      
      // If current time is after midnight but before close time (next day)
      if (currentMinutes < closeMinutes - (24 * 60)) {
        return true;
      }
      
      // If current time is after open time but before midnight
      return currentMinutes >= openMinutes;
    }
    
    // Normal case
    return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
  });
};

// Format time to 12-hour format (e.g., '2:30 PM')
const formatTime12Hour = (minutes) => {
  const hours = Math.floor(minutes / 60) % 24;
  const mins = minutes % 60;
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${mins.toString().padStart(2, '0')} ${period}`;
};

export const getNextOpeningTime = (hours) => {
  if (!hours) return null;
  
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
  const currentDayIndex = days.indexOf(currentDay);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  // Check next 7 days
  for (let i = 0; i < 7; i++) {
    const dayIndex = (currentDayIndex + i) % 7;
    const day = days[dayIndex];
    const dayHours = hours[day];
    
    if (dayHours && !dayHours.isClosed && !dayHours.is24Hours && dayHours.splitHours?.length > 0) {
      // If checking today, only check future time slots
      const futureSlots = dayHours.splitHours.filter(slot => {
        const slotMinutes = timeToMinutes(slot.open);
        return i > 0 || slotMinutes > currentMinutes;
      });
      
      if (futureSlots.length > 0) {
        const nextSlot = futureSlots[0];
        const dayName = day.charAt(0).toUpperCase() + day.slice(1);
        return {
          day: i === 0 ? 'Today' : dayName,
          time: formatTime12Hour(timeToMinutes(nextSlot.open))
        };
      }
    } else if (i > 0 && dayHours && !dayHours.isClosed && (dayHours.is24Hours || dayHours.splitHours?.length > 0)) {
      // For future days, if the store is open at all, return the first opening time
      const dayName = day.charAt(0).toUpperCase() + day.slice(1);
      const firstSlot = dayHours.splitHours?.[0];
      return {
        day: dayName,
        time: firstSlot ? formatTime12Hour(timeToMinutes(firstSlot.open)) : 'Open all day'
      };
    }
  }
  
  return null;
};
