import { useState } from "react";
import { Mail, User, FileText, X, Send } from "lucide-react";
import Header from "../components/Header";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
const Report = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    subject: "",
    description: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    // Reset form after submission
    setFormData({
      email: "",
      name: "",
      subject: "",
      description: ""
    });
  };
  const handleCancel = () => {
    // Reset form
    setFormData({
      email: "",
      name: "",
      subject: "",
      description: ""
    });
  };
  return <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <h1 className="text-3xl font-bold mb-12 text-center">Submit Ticket</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="email" className="font-medium text-right">
                Email<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <Input type="email" id="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} required className="w-full pl-4 border-gray-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="name" className="font-medium text-right">
                Name<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <Input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={handleChange} required className="w-full pl-4 border-gray-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] items-center gap-4">
              <label htmlFor="subject" className="font-medium text-right">
                Subject<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <Input type="text" id="subject" name="subject" placeholder="Title of report" value={formData.subject} onChange={handleChange} required className="w-full pl-4 border-gray-200" />
              </div>
            </div>
            
            <div className="grid grid-cols-[120px_1fr] md:grid-cols-[180px_1fr] items-start gap-4">
              <label htmlFor="description" className="font-medium text-right mt-2">
                Description<span className="text-red-500">*</span>
              </label>
              <div className="relative w-full">
                <Textarea id="description" name="description" placeholder="Description" rows={8} value={formData.description} onChange={handleChange} required className="w-full pl-4 border-gray-200" />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-8">
              <Button type="button" variant="outline" onClick={handleCancel} className="px-8">
                Cancel
              </Button>
              <Button type="submit" className="px-8 bg-primary hover:bg-primary/90">
                Submit
              </Button>
            </div>
          </form>
        </div>
      </main>
      
      
    </div>;
};
export default Report;