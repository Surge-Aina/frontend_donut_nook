import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { isStoreOpen, getNextOpeningTime } from '../utils/storeStatus';
import { useStoreBanner } from '../context/StoreBannerContext';

// Add CSS for the fade-out animation
const bannerStyles = `
  @keyframes fadeOut {
    from { 
      opacity: 1;
      transform: translateY(0);
    }
    to { 
      opacity: 0;
      transform: translateY(-100%);
    }
  }
  
  .banner-fade-out {
    animation: fadeOut 1s ease-out forwards;
    pointer-events: none;
  }
`;

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5100/api';

const StoreStatusBanner = () => {
  // State hooks
  const [isOpen, setIsOpen] = useState(null);
  const [nextOpening, setNextOpening] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeName, setStoreName] = useState('The Donut Nook');
  const [isHiding, setIsHiding] = useState(false);
  
  // Context hooks
  const { showBanner, bannerInitialized, hideBanner } = useStoreBanner();
  
  // Refs
  const bannerRef = useRef(null);
  
  // Effects
  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        // Fetch store info and timings in parallel
        const [timingsResponse, infoResponse] = await Promise.all([
          axios.get(`${API_URL}/store-info/timings`).catch(() => ({ data: {} })),
          axios.get(`${API_URL}/store-info`).catch(() => ({ data: {} }))
        ]);

        // Update store name if available
        if (infoResponse.data?.storeName) {
          setStoreName(infoResponse.data.storeName);
        }

        const timings = timingsResponse.data?.data || timingsResponse.data || {};
        
        // Check if store is currently open
        const open = isStoreOpen(timings);
        setIsOpen(open);
        
        // Get next opening time if store is closed
        if (!open) {
          const next = getNextOpeningTime(timings);
          setNextOpening(next);
        }
        
        // Clear any previous errors
        setError(null);
        
      } catch (err) {
        console.error('Error fetching store status:', err);
        setError('Unable to fetch store status');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchStoreStatus();
    
    // Refresh status every minute
    const interval = setInterval(fetchStoreStatus, 60000);
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStoreStatus = async () => {
      try {
        // Fetch store info and timings in parallel
        const [timingsResponse, infoResponse] = await Promise.all([
          axios.get(`${API_URL}/store-info/timings`).catch(() => ({ data: {} })),
          axios.get(`${API_URL}/store-info`).catch(() => ({}))
        ]);

        // Update store name if available
        if (infoResponse.data?.storeName) {
          setStoreName(infoResponse.data.storeName);
        }

        const timings = timingsResponse.data?.data || timingsResponse.data || {};
        
        // Check if store is currently open
        const open = isStoreOpen(timings);
        setIsOpen(open);
        
        // Get next opening time if store is closed
        if (!open) {
          const next = getNextOpeningTime(timings);
          setNextOpening(next);
        }
        
        // Clear any previous errors
        setError(null);
        
      } catch (err) {
        console.error('Error fetching store status:', err);
        setError('Unable to fetch store status');
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchStoreStatus();
    
    // Refresh status every minute
    const interval = setInterval(fetchStoreStatus, 60000);
    
    // Add the style tag when component mounts
    const styleElement = document.createElement('style');
    styleElement.textContent = bannerStyles;
    document.head.appendChild(styleElement);

    // Cleanup function
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  useEffect(() => {
    if (showBanner) {
      const timer = setTimeout(() => {
        setIsHiding(true);
        // After fade out animation completes, hide the banner
        const hideTimer = setTimeout(() => {
          hideBanner();
        }, 1000); // Match this with the CSS animation duration
        
        return () => clearTimeout(hideTimer);
      }, 4000); // Start fade out at 4 seconds (shows for 5s total with 1s animation)
      
      return () => clearTimeout(timer);
    }
  }, [showBanner, hideBanner]);

  // Don't show anything until banner is initialized and data is loaded
  if (!bannerInitialized || isLoading) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-yellow-50 text-yellow-800 p-2 text-center text-sm border-b border-yellow-200">
        {error}
      </div>
    );
  }

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      ref={bannerRef}
      className={`p-2 text-center text-sm font-medium border-b transition-all duration-300 ${isHiding ? 'banner-fade-out' : ''} ${isOpen ? 'bg-green-50 text-green-800 border-green-100' : 'bg-red-50 text-red-800 border-red-100'}`}
      onClick={hideBanner}
      style={{ cursor: 'pointer' }}
      role="alert"
      aria-live="polite"
    >
      {isOpen ? (
        <div className="flex items-center justify-center space-x-2">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          </span>
          <span>
            {storeName} is now open! Come visit us! 
            {nextOpening && (
              <span className="hidden sm:inline-block ml-2 text-green-700">
                (Closes at {nextOpening.time})
              </span>
            )}
          </span>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-red-100 rounded-full">
            <span className="w-2 h-2 bg-red-600 rounded-full"></span>
          </span>
          <span>{storeName} is currently closed.</span>
          {nextOpening && (
            <span className="text-sm font-normal">
              Next opening: {nextOpening.day} at {nextOpening.time}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StoreStatusBanner;
