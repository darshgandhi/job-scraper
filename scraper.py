from playwright.sync_api import sync_playwright

# Reading from hosts file
with open('hosts.txt') as file:
    websites = file.readlines()

# Cleans up newlines from array
websites = list(filter(None, map(lambda x:x.strip(), websites)))


# Init crawling
with sync_playwright() as p:
    browser = p.firefox.launch(headless=False, slow_mo=50)

    # Website title array
    description = []

    # Retrieve from each site
    for site in websites:
        page = browser.new_page()
        page.goto("https://" + site)

        # Waits for main selector to be available
        main = page.locator('main')
        main.wait_for()

        # Pushes title to array
        description.append(page.title())

        # Finished with page
        page.close()

# Prints items that were retrieved
print(description)

