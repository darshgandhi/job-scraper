import asyncio
from asyncio import timeout
from playwright.async_api import async_playwright
from undetected_playwright import Malenia
from supabase import create_client, Client
from dotenv import load_dotenv
from urllib.parse import urlparse
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


async def scrape_page(job_elements, site, site_details):
    for job in job_elements:
        job_details = {"source": site}

        # URL
        if selectors[site].get('url_xpath'):
            job_url_element = await job.query_selector(selectors[site]['url_xpath'])
            if job_url_element:
                job_href = await job_url_element.get_attribute("href")
                job_base_url = urlparse(site)
                job_url = job_base_url.scheme + "://" + job_base_url.netloc + job_href
                job_details["url"] = job_url

        # Title
        if selectors[site].get('title_xpath'):
            title_element = await job.query_selector(selectors[site]['title_xpath'])
            job_details["title"] = await title_element.inner_text() if title_element else "N/A"

        # Job Type
        if selectors[site].get('type_xpath'):
            type_element = await job.query_selector(selectors[site]['type_xpath'])
            job_details["job_type"] = await type_element.inner_text() if type_element else "N/A"

        # Location
        if selectors[site].get('location_xpath'):
            location_element = await job.query_selector(selectors[site]['location_xpath'])
            job_details["location"] = await location_element.inner_text() if location_element else "N/A"

        site_details.append(job_details)


async def scrape_site(site, browser):
    try:
        if site not in selectors:
            print(f"No selectors found for {site}, skipping")
            return []

        context = await browser.new_context(locale="en-US")
        await Malenia.apply_stealth(context)
        page = await context.new_page()

        await page.goto(site, wait_until="domcontentloaded")
        await page.wait_for_load_state("networkidle")
        # await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.screenshot(path=os.path.join(SCREENSHOTS_PATH, f"{re.sub(r'[\/:*?"<>|]', '_', site)}.png"))

        site_details = []
        while True:
            # Get job list elements
            job_list = await page.wait_for_selector(selectors[site]['wait_for'], timeout=100000, state='visible')
            job_elements = await job_list.query_selector_all(selectors[site]['job_elements'])

            # scrape page and then check for next page
            await scrape_page(job_elements, site, site_details)

            # no pagination xpath, break
            if not selectors[site].get('pagination_xpath'):
                break

            pagination = await page.query_selector(selectors[site].get('pagination_xpath'))

            # no next pagination element in document, break
            if not pagination:
                break

            # click to next page
            await pagination.click()

        await context.close()
        return site_details

    except Exception as e:
        print(f"Failed to scrape {site}: {e}")
        return []


async def main():
    async with async_playwright() as p:

        browser = await p.chromium.launch(headless=False)
        tasks = [scrape_site(site, browser) for site in websites]
        results = await asyncio.gather(*tasks)
        global details
        details = [item for sublist in results for item in sublist]
        await browser.close()

    job_df = pd.DataFrame(details)
    job_df.to_excel("./output/output.xlsx", sheet_name="HTML", index=False)
    print(f"Runtime: {time.perf_counter() - start_time:.2f} seconds")

    if not job_df.empty:
        existing_urls = []
        response = supabase.table('jobs').select('url').execute()
        if hasattr(response, 'data'):
            existing_urls = [job['url'] for job in response.data]
            print(f"Found {len(existing_urls)} existing job URLs in database")

        print(job_df)
        new_jobs_df = job_df[~job_df['url'].isin(existing_urls)]
        print(f"Found {len(new_jobs_df)} new jobs to insert (out of {len(job_df)} total)")

        if not new_jobs_df.empty:
            new_jobs_df['company_id'] = new_jobs_df.get('company_id', None)
            new_jobs_df['description'] = new_jobs_df.get('description', "N/A")

            job_records = new_jobs_df.to_dict(orient='records')
            if job_records:
                response = supabase.table('jobs').insert(job_records).execute()
                print(f"Successfully inserted {len(job_records)} new jobs!")
            else:
                print("No new jobs to insert")
        else:
            print("All jobs are already in the database")
    else:
        print("No jobs found to insert into database.")


if __name__ == "__main__":
    asyncio.run(main())
