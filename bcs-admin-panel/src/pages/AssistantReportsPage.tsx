import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AssistantLayout from "../components/layouts/AssistantLayout";
import { Download, FileText, Calendar, DollarSign, TrendingUp, Users } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const AssistantReportsPage = () => {
  const { toast } = useToast();
  const [filterPeriod, setFilterPeriod] = useState('monthly');

  // Sample reports data
  const reportsData = {
    summary: {
      totalRevenue: 125500,
      totalPayments: 45,
      activeOperators: 12,
      pendingPayments: 8
    },
    paymentRecords: [
      { id: 1, operatorName: "Grande N.", busNumber: "ABC-123", amount: 2500, date: "2024-12-08", type: "Monthly Fee", status: "Paid" },
      { id: 2, operatorName: "Maria K.", busNumber: "DEF-456", amount: 1800, date: "2024-12-07", type: "Terminal Fee", status: "Paid" },
      { id: 3, operatorName: "Juan S.", busNumber: "GHI-789", amount: 3200, date: "2024-12-06", type: "Franchise Fee", status: "Pending" },
      { id: 4, operatorName: "Charlie A.", busNumber: "JKL-012", amount: 2200, date: "2024-12-05", type: "Monthly Fee", status: "Paid" },
      { id: 5, operatorName: "Alice C.", busNumber: "MNO-345", amount: 1950, date: "2024-12-04", type: "Terminal Fee", status: "Paid" },
      { id: 6, operatorName: "Robert B.", busNumber: "PQR-678", amount: 2800, date: "2024-12-03", type: "Monthly Fee", status: "Pending" },
      { id: 7, operatorName: "Sarah M.", busNumber: "STU-901", amount: 1600, date: "2024-12-02", type: "Terminal Fee", status: "Paid" },
      { id: 8, operatorName: "David L.", busNumber: "VWX-234", amount: 3500, date: "2024-12-01", type: "Franchise Fee", status: "Paid" },
    ],
    monthlyReports: [
      { month: "December 2024", totalRevenue: 45200, payments: 15, operators: 12 },
      { month: "November 2024", totalRevenue: 38900, payments: 13, operators: 11 },
      { month: "October 2024", totalRevenue: 41400, payments: 17, operators: 12 },
    ]
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Assistant Admin - Payment Reports', 14, 22);
    
    // Add filter info
    doc.setFontSize(12);
    doc.text(`Report Period: ${filterPeriod.charAt(0).toUpperCase() + filterPeriod.slice(1)}`, 14, 35);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 45);
    
    // Summary section
    doc.setFontSize(14);
    doc.text('Summary', 14, 60);
    doc.setFontSize(10);
    doc.text(`Total Revenue: ₱${reportsData.summary.totalRevenue.toLocaleString()}`, 14, 70);
    doc.text(`Total Payments: ${reportsData.summary.totalPayments}`, 14, 77);
    doc.text(`Active Operators: ${reportsData.summary.activeOperators}`, 14, 84);
    doc.text(`Pending Payments: ${reportsData.summary.pendingPayments}`, 14, 91);
    
    // Payment records table
    const tableData = reportsData.paymentRecords.map(record => [
      record.operatorName,
      record.busNumber,
      `₱${record.amount.toLocaleString()}`,
      record.date,
      record.type,
      record.status
    ]);
    
    autoTable(doc, {
      head: [['Operator Name', 'Bus Number', 'Amount', 'Date', 'Type', 'Status']],
      body: tableData,
      startY: 105,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }
    });
    
    doc.save(`assistant-reports-${filterPeriod}-${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Export Successful",
      description: "Report has been exported to PDF successfully."
    });
  };

  const getStatusBadge = (status: string) => {
    return (
      <span 
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'Paid' 
            ? 'bg-green-100 text-green-700' 
            : 'bg-yellow-100 text-yellow-700'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <AssistantLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Reports & Payment Tracking</h1>
            <p className="text-gray-500 mt-1">Monitor payment records and generate reports</p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              onClick={exportToPDF}
              className="bg-bcs-green hover:bg-bcs-green/90 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export to PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-bcs-green">₱{reportsData.summary.totalRevenue.toLocaleString()}</h3>
                <p className="mt-1 text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-bcs-green" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-bcs-green">{reportsData.summary.totalPayments}</h3>
                <p className="mt-1 text-sm text-gray-600">Total Payments</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-bcs-green">{reportsData.summary.activeOperators}</h3>
                <p className="mt-1 text-sm text-gray-600">Active Operators</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">{reportsData.summary.pendingPayments}</h3>
                <p className="mt-1 text-sm text-gray-600">Pending Payments</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Records */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-medium">Payment Records</h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              {filterPeriod.charAt(0).toUpperCase() + filterPeriod.slice(1)} View
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Operator Name</TableHead>
                  <TableHead>Bus Number</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Payment Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsData.paymentRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.operatorName}</TableCell>
                    <TableCell className="font-mono">{record.busNumber}</TableCell>
                    <TableCell className="font-semibold text-bcs-green">₱{record.amount.toLocaleString()}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.type}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Monthly/Yearly Summary */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">
            {filterPeriod.charAt(0).toUpperCase() + filterPeriod.slice(1)} Summary
          </h2>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead>Total Revenue</TableHead>
                  <TableHead>Number of Payments</TableHead>
                  <TableHead>Active Operators</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reportsData.monthlyReports.map((report, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{report.month}</TableCell>
                    <TableCell className="font-semibold text-bcs-green">₱{report.totalRevenue.toLocaleString()}</TableCell>
                    <TableCell>{report.payments}</TableCell>
                    <TableCell>{report.operators}</TableCell>
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

export default AssistantReportsPage;