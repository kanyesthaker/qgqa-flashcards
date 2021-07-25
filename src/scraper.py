import re 
import requests
from bs4 import BeautifulSoup
from bs4.element import Comment

class Scraper:
    def __init__(self):
        self.headers = {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36'}

    def tag_visible(self, element):
        if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
            return False
        if isinstance(element, Comment):
            return False
        return True

    def get_text(self, url):
        html = requests.get(url, headers=self.headers).text
        soup = BeautifulSoup(html, "html.parser") 
        # data = soup.findAll(text=True) 
        for script in soup.find_all('script'):
            script.decompose()
        data=soup.get_text().split('\n')
        cleaned=[s for s in data if s]
        return ". ".join(cleaned)

def __main__():
    url = "https://www.ibm.com/cloud/learn/natural-language-processing"
    scraper = Scraper()
    scraper.get_text(url)

__main__()
