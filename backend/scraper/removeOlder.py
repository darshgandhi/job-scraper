from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

# Calculate the date one month ago from current date
current_date = datetime(2025, 6, 22)
one_month_ago = current_date - timedelta(days=30)
cutoff_date = one_month_ago.strftime('%Y-%m-%d')

# Delete all records created before one month ago
response = supabase.table('jobs').delete().lt('created_at', cutoff_date).execute()
print(f"Deleted records: {response}")
