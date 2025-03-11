from playwright.sync_api import sync_playwright
from playwright_stealth import stealth_sync
import pandas as pd
import os

# Variables
SCREENSHOTS_PATH = "screenshots"

# Reading from hosts file
with open('hosts.txt') as file:
    websites = file.readlines()

# Creating dataframe object
df = pd.DataFrame()

# Cleans up newlines from array
websites = list(filter(None, map(lambda x:x.strip(), websites)))
df['website'] = websites

# Init crawling
with sync_playwright() as p:
    browser = p.firefox.launch(headless=True)

    # Website title array
    description = []
    html = []

    # Retrieve from each site
    for site in websites:
        context = browser.new_context()
        page = browser.new_page()
        page.goto("https://" + site)

        stealth_sync(page)

        # Waits for main selector to be available
        page.wait_for_load_state("networkidle")
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)") # Triggers any lazy loaded stuff

        screenshot_path = os.path.join(SCREENSHOTS_PATH, f"{site}.png")
        page.screenshot(path=screenshot_path)

        # Pushes title to array
        description.append(page.title())
        html.append(page.content())

        # Finished with page
        page.close()

# Prints items that were retrieved
print(description)
print(html)

# Update DataFrame
df['description'] = description
df['html'] = html

# Create Excel
df.to_excel("output.xlsx", sheet_name="HTML")