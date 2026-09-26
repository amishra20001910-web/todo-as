const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!supabaseUrl) {
  console.error('[Supabase Config Error] SUPABASE_URL is not defined in backend-todo/.env.');
}

if (!supabaseKey) {
  console.warn(
    '\n⚠️  [Supabase Config Notice] SUPABASE_SERVICE_ROLE_KEY is currently empty in backend-todo/.env.\n' +
    '   Database operations require your Supabase service_role key.\n' +
    '   Retrieve it from: https://supabase.com/dashboard/project/wqxpdprcvhmogvjwpzhy/settings/api\n'
  );
}

// Client instance
const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseKey || 'placeholder-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

/**
 * Check if the backend is configured with a Supabase key.
 */
const checkDatabaseConfig = () => {
  if (!supabaseKey || supabaseKey === 'placeholder-key') {
    const error = new Error(
      'Database configuration error: SUPABASE_SERVICE_ROLE_KEY is missing in backend-todo/.env. ' +
      'Please retrieve your secret service_role key from your Supabase Dashboard (Settings > API) and paste it into backend-todo/.env.'
    );
    error.statusCode = 500;
    throw error;
  }
};

module.exports = {
  supabase,
  checkDatabaseConfig,
};
