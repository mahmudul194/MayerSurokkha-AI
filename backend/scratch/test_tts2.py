import urllib.request
import urllib.parse
import textwrap

text = "দুঃখিত, আমি আপনার ব্যক্তিগত ড্যাশবোর্ড বা অ্যাকাউন্টের কোনো তথ্য সরাসরি দেখতে পারি না। আমি একটি কৃত্রিম বুদ্ধিমত্তা (AI), তাই আপনার প্রোফাইলে থাকা কোনো ব্যক্তিগত স্বাস্থ্য তথ্য বা তারিখ আমার দেখার সুযোগ নেই। তবে আপনি যদি আমাকে নিচের যেকোনো একটি তথ্য এখানে লিখে দেন, তাহলে আমি এখনই আপনার গর্ভাবস্থার সপ্তাহ হিসেব করে দিতে পারব: ১. আপনার **শেষ মাসিকের (LMP)** প্রথম দিনটি কবে ছিল? ২. অথবা, ডাক্তার আপনাকে **সম্ভাব্য প্রসবের তারিখ (Due Date)** কী দিয়েছেন? এই তথ্যগুলোর যেকোনো একটি দিলে আমি আপনাকে সঠিক সপ্তাহটি বলে দিতে পারব।"
language = "bn"

chunks = textwrap.wrap(text, width=150, break_long_words=False)
full_audio = b""

for chunk in chunks:
    url = f"https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl={language}&q={urllib.parse.quote(chunk)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        response = urllib.request.urlopen(req)
        print(f"Chunk success: {len(response.read())} bytes")
    except Exception as e:
        print("Chunk error:", e, url)
