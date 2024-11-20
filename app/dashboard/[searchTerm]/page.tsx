import { notFound } from "next/navigation";
import InfoCard from "./../../components/InfoCard";
import Image from "next/image";
import ReviewSection from "./../../components/ReviewSection";

interface DashboardProps {
  params: { searchTerm: string };
  searchParams: { baseURL: string };
}

const Dashboard = async ({ params, searchParams }: DashboardProps) => {
  const { searchTerm } = await params;
  const { baseURL } = await searchParams;

  // Fetch HTTP response from '/api/professors'
  const response = await fetch(
    `${baseURL}/api/professors/${encodeURIComponent(searchTerm)}`
  );

  if (!response.ok) {
    // Confirm successful HTTP response
    notFound();
  }
  const data = await response.json();

  if (!data || data.length === 0) {
    // Confirm data was retrieved from DB
    notFound();
  }

  // Transform the data to match the Profile interface
  const transformedProfile = {
    name: data[0].Name,
    subjectName: data[0].SubjectName,
    terms: Array.from(new Set(data.map((item: any) => item.Term))),
    courses: Array.from(
      new Set(data.map((item: any) => item.CourseNum))
    ) as string[],
    entries: data.reduce(
      (acc: number, item: any) => acc + parseInt(item.Entries, 10),
      0
    ),
    avgResponse1: parseFloat(data[0].AvgResponse1),
    avgResponse2: parseFloat(data[0].AvgResponse2),
    avgResponse3: parseFloat(data[0].AvgResponse3),
    overallRating: Math.round((parseFloat(data[0].OverallRating) / 5) * 100),
  };

  return (
    <main className="h-screen overflow-x-hidden bg-slate-50">
      <div className="bg-hero bg-cover bg-center pt-20 overflow-x-hidden">
        <section className="info-section bg-ttu-red h-fit w-full lg:w-3/4 lg:rounded-tl-lg lg:rounded-tr-lg flex justify-center mx-auto lg:mt-10">
          <InfoCard searchTerm={searchTerm} profile={transformedProfile} />
        </section>
      </div>
      <section className="testimonial-section h-fit flex flex-col justify-center mx-auto">
        <div className="flex h-fit flex-col items-center justify-center bg-ttu-red font-bold">
          <div className="lineart-element flex w-full">
            <Image
              src="/TTU_Horizontal_Lineart_black.png"
              alt="TTU line art decal."
              width={1000}
              height={100}
              style={{ width: "50%", height: "100%" }}
            />
            <Image
              src="/TTU_Horizontal_Lineart_black.png"
              alt="TTU line art decal."
              width={1000}
              height={100}
              style={{ width: "50%", height: "100%" }}
            />
          </div>
          <div className="bg-ttu-red w-fit h-fit m-8">
            <h2 className="text-center font-helvetica font-normal text-4xl lg:text-4xl uppercase text-white lg:px-5">
              Student Reviews
            </h2>
          </div>
        </div>
        <ReviewSection
          courses={transformedProfile.courses}
          professorName={transformedProfile.name}
        />
      </section>
    </main>
  );
};

export default Dashboard;
