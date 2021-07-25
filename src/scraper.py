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
        data = soup.find_all('p')
        pat = re.compile(r'<.*?>')
        ret = [re.sub(pat, '', str(d)) for d in data]
        ret = ". ".join(ret)
        ret = re.sub(r'\{(.*?)\}', '', ret)
        pattern = re.compile(r'([A-Z][^\.!?]*[^ ][\.!?])', re.M)
        sentences = pattern.findall(ret)
        ret = " ".join(sentences)
        ret = re.sub(r'([A-Z][^ \.!?]+[\.!?])', '', ret)
        print(ret)
        return ret

def __main__():
    url = "https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html#deriving-the-simplest-policy-gradient"
    scraper = Scraper()
    print(scraper.get_text(url))

# __main__()
