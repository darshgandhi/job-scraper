from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
from supabase import create_client, Client
from dotenv import load_dotenv
from utils import convert_url
import pandas as pd
import os
import re
import time
import json

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
SCREENSHOTS_PATH = "./screenshots"

with open('./data/hosts.txt') as file:
    websites = list(filter(lambda line: not line.lstrip().startswith("*") and line.strip(), map(str.strip, file)))

with open("./data/selectors.json", "r") as f:
    selectors = json.load(f)

os.makedirs(SCREENSHOTS_PATH, exist_ok=True)
os.makedirs("./output", exist_ok=True)

details = []
start_time = time.perf_counter()

with sync_playwright() as p:
    browser = p.firefox.launch(headless=True)

    for site in websites:
        try:
            if site not in selectors:
                print(f"No selectors found for {site}, skipping")
                continue
            
            context = browser.new_context()
            page = context.new_page()
            stealth_sync(page)
            
            page.goto(site, wait_until="domcontentloaded")
            page.wait_for_load_state("networkidle")
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
            
            page.screenshot(path=os.path.join(SCREENSHOTS_PATH, f"{re.sub(r'[\/:*?"<>|]', '_', site)}.png"))
            
            job_list = page.wait_for_selector(selectors[site]['wait_for'], timeout=10000)
            for job in job_list.query_selector_all("li"):
                job_details = {"source": site}
                
                # URL
                job_url = None
                if selectors[site].get('url_class'):
                    job_url_element = job.query_selector(selectors[site]['url_class'])
                    if job_url_element:
                        job_url = job_url_element.get_attribute("href")
                        url_prefix = selectors[site].get('url_prefix')
                        url_regex = selectors[site].get('url_regex')
                        if job_url and url_prefix and url_regex:
                            job_details["url"] = convert_url(url_prefix, url_regex, job_url)
                        else:
                            job_details["url"] = job_url
                job_details.setdefault("url", "N/A")
                
                # Title
                if selectors[site].get('title_class'):
                    title_element = job.query_selector(selectors[site]['title_class'])
                    job_details["title"] = title_element.inner_text() if title_element else "N/A"
                else:
                    job_details["title"] = "N/A"
                
                # Job Type
                if selectors[site].get('type_xpath'):
                    type_element = job.query_selector(f"xpath={selectors[site]['type_xpath']}")
                    job_details["job_type"] = type_element.inner_text() if type_element else "N/A"
                else:
                    job_details["job_type"] = "N/A"
                
                # Location
                if selectors[site].get('location_xpath'):
                    location_element = job.query_selector(f"xpath={selectors[site]['location_xpath']}")
                    job_details["location"] = location_element.inner_text() if location_element else "N/A"
                else:
                    job_details["location"] = "N/A"
                
                details.append(job_details)

            context.close()
        except Exception as e:
            print(f"Failed to scrape {site}: {e}")

job_df = pd.DataFrame(details)
job_df.to_excel("./output/output.xlsx", sheet_name="HTML", index=False)
print(f"Runtime: {time.perf_counter() - start_time:.2f} seconds")