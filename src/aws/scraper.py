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
        # use the python requests package to retrieve the website contents
        html = requests.get(url, headers=self.headers).text

        #init BeautifulSoup and find all p tags
        soup = BeautifulSoup(html, "html.parser")
        data = soup.find_all('p')

        # Write a regex pattern that matches all substrings which start and end with < >
        pat = re.compile(r'<.*?>')
        # Substitute all matches for the above pattern with an empty string (deleting them)
        ret = [re.sub(pat, '', str(d)) for d in data]
        # Re-join the parts together to form a single string
        ret = ". ".join(ret)

        # A regex pattern to match all substrings that start and end with { }, and then delete them
        ret = re.sub(r'\{(.*?)\}', '', ret)

        # A regex pattern that matches all sentences, where a sentence starts with a 
        # capital letter, ends with a punctuation mark, and contains at least one non-punctuation character
        # the [^ ] block ensures that there is a non-whitespace character before the punctuation
        pattern = re.compile(r'([A-Z][^\.!?]*[^ ][\.!?])', re.M)
        # Find all sentences based on the above pattern
        sentences = pattern.findall(ret)
        ret = " ".join(sentences)

        #Remove all sentences which are exactly 1 word
        ret = re.sub(r'([A-Z][^ \.!?]+[\.!?])', '', ret)
        return ret