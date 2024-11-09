"use client"
import React from 'react';
import { Upload, FileText, Loader2, Clock, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UploadCardProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  isAnalyzing: boolean;
  uploadedFileName: string | null;
  currentDocumentName: string | null;
  uploadProgress: number;
  cancelUpload: () => void;
}

export const UploadCard: React.FC<UploadCardProps> = ({
  handleFileUpload,
  isAnalyzing,
  uploadedFileName,
  currentDocumentName,
  uploadProgress,
  cancelUpload,
}) => {
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="text-xl">Upload Document</CardTitle>
        <CardDescription>Support for VTT and DOCX files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
          <Input
            id="file"
            type="file"
            accept=".vtt,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Label 
            htmlFor="file" 
            className="cursor-pointer space-y-2 flex flex-col items-center"
          >
            <Upload className="h-8 w-8 text-muted-foreground" />
            <span className="font-medium">Drop files or click to upload</span>
            <span className="text-sm text-muted-foreground">
              VTT or DOCX up to 10MB
            </span>
          </Label>
        </div>

        {(isAnalyzing || uploadedFileName) && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Processing Files</p>
            <div className="bg-secondary rounded-lg p-3">
              <div className="flex items-center gap-3">
                {isAnalyzing ? (
                  <div className="h-8 w-8 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </div>
                ) : (
                  <FileText className="h-5 w-5 text-primary" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={currentDocumentName || ''}>
                    {currentDocumentName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isAnalyzing ? (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Analyzing document...
                      </span>
                    ) : (
                      'Processed'
                    )}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={cancelUpload}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {isAnalyzing && (
                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-1.5 bg-secondary-foreground/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};