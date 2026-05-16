import urllib.request

url = "https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl=bn&q=%E0%A6%95%E0%A7%8B%E0%A6%A8%E0%A7%8B"
try:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    res = urllib.request.urlopen(req)
    print("GTX Success:", res.getcode())
except Exception as e:
    print("GTX Error:", e)

url2 = "https://translate.google.com/translate_tts?ie=UTF-8&q=%E0%A6%95%E0%A7%8B%E0%A6%A8%E0%A7%8B&tl=bn&client=tw-ob"
try:
    req2 = urllib.request.Request(url2, headers={'User-Agent': 'Mozilla/5.0'})
    res2 = urllib.request.urlopen(req2)
    print("TW-OB Success:", res2.getcode())
except Exception as e:
    print("TW-OB Error:", e)
