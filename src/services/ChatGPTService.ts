import { StorageService } from './supabase/storageService';

export const ChatGPTService = {

    async parseExcelFromSupabaseWithChatGPT(path: string) {
        const blob = await StorageService.getExcelFileFromStorage(path);

        const fileId = await this.uploadExcelToOpenAI(blob, path);
        const parsed = await this.requestChatGPTToParse(fileId);
        console.log(parsed);

        return parsed; // Will be a JSON string (or an array of ITransaction objects)
    },


    async uploadExcelToOpenAI(fileBlob: Blob, path: string): Promise<string> {
        const formData = new FormData();
        formData.append('file', new File([fileBlob], path));
        formData.append('purpose', 'assistants');

        const response = await fetch('https://api.openai.com/v1/files', {
            method: 'POST',
            headers: {
            },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || 'Upload failed');
        return result.id; // file_id
    },

    async requestChatGPTToParse(fileId: string): Promise<any> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-2024-04-09',
                messages: [
                    {
                        role: 'user',
                        content: `Please read the attached Excel file and return the data as an array of TypeScript objects of the following interface:

interface ITransaction {
  source?: string;
  transactionType?: TransactionType;
  date: string;
  vendor: string;
  amount: number;
  type?: string;
  details?: string;
  billedAmount: number;
  category?: string;
}`,
                    },
                ],
                tools: [{type: 'code_interpreter'}],
                tool_choice: 'auto',
                file_ids: [fileId],
            }),
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || 'ChatGPT failed');
        return result.choices[0].message.content;
    },

    async requestChatGPTToParseFromJson(jsonData: any[]): Promise<any> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-4-turbo-2024-04-09',
                messages: [
                    {
                        role: 'user',
                        content: `Please convert the following raw transaction data into an array of TypeScript objects that follow this interface:

interface ITransaction {
  source?: string;
  transactionType?: TransactionType;
  date: string;         // ISO format
  vendor: string;       // Merchant
  amount: number;       // Original amount
  type?: string;        // Transaction type, e.g., עסקה רגילה
  details?: string;     // Optional details
  billedAmount: number; // Final charged amount
  category?: string;
}

Here is the raw data: 
\`\`\`json
${JSON.stringify(jsonData, null, 2)}
\`\`\`

Return a valid JSON array that matches the interface exactly.`,
                    },
                ],
            }),
        });

        const result = await response.json();
        console.log(result.choices[0].message.content); // ← your typed array

    }
}
