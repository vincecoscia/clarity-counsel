import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import { Check, X } from 'lucide-react';
import { api } from "~/utils/api";

type PlanType = 'FREE' | 'BASIC' | 'PRO';

type Feature = {
  name: string;
  included: boolean;
};

type PlanDetails = {
  price: string;
  features: Feature[];
};

type PlanFeatures = {
  [key in PlanType]: PlanDetails;
};

const planFeatures: PlanFeatures = {
  FREE: {
    price: '$0',
    features: [
      { name: '2 document uploads per month', included: true },
      { name: 'Basic simplification', included: true },
      { name: '50MB storage', included: true },
      { name: 'Full simplification', included: false },
      { name: 'Summary generation', included: false },
      { name: 'Interactive term explanations', included: false },
    ],
  },
  BASIC: {
    price: '$9.99',
    features: [
      { name: '10 document uploads per month', included: true },
      { name: 'Full simplification', included: true },
      { name: 'Basic summary generation', included: true },
      { name: '1GB storage', included: true },
      { name: 'Interactive term explanations', included: false },
    ],
  },
  PRO: {
    price: '$19.99',
    features: [
      { name: 'Unlimited document uploads', included: true },
      { name: 'Advanced simplification', included: true },
      { name: 'Detailed summary generation', included: true },
      { name: '10GB storage', included: true },
      { name: 'Interactive term explanations', included: true },
    ],
  },
};

type PlanCardProps = {
  plan: PlanType;
  isSelected: boolean;
  onSelect: (plan: PlanType) => void;
};

const PlanCard: React.FC<PlanCardProps> = ({ plan, isSelected, onSelect }) => (
  <Card className={`w-full flex flex-col ${isSelected ? 'border-primary' : ''}`}>
    <CardHeader>
      <CardTitle>{plan} Plan</CardTitle>
      <CardDescription>{planFeatures[plan].price}/month</CardDescription>
    </CardHeader>
    <CardContent className='flex-grow'>
      <ul className="space-y-2 ">
        {planFeatures[plan].features.map((feature, index) => (
          <li key={index} className="flex items-center">
            {feature.included ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <X className="mr-2 h-4 w-4 text-red-500" />
            )}
            <span className={feature.included ? '' : 'text-gray-500'}>{feature.name}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button onClick={() => onSelect(plan)} variant={isSelected ? 'default' : 'outline'} className="w-full">
        {isSelected ? 'Selected' : 'Select Plan'}
      </Button>
    </CardFooter>
  </Card>
);

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const selectPlanMutation = api.subscription.selectPlan.useMutation();

  const handleSignIn = async (provider: 'google' | 'email') => {
    if (provider === 'google') {
      await signIn('google');
    } else {
      await signIn('email', { email });
    }
  };

  const handlePlanSelection = async () => {
    if (!selectedPlan) return;
  
    const result = await selectPlanMutation.mutateAsync(selectedPlan);
  
    if (selectedPlan === 'FREE') {
      await router.push('/dashboard');
    } else if ('checkoutUrl' in result && result.checkoutUrl) {
      // Ensure checkoutUrl is not undefined
      window.location.href = result.checkoutUrl;
    } else {
      // Handle the case where checkoutUrl is unexpectedly missing
      console.error('Checkout URL is missing');
      // Optionally, show an error message to the user
    }
  };

  if (session) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Select a Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['FREE', 'BASIC', 'PRO'] as const).map((plan) => (
            <PlanCard
              key={plan}
              plan={plan}
              isSelected={selectedPlan === plan}
              onSelect={setSelectedPlan}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button onClick={handlePlanSelection} disabled={!selectedPlan} className="w-full md:w-auto">
            Continue with {selectedPlan || 'selected'} Plan
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className="w-[350px] mx-auto mt-10">
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Choose your preferred sign-up method</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button onClick={() => handleSignIn('google')} variant="outline" className="w-full">
          Sign in with Google
        </Button>
        <Separator />
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleSignIn('email')} className="w-full">Sign in with Email</Button>
      </CardFooter>
    </Card>
  );
};

export default SignUp;