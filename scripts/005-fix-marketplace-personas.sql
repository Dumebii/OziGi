-- Add order_index column if it doesn't exist
ALTER TABLE marketplace_personas 
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- Update order_index for existing personas
UPDATE marketplace_personas
SET order_index = CASE name
  WHEN 'Battle-Tested Engineer' THEN 1
  WHEN 'DevRel Champion' THEN 2
  WHEN 'Technical Founder' THEN 3
  WHEN 'Community Builder' THEN 4
  WHEN 'Product Mapper' THEN 5
  WHEN 'Data Storyteller' THEN 6
  WHEN 'Thought Leader' THEN 7
  WHEN 'Technical Writer' THEN 8
  ELSE 99
END
WHERE order_index = 0;
