// Remove the direct Supabase client initialization since we're using the API route
export interface QuizRecord {
  language: 'English' | 'Français';
  first_name: string;
  last_name: string;
  email: string;
  option_left: string;
  option_right: string;
  n_trials: number;
  result: 'left' | 'right' | 'unknown';
  source?: string;
}

export const logResult = async (record: QuizRecord) => {
  const response = await fetch('/api/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error('Failed to log result');
  }

  return response.json();
}; 