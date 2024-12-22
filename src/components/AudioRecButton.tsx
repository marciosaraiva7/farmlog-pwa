import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { BsFillMicFill, BsRecordCircle, BsX } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

import AudioPlayer from "./AudioPlayer";

interface AudioRecorderProps {
  setAudioList: (files: File[]) => void;
  audioList?: File[]; // Lista de arquivos de áudio carregados previamente
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setAudioList,
  audioList = [],
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioFiles, setAudioFiles] = useState<File[]>(audioList);
  const [audioURLs, setAudioURLs] = useState<string[]>(
    audioList.map((file) => URL.createObjectURL(file)),
  );
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]); // Armazena os blobs temporariamente

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isRecording]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(stream);
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    // Limpa chunks antes de começar
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      // Quando parar, criamos o arquivo a partir de todos os chunks
      if (chunksRef.current.length > 0) {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioFile = new File([blob], `recording-${Date.now()}.webm`, {
          type: "audio/webm",
        });
        setAudioFiles((prevFiles) => {
          const updated = [...prevFiles, audioFile];
          setAudioList(updated); // Atualiza no pai agora que o arquivo está pronto
          return updated;
        });
        setAudioURLs((prevURLs) => [
          ...prevURLs,
          URL.createObjectURL(audioFile),
        ]);
      }
    };

    mediaRecorder.start();
    setRecordingTime(0);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
  };

  const cancelRecording = () => {
    // Caso o usuário cancele antes de parar, não salvamos nada
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setRecordingTime(0);
    chunksRef.current = []; // Limpamos os chunks, não salvamos o áudio.
  };

  const deleteRecording = (index: number) => {
    setAudioURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
    setAudioFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((_, i) => i !== index);
      setAudioList(updatedFiles); // Atualiza a lista no componente pai
      return updatedFiles;
    });
  };

  return (
    <div className="flex flex-col items-start w-full">
      {audioURLs.length > 0 && (
        <div className="flex flex-col items-center mt-4 w-full">
          {audioURLs.map((url, index) => (
            <div
              key={index}
              className="flex items-center w-full justify-between mb-2 gap-4"
            >
              <AudioPlayer src={url} isDisabled={isRecording} />
              <button
                type="button"
                className="bg-red-600 text-white flex items-center p-2 rounded-full text-[1.125rem] leading-[1.5rem] disabled:opacity-35"
                onClick={() => deleteRecording(index)}
                disabled={isRecording}
              >
                <BsX fill="white" size={"21px"} />
              </button>
            </div>
          ))}
        </div>
      )}
      {!isRecording ? (
        <button
          type="button"
          className="bg-[#181A1880] text-white flex gap-2 items-center pt-2 pb-2 pl-4 pr-4 rounded-full text-[1.125rem] leading-[1.5rem]"
          onClick={startRecording}
        >
          <BsFillMicFill fill="white" size={"21px"} /> Áudio
        </button>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex gap-4 justify-between items-center w-full pl-2">
            <button
              type="button"
              className="bg-gray-600 text-white flex items-center justify-center w-10 h-10 rounded-full text-[1.125rem] leading-[1.5rem]"
              onClick={cancelRecording}
            >
              <FaTrash fill="white" />
            </button>
            <div className="flex gap-4 items-center justify-center">
              <div className="animate-pulse ">
                <BsRecordCircle size={"21px"} fill="red" />
              </div>
              <p className="text-black">Gravando</p>
            </div>
            <p className="text-black font-bold">
              {format(new Date(recordingTime * 1000), "mm:ss")}
            </p>
            <button
              type="button"
              className="bg-[#181A18] text-white flex gap-2 items-center pl-4 pr-4 pt-2 pb-2 rounded-full text-[1.125rem] leading-[1.5rem]"
              onClick={stopRecording}
            >
              Salvar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
