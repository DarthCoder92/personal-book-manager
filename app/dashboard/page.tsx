"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";



export default function DashboardPage() {

    type Book = {
        _id: string;
        title: string;
        author: string;
        status: string;
    }

    const [books, setBooks] = useState<Book[]>([]);
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [status, setStatus] = useState("Unread");
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const router = useRouter();

    const handleLogout = async () => {
        await fetch("api/auth/logout", {
            method: "POST",
        });

        router.push("/login");
    };




    useEffect(() => { fetchBooks() }, []);

    const fetchBooks = async () => {

        setLoading(true);
        setError("");

        const response = await fetch("/api/books");
        const data = await response.json();

        console.log(data);

        if (response.ok) {
            setBooks(data.books);
        } else {
            setError(data.message || "Failed to load books.");
        }



        setLoading(false);
    }

    const handleAddBook = async (e: React.FormEvent) => {
        e.preventDefault();

        console.log({ title, author, status });

        if (!title.trim() || !author.trim() || !status) {
            alert("Please add both Title, Author and Status.");
            return;
        }

        const response = await fetch("/api/books", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, author, status }),
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            await fetchBooks();

            setTitle("");
            setAuthor("");
            setStatus("Unread");
        }
    }


    const handleUpdateBook = async () => {

        if (!editingBook) return;

        const response = await fetch(`/api/books/${editingBook._id}`, {
            method: "PUT",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ title: editingBook.title, author: editingBook.author, status: editingBook.status })
        });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            await fetchBooks();
            setEditingBook(null);
        }

    }

    const handleDeleteBook = async (id: string) => {

        const confirmed = window.confirm("Are you sure you want to delete this book?");

        if (!confirmed) return;

        const response = await fetch(`/api/books/${id}`, { method: "DELETE" });

        const data = await response.json();

        console.log(data);

        if (response.ok) {
            await fetchBooks();

        }
    }





    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div className="header-titles">
                    <h1>📚 Personal Book Manager</h1>
                    <p>Keep track of your reading journey</p>
                </div>
                <div className="header-actions">
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                    <button
                        type="button"
                        className="add-book-button"
                        onClick={() => {
                            document
                                .getElementById("add-book-form")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        + Add Book
                    </button>
                </div>
            </header>
            <form id="add-book-form" onSubmit={handleAddBook} className="book-form">

                <div className="form-header">
                    <h2>Add a new book</h2>
                    <p>Add a book to your personal library</p>
                </div>

                <div>
                    <label>Title</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>

                <div>
                    <label>Author</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
                </div>

                <div>
                    <label>Status</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)}>

                        <option value="Unread">Unread</option>
                        <option value="Reading">Reading</option>
                        <option value="Read">Read</option>


                    </select>
                </div>

                <button type="submit">Add Book</button>
            </form>


            <div className="books-section">

                {loading ? (<div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your books...</p>
                </div>) : error ? (<div className="error-state">
                    <p>{error}</p>
                    <button onClick={fetchBooks}>Try Again</button>
                </div>) : books.length === 0 ? (<div className="empty-state">
                    <div className="empty-icon">📚</div>
                    <h2>Your library is empty</h2>
                    <p>You haven't added any books yet. Start building your personal library.</p>
                    <button
                        type="button"
                        onClick={() => {
                            document
                                .getElementById("add-book-form")
                                ?.scrollIntoView({ behavior: "smooth" });
                        }}
                    >
                        + Add your first book
                    </button>
                </div>) : (books.map((book) => (
                    <div key={book._id} className="book-card">
                        <h2>{book.title}</h2>
                        <p>By {book.author}</p>
                        <span className={`book-status status-${book.status.toLowerCase()}`}>
                            {book.status}
                        </span>

                        <div className="book-actions">
                            <button onClick={() => setEditingBook(book)}>Edit</button>
                            <button onClick={() => handleDeleteBook(book._id)}>Delete</button>
                        </div>
                    </div>
                )
                ))}

            </div>

            {editingBook && (
                <div className="edit-card">
                    <div className="edit-header">
                        <div>
                            <h2>Edit Book</h2>
                            <p>Update your book details.</p>
                        </div>

                        <button
                            className="close-edit"
                            onClick={() => setEditingBook(null)}
                        >
                            ×
                        </button>
                    </div>

                    <div className="edit-form">
                        <div>
                            <label>Title</label>
                            <input
                                type="text"
                                value={editingBook.title}
                                onChange={(e) =>
                                    setEditingBook({
                                        ...editingBook,
                                        title: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label>Author</label>
                            <input
                                type="text"
                                value={editingBook.author}
                                onChange={(e) =>
                                    setEditingBook({
                                        ...editingBook,
                                        author: e.target.value,
                                    })
                                }
                            />
                        </div>

                        <div>
                            <label>Status</label>
                            <select
                                value={editingBook.status}
                                onChange={(e) =>
                                    setEditingBook({
                                        ...editingBook,
                                        status: e.target.value,
                                    })
                                }
                            >
                                <option value="Unread">Unread</option>
                                <option value="Reading">Reading</option>
                                <option value="Read">Read</option>
                            </select>
                        </div>
                    </div>

                    <div className="edit-actions">
                        <button
                            className="cancel-button"
                            onClick={() => setEditingBook(null)}
                        >
                            Cancel
                        </button>

                        <button
                            className="save-button"
                            onClick={handleUpdateBook}
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            )}

        </main>
    );
}

