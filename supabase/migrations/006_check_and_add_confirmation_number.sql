-- Check if confirmation_number column exists, if not add it
-- This script is safe to run multiple times (idempotent)

-- Step 1: Check if column exists
DO $$
BEGIN
    -- Check if column already exists
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'confirmation_number'
    ) THEN
        -- Column doesn't exist, add it
        ALTER TABLE orders 
        ADD COLUMN confirmation_number VARCHAR(50) UNIQUE;
        
        RAISE NOTICE '✅ Column confirmation_number added to orders table';
    ELSE
        RAISE NOTICE 'ℹ️ Column confirmation_number already exists';
    END IF;
END $$;

-- Step 2: Check if index exists, if not create it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM pg_indexes 
        WHERE tablename = 'orders' 
        AND indexname = 'idx_orders_confirmation_number'
    ) THEN
        CREATE INDEX idx_orders_confirmation_number ON orders(confirmation_number);
        RAISE NOTICE '✅ Index idx_orders_confirmation_number created';
    ELSE
        RAISE NOTICE 'ℹ️ Index idx_orders_confirmation_number already exists';
    END IF;
END $$;

-- Step 3: Verify the setup
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'orders' 
AND column_name = 'confirmation_number';

-- If the query above returns a row, the column exists! ✅

