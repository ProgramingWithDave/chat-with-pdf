"use client"

import { db } from "@/firebase/firebase";
import { useUser } from "@clerk/nextjs";
import { collection, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";



// number of docs the user is allowed to have
const PRO_LIMIT = 20
const FREE_LIMIT = 2;

function useSubscription() {
    const [hasActiveMembership, setHasActiveMembership] = useState(null)
    const [isOverFileLimit, setIsOverFileLimit] = useState(false)
    const { user } = useUser()
    
    // Listen to the users document
    const [snapshot, loading, error] = useDocument(
        user && doc(db, "users", user.id),
        {
            snapshotListenOptions: { includeMetadataChanges: true }
        }
    )

    // Listen to the users files collection
    const [filesSnapshot, filesLoading, filesError] = useCollection(
        user && collection(db, "users", user?.id, "files")
    )

    useEffect(() => {
        if (!snapshot) return;

        const data = snapshot.data();
        // console.log("debug 3 >", data.hasActiveMembership)
        if (!data) return 
        
        setHasActiveMembership(data.hasActiveMembership)
    }, [snapshot])

    useEffect(() => {
        if (!filesSnapshot || hasActiveMembership === null) return 
        
        const files = filesSnapshot.docs;
        const usersLimit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;

        console.log(
            "checking if user is over file limit",
            files.length,
            usersLimit
        )
        console.log("Debug 2", files.length, files.length >= usersLimit)
        setIsOverFileLimit(files.length >= usersLimit)

    }, [filesSnapshot, hasActiveMembership, PRO_LIMIT, FREE_LIMIT])

    return { hasActiveMembership, loading, error, isOverFileLimit, filesLoading }
}

export default useSubscription