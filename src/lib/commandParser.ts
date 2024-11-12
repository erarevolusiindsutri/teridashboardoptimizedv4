import { useDataStore } from './dataManager';

interface CommandResult {
  success: boolean;
  message: string;
  action?: () => void;
}

export function parseCommand(command: string): CommandResult {
  const lowerCommand = command.toLowerCase();

  // Add income/expense with description
  const addMoneyMatch = lowerCommand.match(/add (income|expense|today'?s money in) (\d+)(?:\s+(?:usd|for|of))?\s*([\w\s]+)?/i);
  if (addMoneyMatch) {
    const [_, type, amount, description = 'daily revenue'] = addMoneyMatch;
    const transactionType = type === 'expense' ? 'out' : 'in';
    const numericAmount = Number(amount);
    
    if (isNaN(numericAmount)) {
      return {
        success: false,
        message: "Please provide a valid numeric amount."
      };
    }

    return {
      success: true,
      message: `Adding ${transactionType === 'in' ? 'income' : 'expense'} of $${amount} for ${description}`,
      action: () => {
        const dataStore = useDataStore.getState();
        dataStore.addTransaction(
          transactionType,
          {
            name: description,
            amount: numericAmount,
            date: new Date().toISOString().split('T')[0]
          }
        );
      }
    };
  }

  return {
    success: false,
    message: "I couldn't understand that command. Please try again with a different format."
  };
}