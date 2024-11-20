"use client";

import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Professor {
  Name: string;
}

const SearchBar = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [findName, setName] = useState<Professor[]>([]);
  const router = useRouter();
  const [profName, searchProfName] = useState("");

  const cleanSearchTerm = (term: string) => {
    return term.replace(/[^a-zA-Z0-9 ]/g, "");
  };

  const handleSearch = (searchTerm: string) => {
    const cleanedTerm = cleanSearchTerm(searchTerm);
    if (cleanedTerm) {
      router.push(`/dashboard/${cleanedTerm}`);
    }
  };

  useEffect(() => {
    console.log("Fetching data from /api/professors...");
    async function fetchData() {
      const response = await fetch("/api/professors");
      const data = await response.json();
      console.log("Data fetched:", data);
      setProfessors(data);
    }

    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    if (profName) {
      const filtered = professors.filter((professor) =>
        professor.Name.toLowerCase().includes(profName.toLowerCase())
      );
      setName(filtered);
    } else {
      setName(professors);
    }
  }, [profName, professors]);
  return (
    <div className="max-w-2xl">
      <form>
        <label
          htmlFor="search"
          className="input input-bordered flex items-center gap-2 rounded-3xl bg-black bg-opacity-40 h-10 sm:h-12 lg:h-14"
        >
          <input
            placeholder="Search by Professor Name"
            className="grow text-gray-200 placeholder:text-gray-200 placeholder:font-normal text-sm sm:text-base min-w-fit"
            onChange={(e) => {
              searchProfName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(profName); // Handle Enter key
            }}
          />
          <Image
            src="/MagnifyingGlass.svg"
            alt="Magnifying glass"
            width={20}
            height={20}
            className="h-1/2 opacity-70"
          />
        </label>
      </form>
      {profName && (
        <ul className="mt-2 bg-black bg-opacity-40 border border-black rounded-lg shadow-lg max-h-60 overflow-y-auto z-10 max-w-2xl">
          {findName.map((professor, index) => (
            <li
              key={index}
              className="text-white p-2 hover:bg-black hover:bg-opacity-45 cursor-pointer"
              onClick={() => handleSearch(professor.Name)}
            >
              {professor.Name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
