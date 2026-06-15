"use server"

import { generateEmbeddingsInPineconeVectorStore } from "@/lib/langchain"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"



export async function generateEmbedding(docId: string) {
    auth().protect()
    
    // turn a PDF into embeddings [0.012343, 0.2345]
    await generateEmbeddingsInPineconeVectorStore(docId)

    revalidatePath("/dashboard")

    return { completed: true }
}