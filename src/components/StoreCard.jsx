import React from 'react';

// Convert HH:mm (24-hour) to 12-hour AM/PM format
const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return 'Closed';
  if (timeStr === 'Closed') return 'Closed';

  // If already in 12-hour format, return as is
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }

  // Handle 24-hour format
  const [hours, minutes] = timeStr.split(':');
  let h = parseInt(hours, 10);
  const m = (minutes || '00').padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12; // convert 0 to 12
  return `${h}:${m} ${ampm}`;
};

// Alias for backward compatibility
const formatTimeDisplay = formatTimeTo12Hour;

const StoreCard = ({ storeInfo, isAdmin = false, onEdit }) => {
  const { name, address, phone, hours = {}, specialHours } = storeInfo;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
          {isAdmin && (
            <button
              onClick={onEdit}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Edit Store Info
            </button>
          )}
        </div>
        
        <div className="mt-6 grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Store Hours</h2>
            <div className="space-y-2">
              {Object.entries(hours).map(([day, timeSlots]) => {
                // Skip the _is24Hours property if it exists
                if (day === '_is24Hours') return null;
                
                // Check if this day is set to 24 hours
                const is24Hours = hours[day]?._is24Hours;
                
                // Ensure timeSlots is an array and has items
                const slots = Array.isArray(timeSlots) ? timeSlots.filter(slot => slot && typeof slot === 'object') : [];
                
                // Handle 24-hour display
                if (is24Hours || (slots.length === 1 && 
                    slots[0].open === '00:00' && 
                    (slots[0].close === '23:59' || slots[0].close === '24:00'))) {
                  return (
                    <div key={day} className="flex justify-between">
                      <span className="capitalize font-medium">{day}:</span>
                      <span>Open 24 hours</span>
                    </div>
                  );
                }
                
                return (
                  <div key={day} className="flex justify-between">
                    <span className="capitalize font-medium">{day}:</span>
                    <div className="text-right">
                      {slots.length > 0 ? (
                        slots.map((slot, index) => {
                          if (!slot || !slot.open || !slot.close) return null;
                          return (
                            <div key={index} className="whitespace-nowrap">
                              {formatTimeDisplay(slot.open)} - {formatTimeDisplay(slot.close)}
                              {index < slots.length - 1 && <span className="mx-1">,</span>}
                            </div>
                          );
                        })
                      ) : (
                        <span className="text-gray-500">Closed</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            {specialHours && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-md">
                <p className="text-yellow-800">Note: {specialHours}</p>
              </div>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-3">
              <div className="flex items-start">
                <span className="font-medium w-20">Address:</span>
                <span>{address}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium w-20">Phone:</span>
                <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-blue-600 hover:underline">
                  {phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;