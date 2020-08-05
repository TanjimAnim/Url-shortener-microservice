# API Project: URL Shortener Microservice for freeCodeCamp

### User Stories

1. I can POST a URL and I will receive a shortened URL in the JSON response. For example `{"original Url":"https://www.google.com/","short Url":"OK_KBOxta"}`
2. If I pass an invalid URL that doesn't follow the valid `http(s)://www.example.com(/more/routes)` format, the JSON response will contain an error like `{"error":"invalid URL"}`.
3. When I visit the shortened URL, it will redirect me to my original link.

#### Usage:

1. Submit an url in the "Short Url Creation" and it would return the short url along with the original one.

2. Visit the shortened url and it will be redirected to the original link! For example:
   "https://url-shortener-mic.glitch.me/api/shorturl/OK_KBOxta"
