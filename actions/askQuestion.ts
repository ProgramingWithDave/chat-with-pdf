"use server";

import { Message } from "@/components/Chat";
import { adminDb } from "@/firebase/firebaseAdmin";
import { generateLangChainCompletion } from "@/lib/langchain";
import { auth } from "@clerk/nextjs/server";

// number of docs the user is allowed to have
const PRO_LIMIT = 20
const FREE_LIMIT = 2;

export async function askQuestion(id: string, question: string) {
  auth().protect();
  const { userId } = await auth();

  const chatRef = adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(id)
    .collection("chat");

  // check how many user messages are in the chat
  const ChatSnapshot = await chatRef.get();
  const userMessages = ChatSnapshot.docs.filter(
    (doc) => doc.data().role === "human"
  );

  // check membership limits for messages in a document
  const userRef = await adminDb.collection("users").doc(userId!).get()

  
  // tomorrow limit the pro/free users
  

  // check if user is on free plan and has asked more than the free number of questions
  if(!userRef.data()?.hasActiveMembership) {
    if(userMessages.length >= FREE_LIMIT) {
      return {
        success: false,
        message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions! 😥`  
      }
    }
  }

  // check if user is on PRO plan and has asked more than 100 questions
  if(userRef.data()?.hasActiveMembership) {
    if (userMessages.length >= PRO_LIMIT) {
      return {
        success: false,
        message: `You've reached the PRO limit of ${PRO_LIMIT} questions per document! 😥`
      }
    }
  }

    const userMessage: Message = {
        role: "human",
        message: question,
         createdAt: new Date()
    }

    await chatRef.add(userMessage)

    // Generate Ai response
    const reply = await generateLangChainCompletion(id, question)

    const aiMessage: Message = {
        role: "ai",
        message: reply,
        createdAt: new Date()
    }

    await chatRef.add(aiMessage)

    return { success: true, message: null}
}
