import * as rpgDiceRoller from "rpg-dice-roller";

const engines = rpgDiceRoller.NumberGenerator.engines;
const generator = rpgDiceRoller.NumberGenerator.generator;

generator.engine = engines.nodeCrypto;

export const rollDice = (dice) => {
  const diceRoll = new rpgDiceRoller.DiceRoll(dice);
  return diceRoll.toString();
};
