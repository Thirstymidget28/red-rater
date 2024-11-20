import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/Navbar";
import Botpress from "./components/Botpress";

export const metadata: Metadata = {
  title: "Red Rater",
  description: "Red Rater Professor Evaluation Tool",
  icons: {
    icon: "/DoubleT.png",
  },
};

// Fetch user data before page render
async function fetchInitialUser(headers: Headers) {
  let initialUser = null;
  // Build absolute URL
  const host = headers.get("host");
  const protocol = headers.get("x-forwarded-proto") || "http";
  const baseUrl = `${protocol}://${host}`;

  try {
    const response = await fetch(`${baseUrl}/api/auth/user`, {
      credentials: "include",
      headers: {
        cookie: headers.get("cookie") || "",
      },
    });
    if (response.ok) {
      initialUser = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch user:", error);
  }
  return initialUser;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headers = new Headers();
  if (typeof window === "undefined") {
    // Check if application is running locally
    headers.set("host", process.env.HOST || "localhost:3000");
    headers.set("x-forwarded-proto", process.env.PROTOCOL || "http");
  }

  const initialUser = await fetchInitialUser(headers);

  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <Navbar initialUser={initialUser} />
        {/* <AITool /> */}
        <Botpress />
        {children}
      </body>
    </html>
  );
}
