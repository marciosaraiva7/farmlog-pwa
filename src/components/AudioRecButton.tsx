import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { BsFillMicFill, BsRecordCircle, BsX } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";

import AudioPlayer from "./AudioPlayer";

interface AudioRecorderProps {
  setAudioList: (files: File[]) => void;
  audioList?: string[]; // Lista de URLs de áudios carregados previamente
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
  setAudioList,
  audioList = [],
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioFiles, setAudioFiles] = useState<File[]>([]); // Armazenamos os arquivos de áudio locais
  const [audioURLs, setAudioURLs] = useState<string[]>(audioList); // Inicializa com os áudios carregados
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Atualiza o tempo de gravação enquanto a gravação está ativa
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isRecording]);

  // Função para iniciar a gravação
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setStream(stream);
    const mediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(mediaRecorder);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        const audioFile = new File(
          [event.data],
          `recording-${Date.now()}.webm`,
          {
            type: "audio/webm",
          },
        );
        setAudioFiles((prevFiles) => {
          const updatedFiles = [...prevFiles, audioFile];
          setAudioList(updatedFiles); // Atualiza a lista logo após atualizar os arquivos
          return updatedFiles;
        });
        setAudioURLs((prevURLs) => [
          ...prevURLs,
          URL.createObjectURL(event.data),
        ]);
      }
    };

    mediaRecorder.start();
    setRecordingTime(0);
    setIsRecording(true);
  };

  // Função para parar a gravação e salvar
  const stopRecording = () => {
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);

    // Atualiza a lista de áudios no componente pai assim que a lista de arquivos for atualizada
    setAudioFiles((prevFiles) => {
      const updatedFiles = [...prevFiles];
      setAudioList(updatedFiles); // Atualiza o componente pai com a lista atualizada
      return updatedFiles;
    });
  };

  // Função para cancelar a gravação e remover o último áudio gravado
  const cancelRecording = () => {
    mediaRecorder?.stop();
    stream?.getTracks().forEach((track) => track.stop());
    setIsRecording(false);
    setRecordingTime(0);

    // Remove o último áudio da lista de URLs e arquivos
    setAudioURLs((prevURLs) => prevURLs.slice(0, -1));
    setAudioFiles((prevFiles) => prevFiles.slice(0, -1));
  };

  // Função para deletar um áudio específico
  const deleteRecording = (url: string, index: number) => {
    setAudioURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));
    setAudioFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setAudioList(audioFiles.filter((_, i) => i !== index)); // Atualiza a lista de áudios no componente pai
  };

  return (
    <div className="flex flex-col items-start w-full">
      {/* Exibir a lista de URLs de áudio */}
      {audioURLs.length > 0 && (
        <div className="flex flex-col items-center mt-4 w-full">
          {audioURLs.map((url, index) => (
            <div
              key={index}
              className="flex items-center w-full justify-between mb-2 gap-4"
            >
              <AudioPlayer src={url} isDisabled={isRecording} />
              <button
                className="bg-red-600 text-white flex items-center p-2 rounded-full text-[1.125rem] leading-[1.5rem] disabled:opacity-35"
                onClick={() => deleteRecording(url, index)}
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
          className="bg-[#181A1880] text-white flex gap-2 items-center pt-2 pb-2 pl-4 pr-4 rounded-full text-[1.125rem] leading-[1.5rem]"
          onClick={startRecording}
        >
          <BsFillMicFill fill="white" size={"21px"} /> Áudio
        </button>
      ) : (
        <div className="flex items-center w-full">
          <div className="flex gap-4 justify-between items-center w-full pl-2">
            <button
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
