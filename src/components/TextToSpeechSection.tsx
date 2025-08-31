import React from "react";
import { Voice } from "../services/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

type TextToSpeechSectionProps = {
  text: string;
  setText: (text: string) => void;
  voices: Voice[];
  selectedVoice: Voice | null;
  setSelectedVoice: React.Dispatch<React.SetStateAction<Voice | null>>;
  audioSrc: string | null;
  loading: boolean;
  handleSubmit: () => void;
  error: string;
};

const TextToSpeechSection: React.FC<TextToSpeechSectionProps> = ({
  text,
  setText,
  voices,
  selectedVoice,
  setSelectedVoice,
  audioSrc,
  loading,
  handleSubmit,
  error,
}) => {
  return (
    <Card className="w-full max-w-lg bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl text-pink-400">Text to Speech</CardTitle>
        <CardDescription>
          Enter text, choose a voice, and generate audio.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="text">Your Text</Label>
          <Textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert to speech..."
            className="bg-gray-900 border-gray-600 focus:ring-pink-500"
          />
          {text.length > 200 && (
            <p className="text-sm text-yellow-400">
              ⚠️ Long text may take a moment to generate.
            </p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="voice">Select a Voice</Label>
          <Select
            value={selectedVoice?.value}
            onValueChange={(value) => {
              const voice = voices.find((v) => v.value === value);
              if (voice) {
                setSelectedVoice(voice);
              }
            }}
          >
            <SelectTrigger className="w-full bg-gray-900 border-gray-600">
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-gray-600">
              {voices.map((voice) => (
                <SelectItem key={voice.value} value={voice.value}>
                  {voice.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? "Generating..." : "Convert to Audio"}
        </Button>
        {audioSrc && (
          <div className="w-full">
            <audio src={audioSrc} controls className="w-full" />
            <a
              href={audioSrc}
              download="generated.mp3"
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

export default TextToSpeechSection;
