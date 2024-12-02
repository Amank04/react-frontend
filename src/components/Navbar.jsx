import React, { useState, useEffect } from "react";

const Navbar = () => {
  const [bgColor, setBgColor] = useState("bg-transparent"); // Initial background color
  const [underlineColor, setUnderlineColor] = useState("bg-green-600"); // Initial background color
  const [textColor, setTextColor] = useState("text-[#17847b]");
  const [boxShadow, setBoxShadow] = useState("shadow-none");
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobile menu state

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setBgColor("bg-[#111827]"); // Change to blue when scrolled
        setTextColor("text-white");
        // setBoxShadow("shadow-2xl");
        setUnderlineColor("bg-white");
      } else {
        setBgColor("bg-transparent"); // Revert to transparent when at the top
        setTextColor("text-[#17847b]");
        setBoxShadow("shadow-none");
        setUnderlineColor("bg-[#17847b]");
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll); // Cleanup on component unmount
    };
  }, []);

  return (
    <nav
      className='fixed top-0 left-0 w-full z-10 bg-black transition-colors duration-300'
    >
      <div
        className = 'max-w-7xl mx-auto px-4 py-3 flex justify-between items-center text-white'
      >
        <h1 className="text-5xl font-medium pt-[3px] font-cookie ">Smart Task</h1>
        <button
          className="lg:hidden text-xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        <ul
          className={`lg:flex space-x-6 gap-4 absolute lg:static bg-blue-600 lg:bg-transparent top-16 left-0 w-full lg:w-auto ${
            isMenuOpen ? "block" : "hidden"
          }`}
        >
          {["Home", "About", "Contact"].map((item, index) => (
            <li key={index}>
              <a
                href={`#${item.toLowerCase()}`}
                className='relative z-10 pb-1 hover:after:scale-x-100 after:scale-x-0 after:origin-center after:block after:h-[3px] after:transition-transform after:duration-300 after:ease-out after:rounded-lg after:bg-white'
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
