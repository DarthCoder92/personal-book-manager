import {NextResponse} from "next/server";
import {connectDB} from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request) {
    const {name, email, password} = await request.json();

    console.log(name, email, password);

    if (!name || !email || !password) {
        return NextResponse.json({message: "Name, email and password are required"}, {status: 400});
    }

    if (password.length < 6) {
        return NextResponse.json({message: "Password must be at least 6 characters long"}, {status: 400});
    }

    

    await connectDB();

    const existingUser = await User.findOne({email});

    if (existingUser) {
        return NextResponse.json({message: "User already exists"}, {status: 409});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = User.create({
        name,
        email,
        password: hashedPassword
    });

    const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRES_IN});

    const response = NextResponse.json({message: "User registered successfully"}, {status: 201});

    response.cookies.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: "/",
    });

    return response;





}