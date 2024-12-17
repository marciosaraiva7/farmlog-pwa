import { useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

interface AudioPlayerProps {
  src: string;
  isDisabled?: boolean;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, isDisabled }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setCurrentTime(audio.currentTime);
  };

  const handleLoadedMetadata = () => {
    const audio = audioRef.current;
    if (!audio) return;

    setDuration(audio.duration);
  };

  return (
    <div className="w-full flex items-center space-x-4 p-2">
      <button
        onClick={togglePlayPause}
        disabled={isDisabled}
        className=" flex p-[10px] items-center justify-center bg-[#181A18] text-white rounded-full focus:outline-none disabled:opacity-35"
      >
        {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
      </button>
      <div className="flex-grow">
        <div className="w-full bg-gray-300 rounded-full h-2.5">
          <div
            className="bg-[#EAC00F] h-2.5 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          ></div>
        </div>
      </div>
      <div className="text-[1rem] leading-[1.313rem] font-bold text-[#181A18]">
        {formatTime(currentTime)}
      </div>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="hidden"
      />
    </div>
  );
};

export default AudioPlayer;
