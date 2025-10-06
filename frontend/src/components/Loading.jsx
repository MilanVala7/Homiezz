

const FancyLoader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white">
      {/* Centered Logo */}
      {/* <img src={logo} alt="Learnly Logo" className="w-44 h-44 animate-pulse" /> */}

      {/* Bold "Please wait..." Directly Below the Logo */}
      <p className="text-black-600 text-lg font-bold mt-4">Please wait...</p>
    </div>
  );
};

export default FancyLoader;
