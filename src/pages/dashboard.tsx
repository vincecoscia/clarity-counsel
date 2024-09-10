import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { Upload } from 'lucide-react';
import Layout from '~/components/Layout';  // Adjust the import path as necessary
import { api } from "~/utils/api";

const Dashboard: React.FC = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  // Mock data for documents - replace with actual data fetching
  const documents = [
    { id: 1, name: 'Contract.pdf', uploadDate: '2023-05-15', status: 'Simplified' },
    { id: 2, name: 'Agreement.docx', uploadDate: '2023-05-14', status: 'Original' },
    { id: 3, name: 'Terms.pdf', uploadDate: '2023-05-13', status: 'Simplified' },
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Implement file upload logic here
      console.log('Uploading file:', file.name);
      // Simulating upload delay
      setTimeout(() => setIsUploading(false), 2000);
    }
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
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Upload Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Upload New Document</CardTitle>
          <CardDescription>Upload a document to simplify</CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="file-upload" className="cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500">PDF, DOCX, TXT (max. 10MB)</p>
            </div>
            <Input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
          </Label>
        </CardContent>
        <CardFooter>
          <Button disabled={isUploading} className="w-full">
            {isUploading ? 'Uploading...' : 'Upload Document'}
          </Button>
        </CardFooter>
      </Card>

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
              {documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.uploadDate}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">View</Button>
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