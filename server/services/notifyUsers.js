import cron from "node-cron";
import { Borrow } from "../models/borrowModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/userModel.js";

export const notifyUsers = () => {
    cron.schedule("*/30 * * * *", async () => {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const borrowers = await Borrow.find({
                dueDate: {
                     $lt: oneDayAgo
                },
                returnDate: null,
                notified: false,
            });

            for (const element of borrowers) {
                if (element.user) {

                    const user = await User.findById(element.user);

                    if (user && user.email) {
                        await sendEmail({
                            email: user.email,
                            subject: "Book Return Reminder",
                            message: `Hello ${user.name},\n\nThis is a reminder that the book you borrowed is overdue. Please return it to the library as soon as possible.\n\nThank you.`
                        });

                        element.notified = true;
                        await element.save();
                    }
                }
            }
        }
        catch (error) {
            console.error("Some error occurred while notifying users.", error);
        }
    });
};
