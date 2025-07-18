import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StoreCard from './StoreCard';
import { getCookie } from './CookieManager';
import toast from './toastLogger'; 
import { useLoading } from '../utils/LoadingContext';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5100';

// Convert 12-hour format (hh:mm AM/PM) to 24-hour format (HH:mm)
const formatTimeTo24Hour = (timeStr) => {
  if (!timeStr) return '';
  
  // If already in 24-hour format, return as is
  if (timeStr.includes(':')) {
    const [hours, minutes] = timeStr.split(':');
    if (hours.length === 2 && !isNaN(hours) && !isNaN(minutes)) {
      return timeStr;
    }
  }
  
  // Parse 12-hour format
  const [time, period] = timeStr.split(' ');
  let [hours, minutes = '00'] = time.split(':');
  
  let h = parseInt(hours, 10);
  const m = (minutes || '00').padStart(2, '0');
  
  if (period === 'PM' && h < 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  
  return `${h.toString().padStart(2, '0')}:${m}`;
};

// Convert HH:mm (24-hour) to 12-hour AM/PM format
const formatTimeTo12Hour = (timeStr) => {
  if (!timeStr) return '12:00 AM';
  
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

const StoreAdmin = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  //const [isLoading, setIsLoading] = useState(true);
  const { isLoading, setIsLoading} = useLoading();
  const [storeInfo, setStoreInfo] = useState({
    name: "The Donut Nook",
    address: "958 East Ave A, Chico, CA 95926",
    phone: "(530) 342-2118",
    hours: {},
    specialHours: ""
  });
  
  // Default hours to use if none are loaded from the server
  const defaultHours = {
    monday: [
      { open: "12:00 AM", close: "1:00 PM" },
      { open: "8:30 PM", close: "12:00 AM" }
    ],
    tuesday: [
      { open: "12:00 AM", close: "1:00 PM" },
      { open: "8:30 PM", close: "12:00 AM" }
    ],
    wednesday: [
      { open: "12:00 AM", close: "11:59 PM", _is24Hours: true }
    ],
    thursday: [
      { open: "12:00 AM", close: "11:59 PM", _is24Hours: true }
    ],
    friday: [
      { open: "12:00 AM", close: "11:59 PM", _is24Hours: true }
    ],
    saturday: [
      { open: "12:00 AM", close: "11:59 PM", _is24Hours: true }
    ],
    sunday: [
      { open: "12:00 AM", close: "1:00 PM" },
      { open: "8:30 PM", close: "12:00 AM" }
    ]
  };

  // Fetch store info from backend
  useEffect(() => {
    const fetchStoreInfo = async () => {
       setIsLoading(true);
      try {
        
        const [infoRes, timingsRes] = await Promise.all([
          axios.get(`${API_URL}/store-info`),
          axios.get(`${API_URL}/store-info/timings`).catch(error => {
            // Using default timings
            return { data: {} }; // Return empty object if timings endpoint fails
          })
        ]);

        const { storeName, address, phone, specialHours } = infoRes.data;
        const timings = timingsRes.data?.data || timingsRes.data || {}; // Handle both response formats
        

        
        // Convert timings to our frontend format
        const formattedHours = {};
        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        
        // Initialize with default hours first
        Object.assign(formattedHours, JSON.parse(JSON.stringify(defaultHours))); // Deep clone defaults
        
        // Then update with any timings from the server
        Object.entries(timings).forEach(([day, timing]) => {
          if (!timing || !days.includes(day)) return;
          

          
          if (timing.isClosed) {
            formattedHours[day] = [];
          } else if (timing.splitHours && timing.splitHours.length > 0) {
            // Convert each slot in splitHours to 12-hour format
            formattedHours[day] = timing.splitHours.map(slot => ({
              open: formatTimeTo12Hour(slot.open),
              close: formatTimeTo12Hour(slot.close)
            }));
            
            // If it's a 24-hour operation, set the flag as non-enumerable
            if (timing.splitHours.some(slot => 
              (slot.open === '00:00' && slot.close === '23:59') ||
              (slot.open === '00:00' && slot.close === '00:00') ||
              (slot.open === '00:00' && slot.close === '24:00')
            )) {
              Object.defineProperty(formattedHours[day], '_is24Hours', {
                value: true,
                enumerable: false,
                configurable: true,
                writable: true
              });
            }
          } else if (timing.open && timing.close) {
            // Handle legacy format (single open/close)
            formattedHours[day] = [{
              open: formatTimeTo12Hour(timing.open),
              close: formatTimeTo12Hour(timing.close)
            }];
            
            // Check if it's a 24-hour operation
            if ((timing.open === '00:00' && timing.close === '23:59') ||
                (timing.open === '00:00' && timing.close === '00:00') ||
                (timing.open === '00:00' && timing.close === '24:00')) {
              Object.defineProperty(formattedHours[day], '_is24Hours', {
                value: true,
                enumerable: false,
                configurable: true,
                writable: true
              });
            }
          }
        });


        
        setStoreInfo(prev => ({
          ...prev,
          name: storeName || prev.name,
          address: address?.street || prev.address,
          phone: phone || prev.phone,
          specialHours: specialHours || prev.specialHours,
          hours: formattedHours
        }));
      } catch (error) {
        console.error('Error fetching store info:', error);
        // Keep default values if API fails
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Handle time slot changes
    if (name.startsWith('hours.')) {
      const [_, day, index, field] = name.split('.');
      const slotIndex = parseInt(index, 10);
      
      setStoreInfo(prev => {
        const newHours = { ...prev.hours };
        
        // Ensure the day's time slots array exists
        if (!newHours[day]) {
          newHours[day] = [];
        }
        
        // Ensure the time slot object exists
        if (!newHours[day][slotIndex]) {
          newHours[day][slotIndex] = { open: '12:00 AM', close: '1:00 PM' };
        }
        
        // Update the specific field
        newHours[day][slotIndex] = {
          ...newHours[day][slotIndex],
          [field]: value
        };
        
        return {
          ...prev,
          hours: newHours
        };
      });
    } 
    // Handle other nested properties
    else if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setStoreInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } 
    // Handle top-level properties
    else {
      setStoreInfo(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Prepare timings array for backend
      const timings = [];
      const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      
      days.forEach(day => {
        const slots = Array.isArray(storeInfo.hours[day]) 
          ? storeInfo.hours[day].filter(slot => 
              slot && typeof slot === 'object' && 'open' in slot && 'close' in slot
            )
          : [];
          
        // Check if this day is set to 24-hour operation
        const is24Hours = storeInfo.hours[day]?._is24Hours === true;
        
        // Handle 24-hour operation
        if (is24Hours) {
          timings.push({
            day,
            isClosed: false,
            open: '00:00',  // Midnight in 24-hour format
            close: '23:59', // End of day in 24-hour format
            splitHours: [
              { open: '00:00', close: '23:59' }
            ]
          });
          return;
        }

        // If no slots, mark as closed
        if (!slots || slots.length === 0) {
          timings.push({ 
            day, 
            isClosed: true,
            open: '00:00',
            close: '00:00',
            splitHours: []
          });
          return;
        }

        // Filter out invalid slots and clean up the data
        const cleanedSlots = (Array.isArray(slots) ? slots : []).filter(slot => 
          slot && 
          typeof slot === 'object' && 
          slot.open && 
          typeof slot.open === 'string' && 
          slot.close && 
          typeof slot.close === 'string'
        );

        if (cleanedSlots.length === 0) {
          timings.push({ 
            day, 
            isClosed: true,
            open: '00:00',
            close: '00:00',
            splitHours: []
          });
          return;
        }

        // Create timing object with splitHours
        const timing = {
          day,
          isClosed: false,
          open: formatTimeTo24Hour(cleanedSlots[0].open) || '00:00',
          close: formatTimeTo24Hour(cleanedSlots[cleanedSlots.length - 1].close) || '23:59',
          splitHours: cleanedSlots.map(slot => ({
            open: formatTimeTo24Hour(slot.open) || '00:00',
            close: formatTimeTo24Hour(slot.close) || '23:59'
          }))
        };

        timings.push(timing);
      });

      // Convert to the format expected by the backend
      const timingsData = { timings };



      // Update store info
      await axios.put(`${API_URL}/store-info`, {
        storeName: storeInfo.name,
        address: { street: storeInfo.address },
        phone: storeInfo.phone,
        specialHours: storeInfo.specialHours
      });

      // Log the request data for debugging
      // Update store timings - send as object with timings array
      await axios.put(`${API_URL}/store-info/timings`, timingsData);
      
      setIsEditing(false);
      // Success message removed
      toast.success('Store info successfully updated!');
    } catch (error) {
      console.error('Error updating store info:', error);
      // Keep error alert for debugging
      alert(`Failed to update store information: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const toggle24Hours = (day, is24Hours) => {
    setStoreInfo(prev => {
      const newHours = { ...prev.hours };
      if (is24Hours) {
        // For 24-hour operation, set a single time slot from 12:00 AM to 11:59 PM
        newHours[day] = [
          { open: '12:00 AM', close: '11:59 PM' }
        ];
        // Store the flag as a non-enumerable property that won't be sent to the backend
        Object.defineProperty(newHours[day], '_is24Hours', {
          value: true,
          enumerable: false,
          writable: true
        });
      } else {
        // When toggling off 24-hour mode, keep the existing time slots but remove the flag
        newHours[day] = [...(prev.hours[day] || [])].filter(slot => 
          slot && typeof slot === 'object' && 'open' in slot && 'close' in slot
        );
      }
      return { ...prev, hours: newHours };
    });
  };

  const renderTimeSlotInputs = (day, timeSlot, slotIndex) => {
    const is24Hours = storeInfo.hours[day]?._is24Hours;
    
    // Ensure timeSlot is an object with open and close properties
    const slot = {
      open: timeSlot?.open || '12:00 AM',
      close: timeSlot?.close || '1:00 PM'
    };
    
    return (
      <div key={`${day}-${slotIndex}`} className="grid grid-cols-2 gap-2 mb-2 p-2 bg-gray-50 rounded">
        {slotIndex === 0 && (
          <div className="col-span-2 flex items-center mb-2">
            <input
              type="checkbox"
              id={`${day}-24h`}
              checked={is24Hours || false}
              onChange={(e) => toggle24Hours(day, e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor={`${day}-24h`} className="ml-2 block text-sm text-gray-700">
              Open 24 hours
            </label>
          </div>
        )}
        
        <div>
          <label className="block text-xs text-gray-500">Open</label>
          <select
            name={`hours.${day}.${slotIndex}.open`}
            value={slot.open}
            onChange={handleChange}
            disabled={is24Hours}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {generateTimeOptions().map((time, idx) => (
              <option key={`open-${idx}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500">Close</label>
          <select
            name={`hours.${day}.${slotIndex}.close`}
            value={slot.close}
            onChange={handleChange}
            disabled={is24Hours}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
          >
            {generateTimeOptions().map((time, idx) => (
              <option key={`close-${idx}`} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
        {storeInfo.hours[day].length > 1 && (
          <button
            type="button"
            onClick={() => removeTimeSlot(day, slotIndex)}
            className="col-span-2 mt-1 px-2 py-1 text-xs text-red-600 hover:text-red-800"
          >
            Remove time slot
          </button>
        )}
      </div>
    );
  };

  // Generate time options in 30-minute intervals
  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute of ['00', '30']) {
        const time = new Date(2000, 0, 1, hour, minute);
        const timeString = time.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
        options.push(timeString);
      }
    }
    return options;
  };

  const addTimeSlot = (day) => {
    setStoreInfo(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: [
          ...prev.hours[day],
          { open: '12:00 AM', close: '1:00 PM' }
        ]
      }
    }));
  };

  const removeTimeSlot = (day, index) => {
    if (storeInfo.hours[day].length <= 1) return;
    
    setStoreInfo(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: prev.hours[day].filter((_, i) => i !== index)
      }
    }));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isEditing) {
    const isLoggedIn = !!getCookie('token');
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Store Information</h1>
          {isLoggedIn && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: '#F5DA41',
                color: '#3d2b1f',
                border: '1px solid #3d2b1f',
                boxShadow: '2px 2px 0px rgba(43, 39, 36, 0.822)',
                fontWeight: 600,
                minWidth: '44px',
                minHeight: '44px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(2px)';
                e.currentTarget.style.boxShadow = '1px 1px 0px rgba(43, 39, 36, 0.6)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '2px 2px 0px rgba(43, 39, 36, 0.822)';
              }}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Edit Store Info'}
            </button>
          )}
        </div>
        <StoreCard 
          storeInfo={storeInfo} 
          isAdmin={false} 
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Store Information</h1>
          <div className="space-x-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Store Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700">Store Name</label>
            <input
              type="text"
              name="name"
              value={storeInfo.name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              value={storeInfo.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={storeInfo.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Store Hours</h2>
          <div className="space-y-4">
            {Object.entries(storeInfo.hours).map(([day, timeSlots]) => (
              <div key={day} className="mb-4 p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {day}:
                  </label>
                  <button
                    type="button"
                    onClick={() => addTimeSlot(day)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    + Add time slot
                  </button>
                </div>
                <div className="space-y-2">
                  {timeSlots.map((timeSlot, index) => (
                    renderTimeSlotInputs(day, timeSlot, index)
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Special Hours Note</label>
          <input
            type="text"
            name="specialHours"
            value={storeInfo.specialHours}
            onChange={handleChange}
            placeholder="E.g., Closed on major holidays"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </form>
    </div>
  );
};

export default StoreAdmin;