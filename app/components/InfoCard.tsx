"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import LineGraph from "./LineGraph";

interface InfoCardProps {
  searchTerm: string;
  profile: Profile;
}

interface Profile {
  name: string;
  subjectName: string;
  terms: string[];
  courses: string[];
  entries: number;
  avgResponse1: number;
  avgResponse2: number;
  avgResponse3: number;
  overallRating: number;
}

interface ProfessorData {
  Name: string;
  SubjectName: string;
  Term: string;
  CourseNum: number;
  Entries: string;
  AvgResponse1: string;
  AvgResponse2: string;
  AvgResponse3: string;
  OverallRating: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ searchTerm, profile }) => {
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [filteredTerms, setFilteredTerms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [data, setData] = useState<ProfessorData[]>([]);
  const [overallRating, setOverallRating] = useState<number>(0);
  const [profOverallRating, setProfOverallRating] = useState<number>(0);
  const [lineGraphData, setLineGraphData] = useState<
    { term: string; rating: number }[]
  >([]);
  const [avgResponse1, setAvgResponse1] = useState<number>(0);
  const [avgResponse2, setAvgResponse2] = useState<number>(0);
  const [avgResponse3, setAvgResponse3] = useState<number>(0);

  const profileRef = useRef<Profile | null>(profile);

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/professors/${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data: ProfessorData[] = await response.json();

      const parsedData = data.map((item) => ({
        ...item,
        CourseNum: parseInt(item.CourseNum.toString(), 10),
      }));
      setData(parsedData);

      if (parsedData && parsedData.length > 0) {
        console.log("Fetched data:", parsedData);
      } else {
        console.log("No data found");
      }

      const transformedProfile: Profile = {
        name: parsedData[0].Name,
        subjectName: parsedData[0].SubjectName,
        terms: Array.from(new Set(parsedData.map((item) => item.Term))),
        courses: Array.from(new Set(parsedData.map((item) => item.CourseNum.toString()))),
        entries: parsedData.reduce(
          (acc, item) => acc + parseInt(item.Entries, 10),
          0
        ),
        avgResponse1: parseFloat(parsedData[0].AvgResponse1),
        avgResponse2: parseFloat(parsedData[0].AvgResponse2),
        avgResponse3: parseFloat(parsedData[0].AvgResponse3),
        overallRating: Math.round(
          (parseFloat(parsedData[0].OverallRating) / 5) * 100
        ),
      };
      const totalRating = parsedData.reduce(
        (sum: number, item) => sum + parseFloat(item.OverallRating),
        0
      );
      const averageRating = totalRating / parsedData.length;
      setProfOverallRating(Math.round((averageRating / 5) * 100));

      console.log("Transformed profile:", transformedProfile);
      profileRef.current = transformedProfile;
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchProfile();
  }, [searchTerm, fetchProfile]);

  const animateOverallRating = useCallback((newRating: number) => {
    const duration = 1000; // Duration of the animation in milliseconds
    const start = overallRating;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      const interpolatedRating = start + (newRating - start) * progress;
      setOverallRating(interpolatedRating);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [overallRating]);

  useEffect(() => {
    if (selectedCourse) {
      const terms = Array.from(
        new Set(
          data
            .filter((item) => item.CourseNum === parseInt(selectedCourse))
            .map((item) => item.Term)
        )
      );
      setFilteredTerms(terms);

      const graphData = data
        .filter((item) => item.CourseNum === parseInt(selectedCourse))
        .map((item) => ({
          term: item.Term,
          rating: Math.round((parseFloat(item.OverallRating) / 5) * 100),
        }));
      setLineGraphData(graphData);

      if (terms.length > 0) {
        setSelectedTerm(terms[0]);
      }
    } else {
      setFilteredTerms([]);
      setLineGraphData([]);
      setSelectedTerm(null);
    }
  }, [selectedCourse, data]);

  useEffect(() => {
    if (selectedCourse && selectedTerm) {
      const selectedData = data.find(
        (item) =>
          item.CourseNum === parseInt(selectedCourse) &&
          item.Term === selectedTerm
      );
      if (selectedData) {
        const newOverallRating = Math.round(
          (parseFloat(selectedData.OverallRating) / 5) * 100
        );
        animateOverallRating(newOverallRating);
        setAvgResponse1(parseFloat(selectedData.AvgResponse1));
        setAvgResponse2(parseFloat(selectedData.AvgResponse2));
        setAvgResponse3(parseFloat(selectedData.AvgResponse3));
      }
    }
  }, [selectedCourse, selectedTerm, data, animateOverallRating]);

  const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCourse(e.target.value);
    setSelectedTerm(null);
    animateOverallRating(0);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const term = e.target.value;
    setSelectedTerm(term);
    if (!term) {
      animateOverallRating(0);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-96 p-5 lg:p-10 2xl:px-32 overflow-hidden text-white text-bold">
        <span className="loading loading-spinner loading-md mx-2"></span>
        <div className="text-xl align-middle">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="flex w-full p-5 lg:p-10 2xl:px-32 overflow-hidden">
      <div className="w-1/2">
        <div className="flex flex-col">
          <div className="bg-white rounded-md shadow-md shadow-black text-center w-full md:w-1/2 lg:w-fit pt-4 pb-1 px-5 overflow-hidden">
            <h1 className="text-slate-900 text-3xl align-middle lg:text-5xl font-helvetica uppercase font-bolder max-w-5xl">
              {profile.name}
            </h1>
          </div>
          <div className="bg-white rounded-md shadow-md shadow-black text-center w-fit mt-4 pt-2 px-5 overflow-hidden">
            <h2 className="text-4xl text-helvetica font-bold max-w-3xl pt-1 mb-4">
              {profile.subjectName}
            </h2>
          </div>
        </div>
        <div className="flex flex-col overflow-hidden p-4">
          <div className="flex flex-col w-full">
            <div className="bg-gray-800 h-fit w-fit rounded-md shadow-md shadow-black mt-2 p-3 2xl:p-5">
              <h2 className="text-slate-50 text-2xl font-helvetica font-bold uppercase">
                Smart Eval Questions
              </h2>
            </div>
            <div className="flex flex-col bg-ttu-dark-red justify-center items-center rounded-md shadow-md shadow-black my-6 w-full sm:w-auto md:mb-5 p-4">
              <p className="flex items-center justify-center w-10/12 h-fit text-lg 2xl:text-2xl bg-white rounded-md px-2 font-bold shadow-lg my-2">
                The course objectives were specified and followed by the
                instructor.
                <span className="ml-4">{avgResponse1}</span>
              </p>
              <p className="flex items-center justify-center w-10/12 h-fit text-lg 2xl:text-2xl bg-white rounded-md px-2 font-bold shadow-lg my-2">
                Overall, the instructor was an effective teacher.
                <span className="ml-4">{avgResponse2}</span>
              </p>
              <p className="flex items-center justify-center w-10/12 h-fit text-lg 2xl:text-2xl bg-white rounded-md px-2 font-bold shadow-lg my-2">
                Overall, this course was a valuable learning experience.
                <span className="ml-4">{avgResponse3}</span>
              </p>
            </div>
            <div className="bg-gray-800 shadow-md shadow-black rounded-md h-fit w-fit my-5 p-3 2xl:p-5">
              <h2 className="text-slate-50 text-2xl font-helvetica font-bold uppercase">
                Ratings over Semesters
              </h2>
            </div>
            <div className="w-full h-full bg-ttu-dark-red rounded-md py-4 px-2 shadow-md shadow-black">
              <LineGraph data={lineGraphData} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full flex flex-col">
        <div className="w-full ml-auto flex justify-between items-center h-20">
          <select
            className="select bg-slate-50 select-bordered border-2 border-black focus:border-black focus:outline-none w-1/2 max-w-40 font-bold mr-1"
            defaultValue=""
            onChange={handleCourseChange}
          >
            <option value="" disabled>
              Course List
            </option>
            {profile.courses.map((course: string) => (
              <option key={course} value={course}>{`CS ${course}`}</option>
            ))}
          </select>
          <select
            className="select bg-slate-50 select-bordered border-2 border-black focus:border-black focus:outline-none w-1/2 max-w-40 font-bold ml-1"
            value={selectedTerm || ""}
            onChange={handleTermChange}
            disabled={!selectedCourse}
          >
            <option value="" disabled>
              Term
            </option>
            {filteredTerms.map((term) => (
              <option key={term} value={term}>
                {term}
              </option>
            ))}
          </select>
        </div>
        <div className="w-full flex flex-col justify-center items-center pb-5 px-1">
          <div className="bg-gray-800 shadow-md shadow-black rounded-md h-fit w-fit p-3 mb-3 mt-10 2xl:p-5 items-center">
            <h3 className="font-helvetica text-center text-slate-100 text-3xl 2xl:text-4xl font-bold">
              Course Rating
            </h3>
          </div>
          <div className="self-center">
            <div
              className="radial-progress bg-white text-ttu-gold border-4 [--size:12rem] sm:[--size:16rem] lg:[--size:12rem] 2xl:[--size:18rem] border-black shadow-lg shadow-black"
              style={
                {
                  "--value": overallRating,
                  "--thickness": "1.5rem",
                } as React.CSSProperties
              }
              role="progressbar"
            >
              <span className="text-black text-4xl font-semibold ">
                {Math.round(overallRating)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex-grow"></div> {/* This div will take up the remaining space */}
        <div className="w-full flex flex-col justify-center items-center pb-10 px-1">
          <div className="bg-gray-800 shadow-md shadow-black rounded-md h-fit w-fit p-3 mb-3 2xl:p-5">
            <h3 className="font-helvetica text-center text-slate-100 text-3xl 2xl:text-4xl font-bold">
              Professor Rating
            </h3>
          </div>
          <div className="self-center">
            <div
              className="radial-progress bg-white text-ttu-dark-red border-4 [--size:12rem] sm:[--size:16rem] lg:[--size:12rem] 2xl:[--size:18rem] border-black shadow-lg shadow-black"
              style={
                {
                  "--value": profOverallRating,
                  "--thickness": "1.5rem",
                } as React.CSSProperties
              }
              role="progressbar"
            >
              <span className="text-black text-4xl font-semibold">
                {Math.round(profOverallRating)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
