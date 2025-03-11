from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
import pandas as pd
import os
import re
import time
import json
from utils import convert_url

# Variables
SCREENSHOTS_PATH = "./screenshots"

# Reading from hosts file
with open('./data/hosts.txt') as file:
    websites = list(filter(lambda line: not line.lstrip().startswith("*"), map(str.strip, file)))

# Loading selectors from JSON
with open("./data/selectors.json", "r") as f:
    selectors = json.load(f)

# Creating dataframe object
df = pd.DataFrame()

# Cleans up newlines from array
websites = list(filter(None, map(lambda x:x.strip(), websites)))
df['website'] = websites

# Start time
start_time = time.perf_counter()

# Init crawling
with sync_playwright() as p:
    browser = p.firefox.launch(headless=True)

    # Website title array
    description = []
    html = []
    details = []

    # Retrieve from each site
    for site in websites:
        try:
            context = browser.new_context()
            page = browser.new_page()

            stealth_sync(page)

            # Waits for main selector to be available
            page.goto(site, wait_until="domcontentloaded")
            page.wait_for_load_state("networkidle")
            page.evaluate("window.scrollTo(0, document.body.scrollHeight)") # Triggers any lazy loaded stuff

            # Screenshots
            screenshot_name = re.sub(r'[\/:*?"<>|]', '_', site)
            screenshot_path = os.path.join(SCREENSHOTS_PATH, f"{screenshot_name}.png")
            page.screenshot(path=screenshot_path)

            # Pushes title to array
            job_list = page.wait_for_selector(selectors[site]['wait_for'])
            job_items = job_list.query_selector_all("li")
            
            for job in job_items:
                job_url_element = job.query_selector(selectors[site]['url_class'])
                job_url = job_url_element.get_attribute("href") if job_url_element else None

                details.append({
                    "title": job.query_selector(selectors[site]['title_class']).inner_text() if selectors[site]['title_class'] else "N/A",
                    "type": job.query_selector(f'xpath={selectors[site]['type_xpath']}').inner_text() if selectors[site]['type_class'] else "N/A",
                    "team": job.query_selector(f'xpath={selectors[site]['team_xpath']}').inner_text() if selectors[site]['team_class'] else "N/A",
                    "location": job.query_selector(f'xpath={selectors[site]['location_xpath']}').inner_text() if selectors[site]['location_class'] else "N/A",
                    "url": convert_url(selectors[site]['url_prefix'], selectors[site]['url_regex'], job_url) if job_url else "N/A"
                })
            #description.append(job_list.inner_text())
            #html.append(page.content())

            # Finished with page
            page.close()
        except Exception as error:
            print(f"Failed to scrape {site}: {error}")
            import traceback
            print("Error occurred:", error)
            traceback.print_exc()
            description.append(f"{error}")
            html.append(f"{error}")

# Update DataFrame
#df['description'] = description
#df['html'] = html
job_df = pd.DataFrame(details)

# Create Excel
#df.to_excel("./output/output.xlsx", sheet_name="HTML")
job_df.to_excel("./output/output.xlsx", sheet_name="HTML", index=False)

elapsed = time.perf_counter() - start_time
print(f"Runtime: {elapsed}")