import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Lead from '@/models/Lead';
import { withAuth } from '@/middleware/auth';

// GET AI-based follow-up suggestions for a lead
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await withAuth(request);
    
    if (auth instanceof NextResponse) {
      return auth;
    }
    
    await connectDB();
    
    const lead = await Lead.findById(params.id);
    
    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    // AI-based suggestion logic using lead properties
    const suggestions = generateFollowUpSuggestions(lead);
    
    return NextResponse.json({ suggestions }, { status: 200 });
  } catch (error: any) {
    console.error('Get suggestions error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateFollowUpSuggestions(lead: any): string[] {
  const suggestions: string[] = [];
  const now = new Date();
  const daysSinceCreation = Math.floor((now.getTime() - new Date(lead.createdAt).getTime()) / (1000 * 60 * 60 * 24));
  const daysSinceLastActivity = lead.updatedAt ? Math.floor((now.getTime() - new Date(lead.updatedAt).getTime()) / (1000 * 60 * 60 * 24)) : daysSinceCreation;
  
  // High priority leads
  if (lead.priority === 'high') {
    if (lead.status === 'new') {
      suggestions.push('🚨 HIGH PRIORITY: Call this lead within 24 hours. High-budget leads convert quickly when contacted promptly.');
      suggestions.push('💡 Tip: Prepare premium property listings matching their budget before calling.');
    } else if (lead.status === 'contacted') {
      suggestions.push('📞 Follow up with a phone call. High-budget clients prefer personal attention.');
      suggestions.push('🏢 Schedule a property visit as soon as possible to maintain interest.');
    } else if (lead.status === 'in_progress') {
      suggestions.push('📧 Send personalized property recommendations based on their interest.');
      suggestions.push('🤝 Offer exclusive deals or incentives to close the deal quickly.');
    }
  }
  
  // Medium priority leads
  if (lead.priority === 'medium') {
    if (lead.status === 'new') {
      suggestions.push('📱 Send a WhatsApp message introducing yourself and your services.');
      suggestions.push('📧 Email a curated list of properties matching their interest.');
    } else if (lead.status === 'contacted') {
      suggestions.push('📞 Schedule a follow-up call within 3 days to maintain engagement.');
      suggestions.push('📋 Send detailed property information and pricing.');
    } else if (lead.status === 'in_progress') {
      suggestions.push('🏠 Arrange virtual property tours if in-person visits are not possible.');
      suggestions.push('💰 Discuss financing options and payment plans.');
    }
  }
  
  // Low priority leads
  if (lead.priority === 'low') {
    if (lead.status === 'new') {
      suggestions.push('📧 Send an introductory email with general market information.');
      suggestions.push('📱 Connect on WhatsApp for future property updates.');
    } else if (lead.status === 'contacted') {
      suggestions.push('📞 Weekly check-in calls to maintain relationship.');
      suggestions.push('📱 Send market updates and new property listings weekly.');
    } else if (lead.status === 'in_progress') {
      suggestions.push('📧 Send affordable property options within their budget.');
      suggestions.push('💡 Discuss alternative locations or property types.');
    }
  }
  
  // Overdue follow-up
  if (lead.followUpDate && new Date(lead.followUpDate) < now) {
    const overdueDays = Math.floor((now.getTime() - new Date(lead.followUpDate).getTime()) / (1000 * 60 * 60 * 24));
    suggestions.push(`⚠️ URGENT: Follow-up is ${overdueDays} days overdue! Contact immediately to avoid losing this lead.`);
  }
  
  // Stale leads (no activity for 7+ days)
  if (daysSinceLastActivity >= 7) {
    suggestions.push(`⏰ This lead hasn't been active for ${daysSinceLastActivity} days. Re-engage with new property listings.`);
    suggestions.push('📱 Send a "Just checking in" message on WhatsApp.');
  }
  
  // New leads (created today)
  if (daysSinceCreation === 0) {
    suggestions.push('🎉 New lead! Contact within 2 hours for best conversion rate.');
    suggestions.push('📱 Send a welcome message on WhatsApp immediately.');
  }
  
  // Property interest based suggestions
  if (lead.propertyInterest.toLowerCase().includes('apartment') || lead.propertyInterest.toLowerCase().includes('flat')) {
    suggestions.push('🏢 Share information about apartment amenities, security, and maintenance.');
  } else if (lead.propertyInterest.toLowerCase().includes('house') || lead.propertyInterest.toLowerCase().includes('villa')) {
    suggestions.push('🏠 Highlight privacy, garden space, and neighborhood.');
  } else if (lead.propertyInterest.toLowerCase().includes('plot') || lead.propertyInterest.toLowerCase().includes('land')) {
    suggestions.push('📐 Share information about development potential, zoning, and future appreciation.');
  }
  
  // Budget-based suggestions
  if (lead.budget > 30000000) {
    suggestions.push('💎 For high-budget clients, emphasize exclusivity, prime locations, and investment potential.');
  } else if (lead.budget < 10000000) {
    suggestions.push('🏆 Focus on value for money, emerging areas with growth potential.');
  }
  
  // Closed status
  if (lead.status === 'closed') {
    suggestions.push('✅ Great job! Ask for testimonials or referrals to grow your business.');
    suggestions.push('🎁 Send a thank you note and maintain relationship for future needs.');
  }
  
  // Lost status
  if (lead.status === 'lost') {
    suggestions.push('📧 Send a follow-up email asking for feedback on why they chose another option.');
    suggestions.push('🔄 Keep them in your mailing list for future opportunities.');
  }
  
  // Default suggestion if none match
  if (suggestions.length === 0) {
    suggestions.push('📞 Schedule a follow-up call to discuss their property requirements.');
    suggestions.push('📧 Send relevant property listings matching their interest.');
  }
  
  return suggestions;
}
