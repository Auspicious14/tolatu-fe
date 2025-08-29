import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type ApiVoice = {
  name: string;
  gender: string;
  country: string;
  voice: string;
};

export type Voice = {
  label: string;
  value: string;
  name: string;
  gender: string;
  country: string;
  voice: string;
};

export const fetchVoices = async (): Promise<Voice[]> => {
  const { data: response } = await axios.get<{ data: ApiVoice[] }>(
    `${apiUrl}/get-available-voices`
  );
  if (!response.data) {
    throw new Error("No voices available");
  }
  return response.data.map((v) => ({
    label: `${v.name} (${v.gender}, ${v.country})`,
    value: v.voice,
    ...v,
  }));
};

export const textToSpeech = async (
  text: string,
  voice: string
): Promise<Blob> => {
  const query = new URLSearchParams({ text, voice });
  const res = await fetch(
    `${apiUrl}/text-to-speech-with-edge?${query.toString()}`,
    {
      method: "GET",
      headers: { Accept: "audio/mpeg" },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `HTTP error! status: ${res.status}, details: ${errorText}`
    );
  }

  return res.blob();
};

export const imageToSpeech = async (
  base64Image: string,
  imageFile: File | null
): Promise<Blob> => {
  const res = await axios.post(
    `${apiUrl}/image-to-speech`,
    {
      image: {
        uri: base64Image,
        name: imageFile?.name,
        type: imageFile?.type,
      },
    },
    {
      headers: { "Content-Type": "application/json" },
      responseType: "blob",
    }
  );

  if (res.status !== 200) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }

  return res.data;
};
