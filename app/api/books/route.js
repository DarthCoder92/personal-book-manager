import {NextResponse} from 'next/server';
import {connectDB} from '@/lib/mongodb';
import Book from '@/models/Book';
import {getAuthenticatedUser} from '@/lib/auth';

export async function GET(request) {

    try {

        const user = getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({message: "Unauthorised"}, {status: 401});

        }

        await connectDB();

        const books = await Book.find({user: user.userId});

        return NextResponse.json({books}, {status: 200});

    } catch (error) {
        console.error("GET BOOKS ERROR:", error);

        return NextResponse.json({message: "Failed to fetch books"}, {status: 500});

    }

}

export async function POST(request) {

    try {

        const user = getAuthenticatedUser(request);

        if (!user) {
            return NextResponse.json({message: "Unauthorised"}, {status: 401});
        }

       

        const {title, author, status} = await request.json();

        if (!title || !author) {

            return NextResponse.json({message: "Title and author are required"}, {status: 400});
        }

        const validStatuses = ["Unread", "Reading", "Read"];

        if (status && !validStatuses.includes(status)) {

            return NextResponse.json({message: "Invalid status value"}, {status: 400});

        }

        await connectDB();

        const existingBook = await Book.findOne({title, author, user: user.userId});
        
        if (existingBook) {
            return NextResponse.json({message: "Book already exists"}, {status: 400});
        }

        const newBook = await Book.create({
            title,
            author,
            status,
            user: user.userId
        });

        return NextResponse.json({message: "Book created successfully", book: newBook}, {status: 201});


    } catch (error) {  
        console.error("CREATE BOOK ERROR:", error);

        return NextResponse.json({message: "Failed to create book"}, {status: 500});

    }
}