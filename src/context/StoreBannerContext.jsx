import React, { createContext, useContext, useState, useEffect } from 'react';

const StoreBannerContext = createContext();

export const StoreBannerProvider = ({ children }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [bannerInitialized, setBannerInitialized] = useState(false);

  // Check session storage on initial load
  useEffect(() => {
    const bannerHidden = sessionStorage.getItem('bannerHidden');
    if (bannerHidden) {
      setShowBanner(false);
    }
    setBannerInitialized(true);
  }, []);

  // Function to hide the banner
  const hideBanner = () => {
    setShowBanner(false);
    sessionStorage.setItem('bannerHidden', 'true');
  };

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (!showBanner) return;
    
    const timer = setTimeout(() => {
      hideBanner();
    }, 5000);

    return () => clearTimeout(timer);
  }, [showBanner]);

  return (
    <StoreBannerContext.Provider value={{ showBanner, bannerInitialized, hideBanner }}>
      {children}
    </StoreBannerContext.Provider>
  );
};

export const useStoreBanner = () => {
  const context = useContext(StoreBannerContext);
  if (!context) {
    throw new Error('useStoreBanner must be used within a StoreBannerProvider');
  }
  return context;
};
