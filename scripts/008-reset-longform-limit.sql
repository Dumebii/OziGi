-- Reset long-form generation limit for test user
-- This removes the rate limit key from Upstash Redis
-- User: okolodumebi@gmail.com (9b0cb5a9-9e17-48f4-b148-12527222ffb8)

-- Note: The long-form rate limit is stored in Upstash Redis, not in Supabase
-- The key format is: "longform:org:{user_id}"
-- This script removes that key to reset the 5-per-day limit

SELECT 'Long-form limit is tracked in Upstash Redis, not in Supabase' as note;
SELECT 'User ID: 9b0cb5a9-9e17-48f4-b148-12527222ffb8' as user_id;
SELECT 'To reset: Execute this command in Upstash Redis Console:' as instruction;
SELECT 'DEL longform:org:9b0cb5a9-9e17-48f4-b148-12527222ffb8' as redis_command;
