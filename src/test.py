import requests
import urllib
import json

if __name__=="__main__":
    src = "https://en.wikipedia.org/wiki/Ghoul"
    params = {"src":src}
    encoded = urllib.parse.urlencode(params)
    api=f"https://cbczedlkid.execute-api.us-west-2.amazonaws.com/ferret-alpha/segment-text?{encoded}"
    print(api)
    print(json.dumps(requests.get(api).json()))
