
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    if (acceptedFiles.length === 0) {
      return;
    }
    
    const selectedFile = acceptedFiles[0];
    
    // Check if file is a CSV
    if (!selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      toast.error('Invalid file type. Please upload a CSV file.');
      return;
    }
    
    setFile(selectedFile);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          // Simulate processing time once upload is done
          setTimeout(() => {
            setUploading(false);
            toast.success('File processed successfully!');
            navigate('/results');
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleCancel = () => {
    setFile(null);
    setProgress(0);
    setError(null);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-expense-blue bg-blue-50' : 'border-gray-300 hover:border-expense-blue'
        } ${file ? 'bg-blue-50' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-4 text-sm text-gray-600">
          {isDragActive
            ? "Drop the CSV file here..."
            : file
            ? `Selected: ${file.name}`
            : "Drag & drop a CSV file here, or click to select"}
        </p>
        <p className="mt-2 text-xs text-gray-500">
          Supports CSV files only
        </p>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && (
        <div className="mt-4 space-y-4">
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex space-x-3">
            <Button 
              onClick={handleUpload} 
              className="w-full" 
              disabled={uploading}
            >
              {uploading ? 'Processing...' : 'Upload & Process'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel} 
              className="w-1/3" 
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
