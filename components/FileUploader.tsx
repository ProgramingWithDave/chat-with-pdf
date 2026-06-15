"use client";

import { useToast } from "@/lib/hooks/use-toast";
import useSubscription from "@/lib/hooks/useSubscription";
import useUpload, { StatusText } from "@/lib/hooks/useUpload";
import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";

function FileUploader() {
  const { progress, status, fileId, handleUpload } = useUpload();
  const { isOverFileLimit, filesLoading } = useSubscription()
  const router = useRouter();
  const { toast } = useToast()


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const file = acceptedFiles[0];
console.log("Debug 1 >", !isOverFileLimit, !filesLoading)
    if (file) {
      if (!isOverFileLimit && !filesLoading) {
       await handleUpload(file)
      } else {
        toast({
          variant: "destructive",
          title: "Free plan file Limit Reached",
          description: "You have reached the maximum number of files allowed for your account, Plase upgrade to add more documents."
        })
     }
    } else {
      // do nothing
      // toast...
      return;
    }
  }, [handleUpload, isOverFileLimit, filesLoading, toast]);

  useEffect(() => {
    if (fileId) {
      router.push(`/dashboard/files/${fileId}`);
    }
  }, [fileId, router]);

  const statusIcons: {
    [key in StatusText]: JSX.Element;
  } = {
    [StatusText.UPLOADING]: <RocketIcon className=" w-20 h-20 text-sky-600" />,
    [StatusText.UPLOADED]: (
      <CheckCircleIcon className=" w-20 h-20 text-sky-600" />
    ),
    [StatusText.SAVING]: <SaveIcon className="w-20 h-20 text-sky-600" />,
    [StatusText.GENERATING]: <HammerIcon className=" w-20 animate-bounce h-20 text-sky-600" />,
  };

  const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
    useDropzone({
      onDrop,
      maxFiles: 1,
      accept: {
        "application/pdf": [".pdf"],
      },
    });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;
  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">
      {/* Loading */}
      {uploadInProgress && (
        <div className="mt-32 flex flex-col justify-center items-center gap-5">
          <div
            className={`radial-progress bg-sky-300 text-white border-sky-600 border-4 ${
              progress === 100 && "hidden"
            }`}
            role="progressbar"
            style={{
              // @ts-ignore
              "--value": progress,
              "--size": " 12rem",
              "--thickness": "1.3rem",
            }}
          >
            {progress} %
          </div>

          {/* Render status Icon */}
          {
            // @ts-ignore
            statusIcons[status!]
          }

          <p className="text-sky-600 animate-pulse">
            {status !== null && <>{status}</>}
          </p>
        </div>
      )}

      {!uploadInProgress && (
        <div
          {...getRootProps()}
          className={`p-10 border-2 border-dashed mt-10 w-[90%] border-sky-600 text-sky-600 rounded-lg h-96 flex flex-col items-center justify-center 
      ${isFocused || isDragAccept ? "bg-sky-300" : "bg-sky-100"}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col  items-center justify-center">
            {isDragActive ? (
              <>
                <RocketIcon className="h-29 w-20 animate-ping" />
                <p>Drop the files here ....</p>
              </>
            ) : (
              <>
                <CircleArrowDown className="w-20 h-20 animate-bounce" />
                <p className="cursor-pointer">
                  Drag 'n' drop some files here, or click to select files
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default FileUploader;
