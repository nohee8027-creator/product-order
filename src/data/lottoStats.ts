/**
 * Mock historical frequency data for Korean Lotto (1-45).
 * In a real-world app, this would be fetched from an official API.
 * Values are representative of common frequency patterns.
 */
export const LOTTO_HISTORICAL_FREQUENCY: Record<number, number> = {
  1: 184, 2: 172, 3: 170, 4: 175, 5: 168,
  6: 165, 7: 173, 8: 162, 9: 145, 10: 169,
  11: 174, 12: 178, 13: 181, 14: 170, 15: 164,
  16: 166, 17: 183, 18: 184, 19: 165, 20: 174,
  21: 173, 22: 154, 23: 155, 24: 172, 25: 160,
  26: 176, 27: 183, 28: 166, 29: 154, 30: 161,
  31: 173, 32: 154, 33: 180, 34: 188, 35: 167,
  36: 164, 37: 171, 38: 171, 39: 175, 40: 176,
  41: 153, 42: 168, 43: 188, 44: 170, 45: 171
};

export const getFrequency = (num: number) => LOTTO_HISTORICAL_FREQUENCY[num] || 0;
