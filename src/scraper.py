import re 
import urllib.request 
from bs4 import BeautifulSoup
from bs4.element import Comment

class Scraper:
    def __init__(self):
        pass

    def tag_visible(self, element):
        if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]']:
            return False
        if isinstance(element, Comment):
            return False
        return True

    def get_text(self, url):
        html = urllib.request.urlopen(url).read()
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
