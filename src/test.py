import requests
import urllib
import json

if __name__=="__main__":
    src = "https://en.wikipedia.org/wiki/Ghoul"
    params = {"src":src}
    encoded = urllib.parse.urlencode(params)
    headers = {'Accept': '*/*', 'Connection': 'keep-alive', 'User-Agent': 'Mozilla/5.0 (Windows NT 6.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36', 'Accept-Language': 'en-US;q=0.5,en;q=0.3', 'Cache-Control': 'max-age=0', 'Upgrade-Insecure-Requests': '1'}
    # api=f"https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/segment-text?{encoded}"
    data = requests.post("https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/generate-single", headers = headers, data={"ctx":"Ghoul (Arabic: \u063a\u0648\u0644\u200e, gh\u016bl) is a demon-like being or monstrous humanoid originating in pre-Islamic Arabian religion,[1] associated with graveyards and consuming human flesh. In modern fiction, the term has often been used for a certain kind of undead monster. By extension, the word ghoul is also used in a derogatory sense to refer to a person who delights in the macabre or whose profession is linked directly to death, such as a gravedigger or graverobber. Ghoul is from the Arabic \u063a\u064f\u0648\u0644 gh\u016bl, from \u063a\u064e\u0627\u0644\u064e gh\u0101la, \"to seize\". In Arabic, the term is also sometimes used to describe a greedy or"})
    # print(api)
    print(json.dumps(data.json()))
