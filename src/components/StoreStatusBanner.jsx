import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { isStoreOpen, getNextOpeningTime } from '../utils/storeStatus';

const API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5100/api';

const StoreStatusBanner = () => {
  const [isOpen, setIsOpen] = useState(null);
  const [nextOpening, setNextOpening] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storeName, setStoreName] = useState('The Donut Nook');
  const [isVisible, setIsVisible] = useState(true);

  // Check sessionStorage when component mounts
  useEffect(() => {
    const bannerDismissed = sessionStorage.getItem('bannerDismissed');
    if (bannerDismissed === 'true') {
      setIsVisible(false);
    }
    
    // Auto-hide after 5 seconds if not already dismissed
    const timer = setTimeout(() => {
      if (bannerDismissed !== 'true') {
        setIsVisible(false);
        sessionStorage.setItem('bannerDismissed', 'true');
      }
    }, 120000); // 2 minutes
    
    return () => clearTimeout(timer);
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
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="bg-gray-100 text-gray-800 p-2 text-center text-sm">
        Loading store status...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 p-2 text-center text-sm">
        {error}
      </div>
    );
  }



  return (
    <div className={`p-2 text-center text-sm ${
      isOpen 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800'
    }`}>
      {isOpen ? (
        <div className="flex items-center justify-center space-x-2">
          <span className="inline-flex items-center justify-center w-5 h-5 bg-green-100 rounded-full">
            <span className="w-2 h-2 bg-green-600 rounded-full"></span>
          </span>
          <span>{storeName} is now open! Come visit us! {/* eslint-disable-next-line */}
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
