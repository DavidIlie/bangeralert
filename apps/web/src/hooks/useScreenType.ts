import { useMediaQuery } from "@mantine/hooks";

export const useScreenType = () => {
  const is3Cols = useMediaQuery("(min-width: 1336px)");
  const is2Cols = useMediaQuery("(min-width: 1265px)");
  const is1Cols = useMediaQuery("(min-width: 800px)");

  if (is3Cols) {
    return "3-cols";
  }
  if (is2Cols) {
    return "2-cols";
  }
  if (is1Cols) {
    return "1-cols";
  }

  return "fullscreen";
};
