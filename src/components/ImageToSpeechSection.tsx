import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { useDropzone } from "react-dropzone";

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
    <section className="flex flex-col items-center justify-center py-10 px-4 w-full mb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg"
      >
        <h2 className="text-3xl font-semibold mb-6 text-center text-gray-100">
          Image to Speech
        </h2>
        <div
          {...getRootProps()}
          className={`w-full p-6 mb-4 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? "border-pink-500 bg-gray-700" : "border-gray-600"
          }`}
        >
          <input {...getInputProps()} />
          {isDragActive ? (
            <p className="text-pink-400">Drop the image here ...</p>
          ) : (
            <p className="text-gray-400">
              Drag 'n' drop an image here, or click to select an image
            </p>
          )}
        </div>
        {imageError && (
          <p className="text-red-500 mt-4 text-center">{imageError}</p>
        )}
        {base64Image && (
          <div className="mb-4 text-center text-gray-300 flex justify-center items-center">
            <Image
              src={base64Image}
              alt="Selected"
              width={96}
              height={96}
              className="w-24 h-24 object-cover rounded-full"
            />
          </div>
        )}
        <button
          onClick={handleImageToSpeech}
          disabled={imageLoading || !base64Image}
          className="w-full bg-pink-600 text-white p-3 rounded-lg font-semibold hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {imageLoading ? "Converting Image..." : "Convert Image to Speech"}
        </button>
        {imageAudioSrc && (
          <div className="mt-6 w-full">
            <audio controls src={imageAudioSrc} className="w-full">
              Your browser does not support the audio element.
            </audio>
            <a
              href={imageAudioSrc}
              download="image_speech.mp3"
              className="block text-center text-pink-400 hover:underline mt-2"
            >
              Download Image Audio
            </a>
          </div>
        )}
      </motion.div>
    </section>
  );
};

export default ImageToSpeechSection;
