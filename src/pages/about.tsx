import React from 'react';
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu"
import Navigation from "~/components/Navigation" 

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background px-4 lg:px-0">
      <header className="container mx-auto py-4">
        <Navigation />
      </header>
      
      <main className="container mx-auto py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg mb-8 text-center lg:text-start">
            ClarityCounsel is on a mission to make legal documents accessible to everyone. We believe that understanding your rights and obligations shouldn't require a law degree.
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p>To create a world where legal language is no longer a barrier to understanding and exercising one's rights.</p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <p>We use cutting-edge AI technology to simplify complex legal documents, making them understandable without losing their original meaning or intent.</p>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Our Team</CardTitle>
            </CardHeader>
            <CardContent>
              <p>ClarityCounsel was founded by a diverse team of legal experts, technologists, and linguists passionate about democratizing access to legal information.</p>
            </CardContent>
          </Card>
          
          <div className="text-center mt-12">
            <h2 className="text-2xl font-semibold mb-4">Ready to experience clear legal language?</h2>
            <Button size="lg">Get Started Now</Button>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto py-8 text-center">
        <p>&copy; 2024 ClarityCounsel. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AboutPage;