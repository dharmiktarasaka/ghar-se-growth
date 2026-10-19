import re

def sync():
    with open('assets/css/style.css', 'r', encoding='utf-8') as f:
        css = f.read()

    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    pattern = re.compile(r'(<style id="inline-brand-styles">)(.*?)(  </style>)', re.DOTALL)
    if not pattern.search(html):
        print("Error: Could not find <style id='inline-brand-styles'> block in index.html")
        return

    new_html = pattern.sub(rf'\1\n{css}\n\3', html)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(new_html)

    print("Successfully synchronized style.css into index.html!")

if __name__ == '__main__':
    sync()
