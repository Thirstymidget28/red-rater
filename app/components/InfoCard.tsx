import React from 'react';
import Image from "next/image";
import LineGraph from './LineGraph';

interface InfoCardProps {
  name: string;
  courses: string[];
  descriptors: string[];
  overallRating: number;
}

const InfoCard: React.FC<InfoCardProps> = ({ name, courses, descriptors, overallRating }) => {
  return (
    <div className="pt-10 pb-5 w-3/4">
      <h1 className="text-6xl font-bold">{name}</h1>
      <div className="flex">
        <div className="flex flex-col w-1/2">
          <div className="flex justify-between">
            <select className="select select-bordered max-w-xs font-bold" defaultValue="Course List">
              <option disabled>Course List</option>
              {courses.map((course, index) => (
                <option key={index}>{course}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 my-4">
            {descriptors.map((descriptor, index) => (
              <div key={index} className="descriptor text-center bg-slate-300 rounded-sm p-2">
                <span>{descriptor}</span>
              </div>
            ))}
          </div>
          <div className="w-full h-full">
            <LineGraph />
          </div>
        </div>
        <div className="data-board flex flex-col w-1/2">
          <h3 className="text-center text-2xl font-bold my-auto">Overall Rating</h3>
          <div className="self-center">
            <div 
              className="radial-progress bg-white text-red-600 border-4 border-black" 
              style={{ "--value": overallRating, "--size": "12rem", "--thickness": "1rem" } as React.CSSProperties} 
              role="progressbar">
                <span className="text-black text-xl">{overallRating}%</span>
            </div>
          </div>
          <Image 
            src="/bubble_example.png"
            alt="example bubbles"
            width={1000}
            height={100}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

export default InfoCard;