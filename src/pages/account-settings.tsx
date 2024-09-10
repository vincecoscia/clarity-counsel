import React from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import Layout from '~/components/Layout';  // Adjust the import path as necessary
import { api } from "~/utils/api";

const AccountSettings: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Mock subscription data - replace with actual data fetching
  const subscriptionData = {
    plan: 'PRO',
    startDate: '2023-01-01',
    nextBillingDate: '2024-01-01',
  };

  const handleUpgrade = () => {
    // Implement upgrade logic
    console.log('Upgrading subscription');
  };

  const handleCancel = () => {
    // Implement cancellation logic
    console.log('Cancelling subscription');
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/signin');
    return null;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>Manage your current subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Current Plan:</strong> {subscriptionData.plan}</p>
          <p><strong>Start Date:</strong> {subscriptionData.startDate}</p>
          <p><strong>Next Billing Date:</strong> {subscriptionData.nextBillingDate}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleUpgrade}>Upgrade Plan</Button>
          <Button variant="destructive" onClick={handleCancel}>Cancel Subscription</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <p><strong>Name:</strong> {session?.user?.name}</p>
          <p><strong>Email:</strong> {session?.user?.email}</p>
        </CardContent>
        <CardFooter>
          <Button>Update Information</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default AccountSettings;