'use server';
/**
 * @fileoverview A sample flow that suggests an item from a menu.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const menuSuggestionFlow = ai.defineFlow(
  {
    name: 'menuSuggestionFlow',
    inputSchema: z.string().describe('The topic of the suggestion'),
    outputSchema: z.string().describe('The suggested item'),
  },
  async (prompt) => {
    const { output } = await ai.generate({
      prompt: `Suggest a menu item for a ${prompt}.`,
    });
    return output!;
  }
);
