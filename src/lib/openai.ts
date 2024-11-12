import OpenAI from 'openai';
import { parseCommand } from './commandParser';
import { useDataStore } from './dataManager';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

interface DashboardContext {
  selectedUnit: string | null;
  unitData: any;
  financeData: any;
  salesData: any;
  productData: any;
  recentEvents: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

function getUnitSpecificData(unit: string | null, context: DashboardContext): string {
  if (!unit) return '';

  switch (unit) {
    case 'finance':
      return `
Current Balance: $${context.financeData.balance}
Money In: $${context.financeData.moneyIn.total} (${(context.financeData.moneyIn.trend * 100).toFixed(1)}% trend)
Money Out: $${context.financeData.moneyOut.total} (${(context.financeData.moneyOut.trend * 100).toFixed(1)}% trend)
Recent Transactions:
${context.financeData.moneyIn.recentTransactions.map(t => `- Income: $${t.amount} from ${t.name}`).join('\n')}
${context.financeData.moneyOut.recentTransactions.map(t => `- Expense: $${t.amount} for ${t.name}`).join('\n')}`;

    case 'sales':
      return `
Total Revenue: $${context.salesData.totalRevenue}
Leads: ${context.salesData.leads.count} (${(context.salesData.leads.trend * 100).toFixed(1)}% trend)
Meetings: ${context.salesData.meetings.count} (${(context.salesData.meetings.trend * 100).toFixed(1)}% trend)
Deals: ${context.salesData.deals.count} (${(context.salesData.deals.trend * 100).toFixed(1)}% trend)
Recent Activity:
${context.salesData.leads.recent.map(l => `- New Lead: ${l.name} from ${l.company}`).join('\n')}
${context.salesData.meetings.upcoming.map(m => `- Meeting: ${m.name} from ${m.company} at ${m.time}`).join('\n')}
${context.salesData.deals.recent.map(d => `- Deal: ${d.name} with ${d.company} for $${d.value}`).join('\n')}`;

    case 'product':
      return `
Active Projects: ${context.productData.metrics.activeProjects}
Proposals: ${context.productData.metrics.proposals}
Efficiency: ${context.productData.metrics.efficiency}%
Projects:
${context.productData.projects.map(p => `- ${p.name} (${p.status})\n  Modules: ${p.modules.join(', ')}`).join('\n')}`;

    default:
      return '';
  }
}

export async function getAIResponse(
  message: string,
  context: DashboardContext
): Promise<string> {
  try {
    // First, try to parse as a command
    const commandResult = parseCommand(message);
    if (commandResult.success) {
      commandResult.action?.();
      return commandResult.message;
    }

    const unitSpecificData = getUnitSpecificData(context.selectedUnit, context);
    
    const systemPrompt = `You are an AI assistant monitoring a real-time dashboard with the following units:
- Product Unit: Manufacturing and production metrics
- Sales Unit: Sales performance and pipeline
- Finance Unit: Financial metrics and transactions

You can modify data using these commands:
- Add income/expense: "add income/expense [amount] for [name]"
- Add lead: "add lead [name] from [company]"
- Schedule meeting: "schedule meeting with [name] from [company] at [time]"
- Add deal: "add deal [name] with [company] for $[amount]"
- Add project: "add project [name] with modules [module1, module2, ...]"
- Remove commands follow similar patterns

${context.selectedUnit ? `Currently focused on: ${context.selectedUnit} unit

${unitSpecificData}` : 'No specific unit selected.'}

Recent Events:
${context.recentEvents.map(e => `- ${e.description} (${e.timestamp})`).join('\n')}

Provide concise, data-driven insights based on the current state and user queries.
If the user wants to modify data, suggest using one of the available commands.
Focus on actionable recommendations and trend analysis.
Always reference specific numbers from the context when discussing metrics.
Keep responses brief but informative.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      temperature: 0.7,
      max_tokens: 200,
      stream: false
    });

    return completion.choices[0].message.content || 
      "I apologize, but I couldn't analyze the data at this moment. Please try again.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "I encountered an error while analyzing the data. Please try again in a moment.";
  }
}