'use server';

// This file is specifically designed to be server-only code
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * Custom functions to handle user authentication without relying on the PrismaAdapter
 * that's causing Node.js module import issues
 */

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  });
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}

export async function createUser(data: { email: string; password: string; name?: string }) {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  return prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name || data.email.split('@')[0]
    }
  });
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return bcrypt.compare(password, hashedPassword);
}

export async function updateUserById(id: string, data: any) {
  return prisma.user.update({
    where: { id },
    data
  });
}

export async function getUserAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId }
  });
}

export async function createUserAccount(data: any) {
  return prisma.account.create({
    data
  });
}

export async function deleteUserAccount(userId: string, provider: string) {
  return prisma.account.deleteMany({
    where: {
      userId,
      provider
    }
  });
}

export async function createUserSession(data: any) {
  return prisma.session.create({
    data
  });
}

export async function getUserSession(sessionToken: string) {
  return prisma.session.findUnique({
    where: { sessionToken }
  });
}

export async function updateUserSession(sessionToken: string, data: any) {
  return prisma.session.update({
    where: { sessionToken },
    data
  });
}

export async function deleteUserSession(sessionToken: string) {
  return prisma.session.delete({
    where: { sessionToken }
  });
}

export async function createVerificationToken(data: any) {
  return prisma.verificationToken.create({
    data
  });
}

export async function getVerificationToken(identifier: string, token: string) {
  return prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier,
        token
      }
    }
  });
}

export async function deleteVerificationToken(identifier: string, token: string) {
  return prisma.verificationToken.delete({
    where: {
      identifier_token: {
        identifier,
        token
      }
    }
  });
}