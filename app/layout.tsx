import React from 'react';
import '../src/index.css';

export const metadata = {
  title: 'Aura Crown & Cut AI',
  description: 'Biometric cranial and face-shape mapping, realistic hairstyle and wig simulation, and professional salon/barbershop execution briefs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B0B0E] text-[#F8FAFC] antialiased">
        {children}
      </body>
    </html>
  );
}
