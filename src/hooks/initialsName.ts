import { useMemo } from "react";

const useInitials = (fullName: string) => {
  const initials = useMemo(() => {
    if (!fullName) return "";

    const nameParts = fullName
      .trim()
      .split(" ")
      .filter((part) => part !== "");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase(); // Apenas a inicial do único nome
    }

    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();

    return `${firstInitial}${lastInitial}`;
  }, [fullName]);

  return initials;
};

export default useInitials;
