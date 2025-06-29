import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    // Try to create user, but handle unique constraint errors gracefully
    try {
      const newUser = await db.user.create({
        data: {
          clerkUserId: user.id,
          name,
          imageUrl: user.imageUrl,
          email: user.emailAddresses[0].emailAddress,
        },
      });

      return newUser;
    } catch (createError) {
      // If we get a unique constraint error, try to find the user again
      // This can happen with race conditions
      if (createError.code === 'P2002') {
        const existingUser = await db.user.findUnique({
          where: {
            clerkUserId: user.id,
          },
        });
        
        if (existingUser) {
          return existingUser;
        }
        
        // If still not found, try to find by email
        const userByEmail = await db.user.findUnique({
          where: {
            email: user.emailAddresses[0].emailAddress,
          },
        });
        
        if (userByEmail) {
          // Update the clerkUserId for this user
          const updatedUser = await db.user.update({
            where: {
              email: user.emailAddresses[0].emailAddress,
            },
            data: {
              clerkUserId: user.id,
            },
          });
          return updatedUser;
        }
      }
      
      throw createError;
    }
  } catch (error) {
    console.log("Error in checkUser:", error.message);
    return null;
  }
};
