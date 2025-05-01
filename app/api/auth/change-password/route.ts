import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth-options";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { verifyPassword } from "@/lib/auth/prisma-auth";

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
    const { currentPassword, newPassword } = await req.json();
    
    // Get the user with their current password
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user || !user.password) {
      return NextResponse.json(
        { message: "User not found or no password set (social login)" },
        { status: 400 }
      );
    }
    
    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password);
    
    if (!isValid) {
      return NextResponse.json(
        { message: "Current password is incorrect" },
        { status: 400 }
      );
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update user password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });
    
    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error changing password:", error);
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    );
  }
}