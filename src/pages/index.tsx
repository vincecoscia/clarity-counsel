import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { cn } from "~/lib/utils";
import Navigation from "~/components/Navigation";

import { api } from "~/utils/api";

export default function Home() {

  return (
    <>
      <Head>
        <title>Clarity Counsel</title>
        <meta
          name="description"
          content="Clarity Counsel is an AI-powered legal document reader that simplifies legal jargon for individuals, students, and businesses."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen bg-background px-4 lg:px-0">
        <header className="container mx-auto py-4">
          <Navigation />
        </header>

        <main className="container mx-auto py-16">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold">
              Welcome to ClarityCounsel
            </h1>
            <p className="mb-8 text-xl">
              Simplify your legal documents with AI
            </p>
            <Link href="/signup" passHref legacyBehavior>
            <Button size="lg">Get Started</Button>
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Upload</CardTitle>
                <CardDescription>
                  Upload your legal documents securely
                </CardDescription>
              </CardHeader>
              <CardContent>
                Easily upload various types of legal documents to our secure
                platform.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Simplify</CardTitle>
                <CardDescription>
                  AI-powered document simplification
                </CardDescription>
              </CardHeader>
              <CardContent>
                Our advanced AI technology simplifies complex legal language
                into easy-to-understand terms.
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Understand</CardTitle>
                <CardDescription>
                  Gain clarity on your legal documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                Get clear insights and explanations for your simplified legal
                documents.
              </CardContent>
            </Card>
          </div>
        </main>

        <footer className="container mx-auto py-8 text-center">
          <p>&copy; 2024 ClarityCounsel. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
}

// function AuthShowcase() {
//   const { data: sessionData } = useSession();

//   const { data: secretMessage } = api.post.getSecretMessage.useQuery(
//     undefined, // no input
//     { enabled: sessionData?.user !== undefined }
//   );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// }
