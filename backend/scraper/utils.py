import re
def convert_url(url_prefix, url_regex, url_partial):
    match = re.search(url_regex, url_partial)
    if match:
        extracted_values = match.groupdict()
        url_postfix = url_prefix
        for key, value in extracted_values.items():
            url_postfix = url_postfix.replace(f'[{key}]', value)
        return url_postfix
    return