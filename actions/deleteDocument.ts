"use server";

import { adminDb, adminStorage } from "@/firebase/firebaseAdmin";
import { indexName } from "@/lib/langchain";
import pineconeClient from "@/lib/pinecone";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteDocument(docId: string) {
  auth().protect();

  const { userId } = await auth();

    // Deleting the document from the database
  await adminDb
    .collection("users")
    .doc(userId!)
    .collection("files")
    .doc(docId)
    .delete();

    // Delete from firebase storage
    await adminStorage
        .bucket(process.env.firebase_storage_bucket)  // UPDATE WITH ENV VARIABLE
        .file(`users/${userId}/files/${docId}`)
        .delete()

    // delete all the embeddings associated with the document
    const index = await pineconeClient.index(indexName)
    await index.namespace(docId).deleteAll()
    
    // Revalidate the documents page to ensure the document are up to date
    revalidatePath("/dashboard")
    
}
