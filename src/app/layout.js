import "./globals.css";

import ClientLayout from "@/client-layout";

import { ViewTransitions } from "next-view-transitions";

export const metadata = {
  title: "Luca Di Gregorio",
  description: "A curated marketplace for digital design assets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ViewTransitions>
          <ClientLayout>{children}</ClientLayout>
        </ViewTransitions>
      </body>
    </html>
  );
}
