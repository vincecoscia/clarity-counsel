/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-floating-promises */
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Layout from "~/components/Layout";
import { api } from "~/utils/api";
import { useToast } from "~/hooks/use-toast";


const AccountSettings: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  // Fetch user subscription data
  const { data: subscriptionData, refetch: refetchSubscription } =
    api.subscription.getUserSubscription.useQuery();

  const cancelSubscriptionMutation = api.subscription.cancelSubscription.useMutation({
    onSuccess: () => {
      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been successfully cancelled.",
      });
      refetchSubscription();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleUpgrade = () => {
    // Implement upgrade logic
    console.log("Upgrading subscription");
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel your subscription?")) {
      cancelSubscriptionMutation.mutate();
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    router.push("/signin");
    return null;
  }

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Account Settings</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Subscription</CardTitle>
          <CardDescription>Manage your current subscription</CardDescription>
        </CardHeader>
        {subscriptionData ? (
          <CardContent>
            <p>
              <strong>Current Plan:</strong> {subscriptionData.plan}
            </p>
            <p>
              <strong>Start Date:</strong>{" "}
              {subscriptionData.startDate.toLocaleDateString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
              })}
            </p>
            <p>
              <strong>Next Billing Date:</strong>{" "}
              {subscriptionData.renewalDate
                ? new Date(subscriptionData.renewalDate).toLocaleDateString(
                    "en-US",
                    {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                    }
                  )
                : "N/A"}
            </p>
          </CardContent>
        ) : (
          <CardContent>
            <p>You are not subscribed to any plan</p>
          </CardContent>
        )}
        <CardFooter className="flex justify-between">
          <Button onClick={handleUpgrade} disabled={subscriptionData?.plan === "PRO"}>
            Upgrade Plan
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleCancel}
            disabled={subscriptionData?.plan === "FREE" || cancelSubscriptionMutation.isLoading}
          >
            {cancelSubscriptionMutation.isLoading ? "Cancelling..." : "Cancel Subscription"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Name:</strong> {session?.user?.name}
          </p>
          <p>
            <strong>Email:</strong> {session?.user?.email}
          </p>
        </CardContent>
        <CardFooter>
          <Button>Update Information</Button>
        </CardFooter>
      </Card>
    </Layout>
  );
};

export default AccountSettings;
