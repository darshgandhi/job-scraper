import asyncio
from playwright.async_api import async_playwright
from supabase import create_client, Client
from dotenv import load_dotenv
import pandas as pd
from urllib.parse import urlparse
import os
import re
import time
import json
import time

load_dotenv()
supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
SCREENSHOTS_PATH = "./screenshots"
ROW_LIMIT = 500

with open('./data/hosts.txt') as file:
    websites = list(filter(lambda line: not line.lstrip().startswith("*") and line.strip(), map(str.strip, file)))

with open("./data/selectors.json", "r") as f:
    selectors = json.load(f)

os.makedirs(SCREENSHOTS_PATH, exist_ok=True)
os.makedirs("./output", exist_ok=True)

details = []
start_time = time.perf_counter()


async def scrape_page(page, job_elements, site, site_details):
    n = 0
    start_time_page = time.perf_counter()
    for job in job_elements:
        job_details = {"source": site}
        try:
            # Title
            if selectors[site].get('title_xpath'):
                title_element = await job.query_selector(selectors[site]['title_xpath'])
                job_details["title"] = await title_element.inner_text() if title_element else None
                title_text = await title_element.inner_text() if title_element else ""
                if selectors[site].get('type_xpath'):
                    type_element = await job.query_selector(selectors[site]['type_xpath'])
                    if type_element:
                        title_text = await type_element.inner_text()
                        if re.search(r"part[\s-]*time", title_text.lower()):
                            job_details["type"] = "Part-Time"
                        elif "internship" in title_text.lower():
                            job_details["type"] = "Internship"
                        elif "contract" in title_text.lower():
                            job_details["type"] = "Contract"
                        else:
                            job_details["type"] = "Full-Time"
                    else:
                        job_details["type"] = "Full-Time"
                else:   
                    if re.search(r"part[\s-]*time", title_text.lower()):
                        job_details["type"] = "Part-Time"
                    elif "internship" in title_text.lower():
                        job_details["type"] = "Internship"
                    elif "contract" in title_text.lower():
                        job_details["type"] = "Contract"
                    else:
                        job_details["type"] = "Full-Time"

            # Location
            if selectors[site].get('location_xpath'):
                location_element = await job.query_selector(selectors[site]['location_xpath'])
                location = await location_element.inner_text() if location_element else None
                job_details["location"] = location.replace("Location", "") if location else None

            # Company Name
            if selectors[site].get('company_xpath'):
                company_element = await job.query_selector(selectors[site]['company_xpath'])
                job_details["company_name"] = await company_element.inner_text() if company_element else None
            elif selectors[site].get('company_name'):
                job_details["company_name"] = selectors[site].get('company_name')

            # Department
            if selectors[site].get('department_xpath'):
                department_element = await job.query_selector(selectors[site]['department_xpath'])
                job_details["department"] = await department_element.inner_text() if department_element else None

            # Date Posted
            if selectors[site].get('date_xpath'):
                date_element = await job.query_selector(selectors[site]['date_xpath'])
                job_details["posted_at"] = await date_element.inner_text() if date_element else None

            # Salary
            if selectors[site].get('salary_xpath'):
                salary_element = await job.query_selector(selectors[site]['salary_xpath'])
                salary = await salary_element.inner_text() if salary_element else None
                job_details["salary"] = salary.replace('Salary: ', '') if salary else None

            # URL
            # Tab Page Type: Opens a new tab for each href url for the job type
            # In Page Type: Opens the job page in the same tab and goes back once scraped
            if selectors[site].get('url_xpath') and selectors[site].get('scrape_type') and selectors[site]['scrape_type'] == 'tab-page':
                job_url_element = page.locator(selectors[site]['url_xpath']).nth(n)
                if job_url_element:
                    try:
                        async with page.context.expect_page() as new_page_info:
                            await job_url_element.click(button="middle")

                        new_page = await new_page_info.value
                        
                        # Find the description
                        await new_page.locator(selectors[site]['description_xpath']).wait_for()
                        description = await new_page.locator(selectors[site]['description_xpath']).inner_text()

                        # Store
                        job_details["description"] = description
                        job_details['url'] = new_page.url
                    except Exception as e:
                        print("Error Loading Page")
                    finally:
                        await new_page.close()
            elif selectors[site].get('url_xpath') and selectors[site].get('scrape_type') and selectors[site]['scrape_type'] == 'in-page':
                    # Select job element url and click
                    temp_loc = page.locator(selectors[site]['url_xpath']).nth(n)

                    # Workaround, see https://github.com/microsoft/playwright/issues/21172
                    await temp_loc.dispatch_event('click')

                    # Find the description
                    await page.locator(selectors[site]['description_xpath']).wait_for()
                    description = await page.locator(selectors[site]['description_xpath']).inner_text()

                    # Store
                    job_details["url"] = page.url
                    job_details["description"] = description
                    await page.go_back()
            elif selectors[site].get('url_xpath'):
                job_url_element = await job.query_selector(selectors[site]['url_xpath'])
                if job_url_element:
                    job_href = await job_url_element.get_attribute("href")
                    job_base_url = urlparse(site)
                    job_url = job_base_url.scheme + "://" + job_base_url.netloc + job_href
                    job_details["url"] = job_url
                    
        except Exception as e:
            print(f"Error processing job: {e}")

        n += 1
        site_details.append(job_details)

    print(f"finished scraping page: {page.url}, runtime: {time.perf_counter() - start_time_page} seconds")


async def scrape_site(site, browser):
    try:
        if site not in selectors:
            print(f"No selectors found for {site}, skipping")
            return []

        context = await browser.new_context(locale="en-US")
        page = await context.new_page()

        await page.goto(site, wait_until="domcontentloaded")

        await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        await page.screenshot(path=os.path.join(SCREENSHOTS_PATH, f"{re.sub(r'[\/:*?"<>|]', '_', site)}.png"))

        site_details = []
        while True:
            # Get job list elements
            job_list = await page.wait_for_selector(selectors[site]['wait_for'], timeout=10000)

            # Wait for job elements to become available, compromise
            await page.locator(selectors[site]['job_elements']).nth(0).wait_for()
            job_elements = await job_list.query_selector_all(selectors[site]['job_elements'])

            # scrape page and then check for next page
            await scrape_page(page, job_elements, site, site_details)
            site_details = list({job['url']: job for job in site_details if job.get('url')}.values())
            print(len(site_details))
            # Row Limit for Site
            if len(site_details) >= ROW_LIMIT:
                print("Reached row limit")
                break

            # no pagination xpath, break
            if not selectors[site].get('pagination_xpath'):
                break

            pagination = await page.query_selector(selectors[site].get('pagination_xpath'))

            # no next pagination element in document, break
            if not pagination:
                print("BREAKING")
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

        # Checking and printing existing URLs in database
        if hasattr(response, 'data') and response.data:
            existing_urls = [job['url'] for job in response.data]
            print(f"Found {len(existing_urls)} existing job URLs in database")
            duplicate_jobs = job_df[job_df['url'].isin(existing_urls)]
            if not duplicate_jobs.empty:
                print(f"Duplicate URLs found:\n{duplicate_jobs['url'].tolist()}")

        # Inserting new jobs into database
        new_jobs_df = job_df[~job_df['url'].isin(existing_urls)]
        print(f"Found {len(new_jobs_df)} new jobs to insert (out of {len(job_df)} total)")

        if not new_jobs_df.empty:
            new_jobs_df = new_jobs_df.map(lambda x: None if pd.isnull(x) else x)

            # Deduplicate new_jobs_df based on 'url' before inserting
            new_jobs_df = new_jobs_df.drop_duplicates(subset=['url'], keep='last')

            job_records = new_jobs_df.to_dict(orient='records')
            if job_records:
                response = supabase.table('jobs').upsert(job_records, on_conflict=['url']).execute()
                print(f"Successfully inserted {len(job_records)} new jobs!")
            else:
                print("No new jobs to insert")
        else:
            print("All jobs are already in the database")
    else:
        print("No jobs found to insert into database.")


if __name__ == "__main__":
    asyncio.run(main())
