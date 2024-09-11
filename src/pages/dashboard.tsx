import React from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import Layout from "~/components/Layout";
import DocumentUpload from "~/components/DocumentUpload"; // Import the DocumentUpload component
import { api } from "~/utils/api";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const documents = api.document.getAll.useQuery();
  const utils = api.useContext();

  const handleViewDocument = (id: string) => {
    router.push(`/documents/${id}`);
  };

  const handleUploadSuccess = () => {
    // Refetch the documents list after a successful upload
    void utils.document.getAll.invalidate();
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    void router.push("/signin");
    return null;
  }

  return (
    <Layout>
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>

      {/* DocumentUpload Component */}
      <div className="mb-8">
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
      </div>

      {/* Documents Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.data?.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.uploadedAt.toLocaleDateString()}</TableCell>
                  <TableCell>
                    {doc.simplifications.length > 0 ? "Simplified" : "Original"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(doc.id)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default Dashboard;