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
    const host = process.env.HOST || "red-rater.vercel.app";
    const protocol = process.env.PROTOCOL || "https";
    headers.set("host", host);
    headers.set("x-forwarded-proto", protocol);
  }

  const initialUser = await fetchInitialUser(headers);

  return (
    <html lang="en">
      <body>
        <Navbar initialUser={initialUser} />
        <Botpress />
        {children}
      </body>
    </html>
  );
}
