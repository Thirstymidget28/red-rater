"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import TestimonialCard from "./TestimonialCard";

interface ReviewSectionProps {
  courses: string[];
  professorName: string;
}

interface Review {
  id: number;
  userName: string;
  course: string;
  date: string;
  professorRating: number;
  courseRating: number;
  reviewContent: string;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  courses,
  professorName,
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ fname: string; lname: string } | null>(
    null
  );
  const [professorRating, setProfessorRating] = useState(25);
  const [courseRating, setCourseRating] = useState(25);
  const [reviewContent, setReviewContent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filter, setFilter] = useState<string>("Date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const checkLoginStatus = async () => {
    try {
      const response = await fetch("/api/auth/user");
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Failed to check login status:", error);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/reviews/${encodeURIComponent(professorName)}`
      );
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error("Failed to fetch reviews");
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, [professorName]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleNewPostClick = () => {
    if (!isLoggedIn) {
      alert("You must be logged in to create a new post.");
      return;
    }

    const modal = document.getElementById("review_modal");
    if (modal) {
      (modal as HTMLDialogElement).showModal();
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const reviewData = {
      userName: `${user?.lname}, ${user?.fname}`,
      course: selectedCourse,
      date: formatDate(new Date()), // Format the date to YYYY-MM-DD
      professorRating,
      courseRating,
      reviewContent,
      professorName,
    };

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        alert("Review submitted successfully");
        // Optionally, close the modal and reset the form
        const modal = document.getElementById("review_modal");
        if (modal) {
          (modal as HTMLDialogElement).close();
        }
        setSelectedCourse("");
        setProfessorRating(25);
        setCourseRating(25);
        setReviewContent("");

        // Fetch the updated reviews
        fetchReviews();
      } else {
        alert("Failed to submit review");
      }
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Failed to submit review");
    }
  };

  const handleFilterChange = (newFilter: string) => {
    if (filter === newFilter) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setFilter(newFilter);
      setSortOrder("desc");
    }
  };

  const sortedReviews = [...reviews].sort((a, b) => {
    let comparison = 0;
    if (filter === "Date") {
      comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (filter === "Course Rating") {
      comparison = b.courseRating - a.courseRating;
    } else if (filter === "Professor Rating") {
      comparison = b.professorRating - a.professorRating;
    }
    return sortOrder === "asc" ? -comparison : comparison;
  });

  return (
    <div className="bg-slate-50">
      <div className="w-full px-2 mx-auto lg:w-4/5 2xl:w-3/5">
        <div className="testimonial-buttons w-full ml-auto flex justify-between py-5">
          <dialog
            id="review_modal"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box relative">
              <div className="banner border-b-4 border-solid border-black flex p-2">
                <h2 className="font-bold text-6xl p-4 me-auto">Red Rater</h2>
                <Image
                  src="/DoubleT_BlkWht.png"
                  alt="Black and white Texas Tech Double T"
                  width={100}
                  height={100}
                  style={{ width: "20%", height: "20%" }}
                />
              </div>
              <div className="modal-action flex flex-col w-full">
                <form className="w-full" onSubmit={handleSubmit}>
                  <div>
                    <div className="pb-2">
                      <h4>
                        Select the course to review.{" "}
                        <span className="text-red-600">*</span>
                      </h4>
                      <select
                        className="select select-bordered max-w-xs font-bold"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        required
                      >
                        <option value="" disabled>
                          Course List
                        </option>
                        {courses.map((course) => (
                          <option
                            key={course}
                            value={course}
                          >{`CS ${course}`}</option>
                        ))}
                      </select>
                    </div>
                    <div className="pb-2">
                      <h4>
                        What is your overall rating of the professor?{" "}
                        <span className="text-red-600">*</span>
                      </h4>
                      <p className="italic text-gray-400">
                        Click and drag to set your rating.
                      </p>
                      <input
                        type="range"
                        min={0}
                        max="100"
                        value={professorRating}
                        onChange={(e) =>
                          setProfessorRating(Number(e.target.value))
                        }
                        className="range [--range-shdw:red]"
                        required
                      />
                      <div className="flex w-full justify-between px-2 text-xs">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="pb-2">
                      <h4>
                        What is your overall rating of the course?{" "}
                        <span className="text-red-600">*</span>
                      </h4>
                      <p className="italic text-gray-400">
                        Click and drag to set your rating.
                      </p>
                      <input
                        type="range"
                        min={0}
                        max="100"
                        value={courseRating}
                        onChange={(e) =>
                          setCourseRating(Number(e.target.value))
                        }
                        className="range [--range-shdw:red]"
                        required
                      />
                      <div className="flex w-full justify-between px-2 text-xs">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                    <div className="pb-2">
                      <h4>
                        Write your review here{" "}
                        <span className="text-red-600">*</span>
                      </h4>
                      <textarea
                        placeholder="Type here"
                        className="textarea textarea-bordered w-full h-40 my-2"
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        required
                      ></textarea>
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="btn bg-ttu-red text-white w-1/2"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <form method="dialog" className="modal-backdrop">
              <button>close</button>
            </form>
          </dialog>
          <button
            className="btn btn-outline place-self-center border-2"
            onClick={handleNewPostClick}
          >
            New Post
            <Image src="/plus.svg" alt="Plus symbol" width={20} height={20} />
          </button>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline place-self-center border-2 m-1"
            >
              Filter
              <Image
                src="/filter.svg"
                alt="Filter symbol"
                width={20}
                height={20}
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a
                  className={`${
                    filter === "Date" ? "bg-gray-200" : ""
                  } hover:bg-gray-300`}
                  onClick={() => handleFilterChange("Date")}
                >
                  Date
                  {filter === "Date" && (
                    <Image
                      className="ml-auto"
                      src={
                        sortOrder === "asc"
                          ? "/caret-up.svg"
                          : "/caret-down.svg"
                      }
                      alt={sortOrder === "asc" ? "Ascending" : "Descending"}
                      width={20}
                      height={20}
                    />
                  )}
                </a>
              </li>
              <li>
                <a
                  className={`${
                    filter === "Course Rating" ? "bg-gray-200" : ""
                  } hover:bg-gray-300`}
                  onClick={() => handleFilterChange("Course Rating")}
                >
                  Course Rating
                  {filter === "Course Rating" && (
                    <Image
                      className="ml-auto"
                      src={
                        sortOrder === "asc"
                          ? "/caret-up.svg"
                          : "/caret-down.svg"
                      }
                      alt={sortOrder === "asc" ? "Ascending" : "Descending"}
                      width={20}
                      height={20}
                    />
                  )}
                </a>
              </li>
              <li>
                <a
                  className={`${
                    filter === "Professor Rating" ? "bg-gray-200" : ""
                  } hover:bg-gray-300`}
                  onClick={() => handleFilterChange("Professor Rating")}
                >
                  Professor Rating
                  {filter === "Professor Rating" && (
                    <Image
                      className="ml-auto"
                      src={
                        sortOrder === "asc"
                          ? "/caret-up.svg"
                          : "/caret-down.svg"
                      }
                      alt={sortOrder === "asc" ? "Ascending" : "Descending"}
                      width={20}
                      height={20}
                    />
                  )}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div>
        {sortedReviews.map((review) => (
          <TestimonialCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
};

export default ReviewSection;
