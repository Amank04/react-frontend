import React from "react";

const HeroSection = ({ scrollToSection }) =>  {
  return (
    <>
      <section className="bg-black text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              SmartTask
              <span className="sm:block text-3xl pt-1">
                {" "}
                Prioritize, Plan, and Achieve with Ease!{" "}
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-3xl sm:text-md/relaxed font-poppins font-thin">
              Welcome to SmartTask, your ultimate to-do list scheduler!
              SmartTask is designed to help you prioritize and manage your tasks
              efficiently, making the most of your available time and energy. It
              adapts to your needs, considering factors like task importance,
              available hours, and task dependencies, to create an optimized
              schedule that works for you.
              <span className="sm:block">
               {" "}
               <br />
              With SmartTask, staying organized and
              productive has never been easier. Let us handle the planning while
              you focus on getting things done!
              </span>
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <a
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto cursor-pointer"
                onClick={scrollToSection}
              >
                Get Started
              </a>

              {/* <a
                className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="#"
              >
                Learn More
              </a> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HeroSection;
