import express from "express";
import {
    getMyBorrowedBooks,
    getBorrowedBooksForAdmin,
    recordBorrowedBook,
    returnBorrowedBook
} from "../controllers/borrowController.js";

import {
    isAuthenticated,
    isAuthorized
} from "../middlewares/authMiddleware.js";

const router = express.Router();

/* Admin records a borrowed book */
router.post(
    "/borrow/:bookId",
    isAuthenticated,
    isAuthorized("Admin"),
    recordBorrowedBook
);

/* Admin sees all borrowed books */
router.get(
    "/admin/borrowed-books",
    isAuthenticated,
    isAuthorized("Admin"),
    getBorrowedBooksForAdmin
);

/* User sees their own borrowed books */
router.get(
    "/my-borrowed-books",
    isAuthenticated,
    getMyBorrowedBooks
);

/* Admin marks book as returned */
router.put(
    "/return/:bookId",
    isAuthenticated,
    isAuthorized("Admin"),
    returnBorrowedBook
);

export default router;