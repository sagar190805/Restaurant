import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY || '' });

// Rule-based fallback
const ruleBasedMatcher = async (message) => {
  const lowerMsg = message.toLowerCase();
  const settings = await prisma.setting.findFirst();

  if (lowerMsg.includes('where is my order') || lowerMsg.includes('status')) {
    return "I can help with that. Please provide your Order ID.";
  }
  if (lowerMsg.includes('time') || lowerMsg.includes('open')) {
    return `We are currently ${settings?.isOpen ? 'open' : 'closed'}.`;
  }
  if (lowerMsg.includes('menu') || lowerMsg.includes('food')) {
    return "You can view our menu on the home page! We have Starters, Main Course, and Breads.";
  }
  return "I'm a simple bot. I can answer questions about timings, menu, or order status. For anything else, please ask to speak to a human.";
};

export const LlmProvider = {
  async processMessage(sessionId, message) {
    if (!process.env.ANTHROPIC_API_KEY) {
      return await ruleBasedMatcher(message);
    }

    // In a full implementation, we would maintain conversation history.
    // For MVP, we provide context and tools.
    const settings = await prisma.setting.findFirst();
    const categories = await prisma.category.findMany({ include: { items: true } });
    const menuContext = categories.map((c) => `${c.name}: ${c.items.map((i) => i.name).join(', ')}`).join('\n');

    try {
      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 300,
        system: `You are a helpful assistant for ${settings?.restaurantName}. Menu: ${menuContext}. We are ${settings?.isOpen ? 'open' : 'closed'}.`,
        messages: [{ role: "user", content: message }]
      });
      return response.content[0].text;
    } catch (e) {
      console.error(e);
      return await ruleBasedMatcher(message);
    }
  }
};