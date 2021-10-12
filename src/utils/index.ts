import * as rdr from "../utils/diceRollers/rpgDiceRoller";

import moduleLogger from "./logger";

export const isAllNotNull = (...params: any[]): boolean => {
  return params.findIndex((item) => item === undefined || item === null) === -1;
};

export const logger = moduleLogger;

export const rpgDiceRoller = rdr;
