import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth } from '@/middleware/auth';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import { autoTable } from 'jspdf-autotable';

// Export leads to Excel or PDF
export async function GET(request: NextRequest) {
  try {
    const auth = await withAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    const user = auth.user;
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'excel';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    
    await connectDB();
    
    // Build query based on user role and filters
    let query: any = {};
    
    if (user.role === 'agent') {
      query.assignedTo = user._id;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    const leads = await Lead.find(query).populate('assignedTo', 'name').sort({ createdAt: -1 });
    
    if (format === 'excel') {
      return exportToExcel(leads);
    } else if (format === 'pdf') {
      return exportToPDF(leads);
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Use "excel" or "pdf"' },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Export error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function exportToExcel(leads: any[]) {
  // Transform leads for export
  const data = leads.map(lead => ({
    'Name': lead.name,
    'Email': lead.email,
    'Phone': lead.phone,
    'Property Interest': lead.propertyInterest,
    'Budget (PKR)': lead.budget,
    'Status': lead.status,
    'Priority': lead.priority,
    'Score': lead.score,
    'Assigned To': lead.assignedTo?.name || 'Unassigned',
    'Follow-up Date': lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not set',
    'Notes': lead.notes || '',
    'Created Date': new Date(lead.createdAt).toLocaleDateString(),
  }));
  
  // Create workbook
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Leads');
  
  // Generate buffer
  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.xlsx"`,
    },
  });
}

function exportToPDF(leads: any[]) {
  const doc = new jsPDF('l', 'mm', 'a4');
  
  // Add title
  doc.setFontSize(18);
  doc.text('Property CRM - Leads Report', 14, 15);
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);
  doc.text(`Total Leads: ${leads.length}`, 14, 27);
  
  // Prepare table data
  const tableData = leads.map(lead => [
    lead.name,
    lead.email,
    lead.phone,
    `PKR ${lead.budget.toLocaleString()}`,
    lead.status.toUpperCase(),
    lead.priority.toUpperCase(),
    lead.assignedTo?.name || 'Unassigned',
    lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not set',
  ]);
  
  // Add table
  autoTable(doc, {
    head: [['Name', 'Email', 'Phone', 'Budget', 'Status', 'Priority', 'Assigned To', 'Follow-up']],
    body: tableData,
    startY: 35,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [79, 70, 229],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245],
    },
  });
  
  // Generate buffer
  const buffer = Buffer.from(doc.output('arraybuffer'));
  
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.pdf"`,
    },
  });
}
