import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import Layout from '~/components/Layout';
import { api } from '~/utils/api';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DocumentView = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { id } = router.query;
  const [isAnalyzeDialogOpen, setIsAnalyzeDialogOpen] = useState(false);

  const { data: document, isLoading } = api.document.getById.useQuery(id as string, {
    enabled: !!id,
  });

  const { data: subscription } = api.subscription.getUserSubscription.useQuery();

  const { data: documentIds } = api.document.getAllIds.useQuery();

  if (status === "loading" || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    void router.push("/signin");
    return null;
  }

  if (!document) {
    return <div>Document not found</div>;
  }

  const currentIndex = documentIds?.findIndex(docId => docId === id) ?? -1;
  const prevDocumentId = currentIndex > 0 ? documentIds?.[currentIndex - 1] : null;
  const nextDocumentId = currentIndex < (documentIds?.length ?? 0) - 1 ? documentIds?.[currentIndex + 1] : null;

  const handleAnalyze = () => {
    setIsAnalyzeDialogOpen(true);
  };

  const confirmAnalyze = () => {
    // Implement the analysis logic here
    console.log('Analyzing document...');
    setIsAnalyzeDialogOpen(false);
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <div>
          {prevDocumentId && (
            <Button variant="outline" className="mr-2" onClick={() => router.push(`/documents/${prevDocumentId}`)}>
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
          )}
          {nextDocumentId && (
            <Button variant="outline" onClick={() => router.push(`/documents/${nextDocumentId}`)}>
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{document.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap">{document.content}</p>
        </CardContent>
      </Card>

      <div className="mt-4">
        <Button onClick={handleAnalyze}>Analyze Document</Button>
      </div>

      <AlertDialog open={isAnalyzeDialogOpen} onOpenChange={setIsAnalyzeDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Analyze Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to analyze this document? You have {subscription?.usesLeft ?? 0} analyses left for this billing period.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAnalyze}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default DocumentView;