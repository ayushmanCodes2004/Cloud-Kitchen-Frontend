import React from 'react';
import { ParallaxLandingPage } from '../auth/ParallaxLandingPage';

export const ParallaxLandingDemo: React.FC = () => {
  const handleOrderNow = () => {
    alert('🍽️ Order Now clicked! This would navigate to the order page.');
  };

  const handleBecomeChef = () => {
    alert('👨‍🍳 Become a Chef clicked! This would navigate to chef registration.');
  };

  const handleSignIn = () => {
    alert('🔐 Sign In clicked! This would navigate to the login page.');
  };

  return (
    <div className="min-h-screen">
      <ParallaxLandingPage
        onOrderNow={handleOrderNow}
        onBecomeChef={handleBecomeChef}
        onSignIn={handleSignIn}
      />
    </div>
  );
};