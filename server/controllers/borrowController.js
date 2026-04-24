import {catchAsyncErrors} from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/calculateFine.js";
export const recordBorrowedBook = catchAsyncErrors(
    async(req,res,next)=>{
        const { bookId } = req.params;
        const { email } = req.body;

        const book = await Book.findById(bookId);
        if(!book){
            return next(new ErrorHandler("Book not found", 400));
        }

        const user = await User.findOne({ email });
        if(!user){
            return next(new ErrorHandler("User not found", 400));
        }

        if(book.quantity === 0){
            return next(new ErrorHandler("Book not available.",400));
        }

        // ✅ FIX: ensure array exists
        if (!user.borrowBooks) {
            user.borrowBooks = [];
        }

        const isAlreadyBorrowed = user.borrowBooks.find(
            (b) => b.bookId.toString() === bookId && b.returned === false
        );

        if(isAlreadyBorrowed){
            return next(new ErrorHandler("Book already borrowed", 400));
        }

        book.quantity -= 1;
        book.availability = book.quantity > 0;
        await book.save();

        user.borrowBooks.push({
            bookId: book._id,
            bookTitle: book.title,
            borrowDate: new Date(),
            dueDate: new Date(Date.now() + 7*24*60*60*1000),
            returned: false
        });

        await user.save();

        await Borrow.create({
            user:{
                id: user._id,
                name: user.name,
                email: user.email
            },
            book: book._id,
            dueDate: new Date(Date.now() + 7*24*60*60*1000),
            price: book.price,
        });

        res.status(200).json({
            success: true,
            message: "Borrowed book recorded successfully.",
        });
    }
);

export const returnBorrowedBook = catchAsyncErrors(
    async(req,res,next)=>{
       const { bookId } = req.params;
       const { email } = req.body;

       // Fetch book
       const book = await Book.findById(bookId);
       if(!book){
        return next(new ErrorHandler("Book not found.", 400));
       }

       // Fetch user
       const user = await User.findOne({ email, accountVerified: true });
       if(!user){
        return next(new ErrorHandler("User not found", 400));
       }

       // ✅ Fetch Borrow record directly
       const borrow = await Borrow.findOne({
         book: bookId,
         "user.email": email,
         returnDate: null,
       });

       if(!borrow){
        return next(new ErrorHandler("You have not borrowed this book",400));
       }

       // Mark return in Borrow
       borrow.returnDate = new Date();
       borrow.fine = calculateFine(borrow.dueDate);
       await borrow.save();

       // Update book quantity and availability
       book.quantity += 1;
       book.availability = book.quantity > 0;
       await book.save();

       // Update user.borrowBooks if present
       if(user.borrowBooks && user.borrowBooks.length > 0){
         const borrowedBook = user.borrowBooks.find(
           (b) => b.bookId.toString() === bookId && b.returned === false
         );
         if(borrowedBook) borrowedBook.returned = true;
         await user.save();
       }

       // Send response
       res.status(200).json({
        success: true,
        message: borrow.fine !== 0
        ? `The book has been returned successfully, The total charges, including a fine, are $${borrow.fine + book.price}`
        : `The book has returned successfully. The total charges are $${book.price}`,
       });
    }
);
export const getMyBorrowedBooks = catchAsyncErrors(
  async (req, res, next) => {

    console.log("USER ID:", req.user._id);

    const borrowedBooks = await Borrow.find({
      "user.id": req.user._id,
    });

    console.log("BORROWED:", borrowedBooks);

    res.status(200).json({
      success: true,
      borrowedBooks,
    });
  }
);


export const getBorrowedBooksForAdmin = catchAsyncErrors(
    async(req,res,next)=>{
        const borrowBooks = await Borrow.find();

        res.status(200).json({
            success:true,
            borrowBooks,
        });
    }
);
