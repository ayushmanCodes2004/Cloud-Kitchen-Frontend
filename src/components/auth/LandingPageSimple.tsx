interface LandingPageProps {
  onOrderNow: () => void;
  onBecomeChef: () => void;
  onSignIn: () => void;
}

export const LandingPageSimple = ({ onOrderNow, onBecomeChef, onSignIn }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-red-500 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to PlatePal
        </h1>
        <p className="text-xl md:text-2xl text-white/90 mb-10">
          Your kitchen, just a tap away
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onOrderNow}
            className="px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg"
          >
            Order Now
          </button>
          <button
            onClick={onBecomeChef}
            className="px-8 py-4 bg-white hover:bg-gray-100 text-orange-600 font-semibold rounded-lg transition-all duration-300 shadow-lg"
          >
            Become Chef
          </button>
          <button
            onClick={onSignIn}
            className="px-8 py-4 bg-transparent hover:bg-white/20 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg border-2 border-white"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
