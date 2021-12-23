import {
  blue,
  cyan,
  geekblue,
  gold,
  green,
  grey,
  lime,
  magenta,
  orange,
  purple,
  red,
  volcano,
  yellow
} from "@ant-design/colors";

export const colors = {
  red,
  volcano,
  orange,
  gold,
  yellow,
  lime,
  green,
  cyan,
  blue,
  geekblue,
  purple,
  magenta,
  grey
};

export const defaultColorsList = [
  blue,
  geekblue,
  purple,
  magenta,
  cyan,
  red,
  volcano,
  orange,
  gold,
  yellow,
  lime,
  green
];

export const getNextColor = (colorIndex, colorsList = defaultColorsList) => {
  const color = colorsList[colorIndex];
  let nextColorIndex = colorIndex;

  if (colorsList[colorIndex + 1]) {
    nextColorIndex += 1;
  } else {
    nextColorIndex = 0;
  }

  return { colorIndex: nextColorIndex, color };
};
