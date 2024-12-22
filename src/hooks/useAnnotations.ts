import { useEffect, useState } from "react";

export const useAnnotations = (userId: string | undefined) => {
  const [annotations, setAnnotations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAnnotations = async () => {
      if (!userId) return;
      try {
        const response = await fetch(`/api/getAnnotations?ByUser=${userId}`);
        const data = await response.json();
        setAnnotations(data.reverse());
      } catch (error) {
        console.error("Failed to fetch annotations", error);
      }
    };
    fetchAnnotations();
  }, [userId]);

  return { annotations, isLoading, setIsLoading };
};
