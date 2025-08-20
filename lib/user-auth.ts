import { NextRequest } from "next/server"
import jwt from "jsonwebtoken";
import prisma from "./prisma";
import { JWTPayload } from "@/types/types";

export async function getUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  
  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload
  return await prisma.user.findUnique({
    where: { id: decoded.userId }
  })
}