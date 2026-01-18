import { ParallaxLandingPage } from '../auth/ParallaxLandingPage';

export const ParallaxLandingDemo = () => {
  const handleOrderNow = () => {
    console.log('Order Now clicked - would redirect to menu/registration');
    alert('Order Now clicked! This would redirect to the menu or registration page.');
  };

  const handleBecomeChef = () => {
    console.log('Become Chef clicked - would redirect to chef onboarding');
    alert('Become Chef clicked! This would redirect to the chef onboarding page.');
  };

  const handleSignIn = () => {
    console.log('Sign In clicked - would redirect to login');
    alert('Sign In clicked! This would redirect to the login page.');
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

export default ParallaxLandingDemo;