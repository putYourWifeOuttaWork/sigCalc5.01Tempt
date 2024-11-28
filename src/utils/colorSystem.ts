// Color palette with sufficient variations for all combinations
const COLORS = [
  // Blues
  '#0176D3', '#014486', '#032D60', '#0D9DDA', '#0A7BAE', '#075982',
  // Purples
  '#2C119D', '#1E0C6B', '#100639', '#8B5CF6', '#7C3AED', '#6D28D9',
  // Greens
  '#10B981', '#059669', '#047857', '#84CC16', '#65A30D', '#4D7C0F',
  // Reds
  '#EF4444', '#DC2626', '#B91C1C', '#F87171', '#EF4444', '#DC2626',
  // Oranges
  '#F59E0B', '#D97706', '#B45309', '#FB923C', '#F97316', '#EA580C',
  // Pinks
  '#EC4899', '#DB2777', '#BE185D', '#F472B6', '#E879F9', '#C084FC',
  // Teals
  '#14B8A6', '#0D9488', '#0F766E', '#2DD4BF', '#14B8A6', '#0D9488',
  // Indigos
  '#6366F1', '#4F46E5', '#4338CA', '#818CF8', '#6366F1', '#4F46E5',
  // Yellows
  '#EAB308', '#CA8A04', '#A16207', '#FDE047', '#FACC15', '#EAB308',
  // Cyans
  '#06B6D4', '#0891B2', '#0E7490', '#22D3EE', '#06B6D4', '#0891B2',
  // Additional colors for more combinations
  '#9333EA', '#7E22CE', '#6B21A8', '#581C87', '#4C1D95', '#4338CA',
  '#2563EB', '#1D4ED8', '#1E40AF', '#1E3A8A', '#0369A1', '#0C4A6E'
];

class ColorSystem {
  private static instance: ColorSystem;
  private usedColors: Map<string, string> = new Map();
  private availableColors: string[] = [...COLORS];

  private constructor() {
    this.shuffle(this.availableColors);
  }

  public static getInstance(): ColorSystem {
    if (!ColorSystem.instance) {
      ColorSystem.instance = new ColorSystem();
    }
    return ColorSystem.instance;
  }

  private shuffle(array: string[]): void {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  getColor(key1: string, key2: string): string {
    const combinedKey = `${key1}-${key2}`;
    
    if (this.usedColors.has(combinedKey)) {
      return this.usedColors.get(combinedKey)!;
    }

    if (this.availableColors.length === 0) {
      this.availableColors = [...COLORS];
      this.shuffle(this.availableColors);
    }

    const color = this.availableColors.pop()!;
    this.usedColors.set(combinedKey, color);
    
    return color;
  }

  reset(): void {
    this.usedColors.clear();
    this.availableColors = [...COLORS];
    this.shuffle(this.availableColors);
  }

  // Get all currently used colors
  getUsedColors(): Map<string, string> {
    return new Map(this.usedColors);
  }
}

export const colorSystem = ColorSystem.getInstance();