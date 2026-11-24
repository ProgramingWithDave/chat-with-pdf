"use client";

import { ReactNode, useEffect } from "react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";



const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);



const publishableKey = process.env.NEXT_PUBLIC_SCHEMATIC_KEY;

if(!publishableKey) {
  throw new Error("NEXT_PUBLIC_SCHEMATIC_KEY is not set.")
}

export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
     

          {children}
      
    </ConvexProviderWithClerk>
  );
}
