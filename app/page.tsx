import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import SearchBar from "./components/SearchBar";

// Home Page
export default function Home() {
  return (
    <main className="h-screen pt-20">
      <div className="bg-hero bg-cover bg-center h-full w p-2 flex flex-col content-center items-center">
        {/* container for texas tech banner */}
        <div className="w-full mt-24 pb-5 sm:w-4/5 lg:w-3/5">
          <Image
            src="/TTU_Word_Mark.png"
            alt="TTU DoubleT"
            width={1000}
            height={1000}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <h1 className="text-4xl text-red-600 font-bold pb-0 sm:text-5xl md:text-6xl 2xl:text-8xl">
          Red Rater
        </h1>
        <p className="text-sm font-bold text-center pb-5 sm:text-base lg:text-lg 2xl:text-2x">
          Professor and Course Evaluation Tool
        </p>
        <div className="pt-10 w-auto sm:w-1/2 lg:w-2/5 2xl:w-1/4">
          <SearchBar />
        </div>
        <label
          htmlFor="ai-drawer"
          className="btn shadow-none border-none bg-transparent hover:bg-transparent text-xs font-bold text-center pb-5 sm:text-sm lg:text-md 2xl:text-lg px-10"
        >
          Can't find the right fit? Click here to try our AI tool.
        </label>
      </div>
    </main>
  );
}
