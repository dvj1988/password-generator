import {
  DEFAULT_CONFIG,
  LOWER_CASE_CHARACTERS,
  SYMBOLS,
  UPPER_CASE_CHARACTERS,
} from "../constants";

type ConfigType = {
  uppercase: boolean;
  lowercase: boolean;
  symbols: string[];
  length: number;
};

export const saveConfigToLocalStorage = (config: ConfigType) => {
  localStorage.setItem("config", JSON.stringify(config));
};

export const getConfigFromLocalStorage = (): ConfigType => {
  const configInLS = localStorage.getItem("config");

  if (!configInLS) {
    return DEFAULT_CONFIG;
  }

  try {
    const config = JSON.parse(configInLS);
    return config;
  } catch {
    return DEFAULT_CONFIG;
  }
};

const randomNumberBetween = (max: number, min: number = 0) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const generateRandomPassword = ({
  uppercase,
  lowercase,
  symbols,
  length,
}: {
  uppercase: boolean;
  lowercase: boolean;
  symbols: string[];
  length: number;
}) => {
  const inputCharacterArrays = [];
  if (lowercase) {
    inputCharacterArrays.push(LOWER_CASE_CHARACTERS);
  }

  if (uppercase) {
    inputCharacterArrays.push(UPPER_CASE_CHARACTERS);
  }

  if (symbols.length) {
    inputCharacterArrays.push(symbols);
  }

  if (inputCharacterArrays.length === 0) {
    throw new Error("No Characters selected");
  }

  const password = [];
  const mandatoryCharacters = inputCharacterArrays.length;
  const restOfCharacters = length - mandatoryCharacters;
  const numberOfCharacterTypes = inputCharacterArrays.length;

  for (let i = 0; i < mandatoryCharacters; i++) {
    const numberOfCharactersInType = inputCharacterArrays[i].length;
    const randomIndex = randomNumberBetween(numberOfCharactersInType);
    password.push(inputCharacterArrays[i][randomIndex]);
  }

  for (let i = 0; i < restOfCharacters; i++) {
    const randomCharacterArrayTypeIndex = randomNumberBetween(
      numberOfCharacterTypes
    );
    const numberOfCharactersInType =
      inputCharacterArrays[randomCharacterArrayTypeIndex].length;
    const randomIndex = randomNumberBetween(numberOfCharactersInType);
    password.push(
      inputCharacterArrays[randomCharacterArrayTypeIndex][randomIndex]
    );
  }

  return password.join("");
};
