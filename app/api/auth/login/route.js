import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    const {email, password} = await request.json();

    if(!email || !password) {
        return NextResponse.json({message: "Email and password are required"}, {status: 400});
    }

    await connectDB();

    const user = await User.findOne({email});

    if(!user) {
        return NextResponse.json({message: "User not found"}, {status: 404});

    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid) {
        return NextResponse.json({message: "Invalid password"}, {status: 401});
    }

    const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    const response = NextResponse.json({message: "User logged in successfully"}, {status: 200});

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    
    return response;

}