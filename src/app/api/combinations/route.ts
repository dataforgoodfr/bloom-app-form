import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Get existing combinations for this email
    const { data: records } = await supabase
      .from('records')
      .select('option_left, option_right')
      .eq('email', email);

    // Convert to set of combinations, ensuring consistent ordering
    const existingCombinations = new Set(
      records?.map(record => {
        // Sort the pair to ensure consistent ordering
        const pair = [record.option_left, record.option_right].sort();
        return JSON.stringify(pair);
      }) || []
    );

    return NextResponse.json({ 
      success: true, 
      existingCombinations: Array.from(existingCombinations)
    });
  } catch (error) {
    console.error('Error getting combinations:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get combinations' },
      { status: 500 }
    );
  }
} 