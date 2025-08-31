import React from "react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud } from "lucide-react";

type ImageToSpeechSectionProps = {
  base64Image: string;
  onImageDrop: (file: File) => void;
  handleImageToSpeech: () => void;
  imageLoading: boolean;
  imageAudioSrc: string | null;
  imageError: string;
};

const ImageToSpeechSection: React.FC<ImageToSpeechSectionProps> = ({
  base64Image,
  onImageDrop,
  handleImageToSpeech,
  imageLoading,
  imageAudioSrc,
  imageError,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onImageDrop(acceptedFiles[0]);
      }
    },
    accept: { "image/*": [] },
  });

  return (
    <Card className="w-full max-w-lg bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-pink-400">Image to Speech</CardTitle>
        <CardDescription>
          Upload an image, and we'll read the text to you.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="image-dropzone">Upload Image</Label>
          <div
            {...getRootProps()}
            id="image-dropzone"
            className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive
                ? "border-pink-500 bg-gray-700"
                : "border-gray-600 hover:border-gray-500"
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-10 h-10 mb-2 text-gray-400" />
            {isDragActive ? (
              <p className="text-pink-400">Drop the image here...</p>
            ) : (
              <p className="text-gray-400">
                Drag & drop or click to upload
              </p>
            )}
          </div>
          {imageError && <p className="text-sm text-red-500">{imageError}</p>}
        </div>
        {base64Image && (
          <div className="flex justify-center">
            <Image
              src={base64Image}
              alt="Selected"
              width={128}
              height={128}
              className="object-cover rounded-lg"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          onClick={handleImageToSpeech}
          disabled={imageLoading || !base64Image}
          className="w-full"
        >
          {imageLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {imageLoading ? "Converting..." : "Convert Image to Speech"}
        </Button>
        {imageAudioSrc && (
          <div className="w-full">
            <audio controls src={imageAudioSrc} className="w-full" />
            <a
              href={imageAudioSrc}
              download="image_speech.mp3"
              className="text-sm text-pink-400 hover:underline text-center block mt-2"
            >
              Download Audio
            </a>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ImageToSpeechSection;
