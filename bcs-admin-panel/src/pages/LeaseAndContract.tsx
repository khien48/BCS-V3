
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { Filter } from "lucide-react";

const LeaseAndContract = () => {
  // Sample tenant data
  const tenantData = [
    { id: 1, name: "Roderick, M", stallNo: "201", status: "Active", stallNoAssigned: "101" },
    { id: 2, name: "Naruto, B", stallNo: "133", status: "Inactive", stallNoAssigned: "102" },
    { id: 3, name: "Kangkong, M", stallNo: "002", status: "Active", stallNoAssigned: "103" },
    { id: 4, name: "Xhunter, B", stallNo: "423", status: "Active", stallNoAssigned: "104" },
    { id: 5, name: "Jean, K", stallNo: "643", status: "Inactive", stallNoAssigned: "105" },
    { id: 6, name: "BatongBakal, M", stallNo: "211", status: "Active", stallNoAssigned: "106" },
  ];

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-bcs-green">300</h3>
            <p className="mt-2 text-sm text-gray-600">Total Tenant</p>
          </Card>
          <Card className="p-6 bg-white shadow-sm">
            <h3 className="text-4xl font-bold text-red-500">20</h3>
            <p className="mt-2 text-sm text-gray-600">Total Overdue</p>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 max-w-3xl">
          <div className="flex-1 relative">
            <Input type="text" placeholder="Search" className="pl-10 pr-4 py-2 w-full border rounded-lg" />
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <Button variant="default" className="bg-bcs-green hover:bg-bcs-green/90">
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        </div>

        {/* Tenant List */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Tenant List</h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant Name</TableHead>
                  <TableHead>Stall No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stall No:</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenantData.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{tenant.stallNo}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-sm ${tenant.status === 'Active' ? 'text-green-700' : 'text-red-500'}`}>
                        {tenant.status}
                      </span>
                    </TableCell>
                    <TableCell>{tenant.stallNoAssigned}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="default" className="bg-bcs-green hover:bg-bcs-green/90 text-xs h-8">
                        VIEW DETAILS
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AssistantLayout>
  );
};

export default LeaseAndContract;
