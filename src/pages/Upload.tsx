
import FileUpload from "@/components/Analyse";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload as UploadIcon, ClipboardList, BarChart } from "lucide-react";

const Upload = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Your CSV File</h1>
      
      <Card className="shadow-md">
        <CardHeader className="border-b">
          <CardTitle>CSV Upload</CardTitle>
          <CardDescription>
            Upload your bank statement or expense CSV file for automatic categorization
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <FileUpload />
        </CardContent>
      </Card>
      
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="text-gray-700 mb-3">
            <ClipboardList className="h-8 w-8 mx-auto" />
          </div>
          <h3 className="font-medium text-lg text-center">Prepare Your CSV</h3>
          <p className="text-gray-600 text-sm mt-2 text-center">
            Ensure your file has date, description, and amount columns.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="text-gray-700 mb-3">
            <UploadIcon className="h-8 w-8 mx-auto" />
          </div>
          <h3 className="font-medium text-lg text-center">Upload File</h3>
          <p className="text-gray-600 text-sm mt-2 text-center">
            Drag and drop your file or click to browse from your device.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
          <div className="text-gray-700 mb-3">
            <BarChart className="h-8 w-8 mx-auto" />
          </div>
          <h3 className="font-medium text-lg text-center">Get Results</h3>
          <p className="text-gray-600 text-sm mt-2 text-center">
            View categorized expenses and insightful visualizations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Upload;
