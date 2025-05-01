import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    const { preferences } = await req.json();
    
    // Check if the user already has preferences stored
    const existingPreferences = await prisma.userPreference.findUnique({
      where: { userId }
    });
    
    if (existingPreferences) {
      // Update existing preferences
      await prisma.userPreference.update({
        where: { userId },
        data: {
          emailNotifications: preferences.emailNotifications,
          workflowAlerts: preferences.workflowAlerts,
          marketingEmails: preferences.marketingEmails,
        }
      });
    } else {
      // Create new preferences
      await prisma.userPreference.create({
        data: {
          userId,
          emailNotifications: preferences.emailNotifications,
          workflowAlerts: preferences.workflowAlerts,
          marketingEmails: preferences.marketingEmails,
        }
      });
    }
    
    return NextResponse.json(
      { message: "Preferences updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating preferences:", error);
    return NextResponse.json(
      { error: "Failed to update preferences" },
      { status: 500 }
    );
  }
}