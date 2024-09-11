import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Upload, File } from 'lucide-react';
import { api } from "~/utils/api";

interface DocumentUploadProps {
  onUploadSuccess: () => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onUploadSuccess }) => {
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const uploadMutation = api.document.upload.useMutation({
    onSuccess: () => {
      onUploadSuccess();
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const fileContent = await file.arrayBuffer();
      const base64 = btoa(String.fromCharCode(...new Uint8Array(fileContent)));

      const result = await uploadMutation.mutateAsync({
        file: base64,
        title: file.name,
        fileName: file.name,
        mimeType: file.type,
      });

      console.log('File uploaded successfully', result);
    } catch (error) {
      console.error('Upload failed:', error);
      // Handle error (e.g., show error message)
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [uploadMutation, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload New Document</CardTitle>
        <CardDescription>Upload a document to simplify</CardDescription>
      </CardHeader>
      <CardContent>
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            {isDragActive ? (
              <File className="mx-auto h-12 w-12 text-gray-400" />
            ) : (
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <p className="mt-2 text-sm text-gray-600">
              {isDragActive
                ? "Drop the files here"
                : "Drag 'n' drop some files here, or click to select files"}
            </p>
            <p className="text-xs text-gray-500">PDF, DOCX, TXT (max. 10MB)</p>
          </div>
        </div>
        {isUploading && (
          <Progress value={uploadProgress} className="mt-4" />
        )}
      </CardContent>
      <CardFooter>
        <Button disabled={isUploading} className="w-full" onClick={() => document.querySelector('input')?.click()}>
          {isUploading ? 'Uploading...' : 'Select Document'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentUpload;