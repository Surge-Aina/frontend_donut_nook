import React, { useState, useEffect, useCallback } from 'react';
import { storeAPI } from '../utils/api';

// Custom event name for when store timings are updated
const STORE_TIMINGS_UPDATED_EVENT = 'storeTimingsUpdated';

const StoreStatusBanner = () => {
  const [status, setStatus] = useState({
    isStoreOpen: true,
    nextOpeningTime: null
  });

  const checkStatus = useCallback(async () => {
    try {
      const now = new Date();
      console.log('Checking store status at:', now.toLocaleTimeString());
      
      const [statusData, storeHours] = await Promise.all([
        storeAPI.getStoreStatus(),
        storeAPI.getStoreTimings()
      ]);
      
      console.log('Fetched store hours:', storeHours);
      
      const today = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const todayHours = storeHours[today];
      
      console.log(`Today (${today}) hours:`, todayHours);
      
      let isOpen = statusData.isOpen;
      let nextOpeningTime = statusData.nextOpeningTime;
      
      // If we have today's hours, verify if we're actually open
      if (todayHours && !todayHours.isClosed) {
        const [openHour, openMinute] = todayHours.open.split(':').map(Number);
        const [closeHour, closeMinute] = todayHours.close.split(':').map(Number);
        
        const openTime = new Date(now);
        openTime.setHours(openHour, openMinute, 0, 0);
        
        const closeTime = new Date(now);
        closeTime.setHours(closeHour, closeMinute, 0, 0);
        
        // If current time is before opening time
        if (now < openTime) {
          isOpen = false;
          nextOpeningTime = openTime.toISOString();
        } 
        // If current time is after closing time
        else if (now > closeTime) {
          console.log('Current time is after closing time');
          isOpen = false;
          // Find next open day
          let daysToAdd = 1;
          let nextOpenDayFound = false;
          
          console.log('Looking for next open day...');
          
          // Check up to 7 days in advance
          while (daysToAdd <= 7 && !nextOpenDayFound) {
            const nextDay = new Date(now);
            nextDay.setDate(now.getDate() + daysToAdd);
            const nextDayName = nextDay.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
            const nextDayHours = storeHours[nextDayName];
            
            if (nextDayHours && !nextDayHours.isClosed) {
              const [nextOpenHour, nextOpenMinute] = nextDayHours.open.split(':').map(Number);
              const nextOpen = new Date(nextDay);
              nextOpen.setHours(nextOpenHour, nextOpenMinute, 0, 0);
              nextOpeningTime = nextOpen.toISOString();
              nextOpenDayFound = true;
              console.log(`Found next open day: ${nextDayName} at ${nextOpenHour}:${nextOpenMinute}`);
            } else {
              console.log(`Day ${nextDayName} is ${nextDayHours?.isClosed ? 'closed' : 'not found'}`);
            }
            
            daysToAdd++;
          }
        }
      }
      
      setStatus({
        isStoreOpen: isOpen,
        nextOpeningTime: nextOpeningTime
      });
    } catch (error) {
      console.error('Error checking store status:', error);
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkStatus();
    
    // Set up interval for regular checks
    const interval = setInterval(checkStatus, 60000); // Check every minute
    
    // Listen for store timings updates
    const handleTimingsUpdated = () => {
      console.log('Store timings updated - refreshing status');
      checkStatus();
    };
    
    window.addEventListener(STORE_TIMINGS_UPDATED_EVENT, handleTimingsUpdated);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener(STORE_TIMINGS_UPDATED_EVENT, handleTimingsUpdated);
    };
  }, [checkStatus]);

  const getStatusInfo = () => {
    if (status.isStoreOpen) {
      return {
        message: 'We are open! Come visit us! 🍩',
        bgColor: '#f0f7eb', // Very light green
        textColor: '#2e7d32',
        borderColor: '#81c784' // Soft green border
      };
    }

    if (status.nextOpeningTime) {
      const nextOpen = new Date(status.nextOpeningTime);
      const options = { 
        weekday: 'long', 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      };
      return {
        message: `We're currently closed. Next opening: ${nextOpen.toLocaleString('en-US', options)}`,
        bgColor: '#f8f9fa', // Off-white
        textColor: '#3d2b1f', // Dark brown to match site's text
        borderColor: '#d4d4d4' // Light gray border
      };
    }

    return {
      message: 'We are currently closed.',
      bgColor: '#f8f9fa', // Off-white
      textColor: '#3d2b1f', // Dark brown to match site's text
      borderColor: '#d4d4d4' // Light gray border
    };
  };

  const statusInfo = getStatusInfo();
  
  // Prevent body scroll when banner is open
  useEffect(() => {
    document.body.style.overflow = 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Add padding to main content to account for fixed banner
  useEffect(() => {
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.paddingTop = '48px'; // Height of the banner + some spacing
    }
    
    return () => {
      if (mainContent) {
        mainContent.style.paddingTop = '';
      }
    };
  }, []);


  return (
    <div
      className="w-full fixed left-0 z-40 shadow-sm transition-all duration-300"
      style={{
        top: '80px', // Positioned right below the navbar
        backgroundColor: statusInfo.bgColor,
        color: statusInfo.textColor,
        borderBottom: `1px solid ${statusInfo.borderColor}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center justify-between">
          <div className="w-full text-center">
            <p className="text-sm md:text-[15px] font-medium font-['Montserrat'] leading-tight px-2">
              {statusInfo.message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export the event name so other components can trigger a refresh
export { STORE_TIMINGS_UPDATED_EVENT };

export default StoreStatusBanner;
