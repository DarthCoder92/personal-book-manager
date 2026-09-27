import jwt from "jsonwebtoken";

export function getAuthenticatedUser(request) {

    try {
        const token = request.cookies.get("token")?.value;

        if (!token) {
            return null;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        return decoded;
    } catch (error) {
        return null;
    }
}

