import requests
import urllib

if __name__=="__main__":
    src = "https://en.wikipedia.org/wiki/Ghoul"
    params = {"src":src}
    encoded = urllib.parse.urlencode(params)
    api=f"https://cbczedlkid.execute-api.us-west-2.amazonaws.com/test/generate?{encoded}"
    print(requests.get(api))
