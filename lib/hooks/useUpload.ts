'use client'

import { generateEmbedding } from "@/actions/generateEmbeddings";
import { db, storage } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState } from "react"
import { v4 as uuidv4 } from 'uuid';

export enum StatusText {
    UPLOADING = "Uploading file..",
    UPLOADED = "File uploaded successfully",
    SAVING = "Saving file to database...",
    GENERATING = "Generating AI Embeddings, This will only take few seconds..."
}

export type status = StatusText[keyof StatusText]

function useUpload() {
    const [progress, setProgress] = useState<number | null>(null)
    const [fileId, setFileId] = useState<string | null>(null)
    const [status, setStatus] = useState<status | null>(null)
    const { user } = useUser();
    const router = useRouter()

    const handleUpload = async (file: File) => {
        if (!file || !user) return

        // Generate a unique ID for this file. Used as the Storage path
        // segment and as the Firestore document ID, keeping them in sync.
        const fileIdToUploadTo = uuidv4()
        // Path in Firebase Storage: users/{uid}/files/{fileId}
        const storageRef = ref(
            storage,
            `users/${user.id}/files/${fileIdToUploadTo}`
        )
        // Subscribe to state changes for the upload.
        //  - arg 2: progress callback (fires many times)
        //  - arg 3: error callback (fires once on failure)
        //  - arg 4: success callback (fires once when bytes are fully sent)
        const uploadTask = uploadBytesResumable(storageRef, file)

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // Compute percentage complete from bytes sent vs. total.
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setStatus(StatusText.UPLOADING)
                setProgress(percent)
            },
            (error) => {
                // Upload failed. Ideally we'd also reset status/progress here
                // so the UI doesn't stay stuck on "Uploading file..".
                console.error("Error uploading file", error)
            }, async () => {
                // File bytes are in Storage. Now persist metadata to Firestore.
                setStatus(StatusText.UPLOADED)
                // Resolve a public download URL for the stored object.
                const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
                // Write a metadata doc at users/{uid}/files/{fileId}.
                setStatus(StatusText.SAVING)
                await setDoc(doc(db, "users", user.id, "files", fileIdToUploadTo), {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    downloadUrl: downloadUrl,
                    ref: uploadTask.snapshot.ref.fullPath,
                    createdAt: new Date()
                })
                // Kick off server-side embedding generation for this file.
                setStatus(StatusText.GENERATING)
                // Generate Ai Embedding
                await generateEmbedding(fileIdToUploadTo)
                // Publish the new file's ID to consumers so they can route
                // to (e.g.) /file/{fileId}.
                setFileId(fileIdToUploadTo)
            }
        )
    }

    return { progress, status, fileId, handleUpload }
}

export default useUpload