import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/models/Book";
import { getAuthenticatedUser } from "@/lib/auth";


export async function PUT(request, { params }) {

    try {

        const user = getAuthenticatedUser(request);
        
        if (!user) {
            return NextResponse.json({ message: "Unauthorised" }, { status: 401 });
        }

        const {id} = await params;

        const { title, author, status } = await request.json();

        const validStatuses = ["Unread", "Reading", "Completed"];

        if (status && !validStatuses.includes(status)) {
            return NextResponse.json({ message: "Invalid status value" }, { status: 400 });
        }

        await connectDB();

        const book = await Book.findOne({_id: id, user: user.userId});

        if (!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });

        }

        if (title !== undefined) {
            book.title = title;
        }

        if (author !== undefined) {
            book.author = author;
        }

        if (status !== undefined) {
            book.status = status;
        }

        await book.save();

        return NextResponse.json({ message: "Book updated successfully", book }, { status: 200 });



    } catch (error){

        console.error("UPDATE BOOK ERROR:", error);

        return NextResponse.json({message: "Failed to update book"}, {status: 500});

    }


}

export async function DELETE(request, { params }) {

    try {

        const user = getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({ message: " Unauthorised" }, { status: 401 });
        }

        const {id} = await params;

        await connectDB();

        const book = await Book.findOne({_id: id, user: user.userId});

        if (!book) {
            return NextResponse.json({ message: "Book not found" }, { status: 404 });
        }

        await book.deleteOne();

        return NextResponse.json({ message: "Book deleted successfully" }, { status: 200 });

    } catch (error) {

        console.error("Delete Book Error:", error);

        return NextResponse.json({ message: "Failed to delete book" }, { status: 500 });
    }

}