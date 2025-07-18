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

  // Auto-hide after 2 minutes (120,000ms)
  useEffect(() => {
    if (!showBanner) return;
    
    const timer = setTimeout(() => {
      hideBanner();
    }, 120000); // 2 minutes

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
