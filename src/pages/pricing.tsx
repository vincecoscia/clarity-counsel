// import React from 'react';
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
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import Navigation from "~/components/Navigation";

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 lg:px-0">
      <header className="container mx-auto py-4">
        <Navigation />
      </header>

      <main className="container mx-auto py-16">
        <h1 className="mb-8 text-center text-4xl font-bold">Pricing Plans</h1>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Free Tier</CardTitle>
              <CardDescription>For occasional use</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold">$0</p>
              <ul className="mt-4 space-y-2">
                <li>2 document uploads per month</li>
                <li>Basic simplification</li>
                <li>50MB storage</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Get Started</Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col border-primary">
            <CardHeader>
              <CardTitle>Basic Tier</CardTitle>
              <CardDescription>For regular users</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold">
                $9.99<span className="text-xl font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                <li>10 document uploads per month</li>
                <li>Full simplification</li>
                <li>Basic summary generation</li>
                <li>1GB storage</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full self-end">Subscribe Now</Button>
            </CardFooter>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Pro Tier</CardTitle>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-3xl font-bold">
                $19.99<span className="text-xl font-normal">/month</span>
              </p>
              <ul className="mt-4 space-y-2">
                <li>Unlimited document uploads</li>
                <li>Advanced simplification</li>
                <li>Detailed summary generation</li>
                <li>10GB storage</li>
                <li>Interactive term explanations</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Subscribe Now</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4 text-2xl font-semibold">Need a custom plan?</h2>
          <p className="mb-4">
            Contact us for enterprise solutions tailored to your organization's
            needs.
          </p>
          <Button variant="outline">Contact Sales</Button>
        </div>
      </main>

      <footer className="container mx-auto py-8 text-center">
        <p>&copy; 2024 ClarityCounsel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PricingPage;
