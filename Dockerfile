FROM nginx:1.25.0
RUN apt-get update && apt-get install -y npm
COPY demo/simple/ /usr/share/nginx/html/
COPY demo/simple/ /usr/share/nginx/html/simple
COPY demo/prebid/ /usr/share/nginx/html/prebid
COPY demo/dsp/ /usr/share/nginx/html/dsp
COPY demo/advertiser/ /usr/share/nginx/html/advertiser
COPY demo/ssp/ /usr/share/nginx/html/ssp
COPY demo/publisher/ /usr/share/nginx/html/publisher
COPY demo/resources /usr/share/nginx/html/resources
COPY demo/integration /usr/share/nginx/html/integration
COPY demo/gpt /usr/share/nginx/html/gpt
RUN npm install --prefix /usr/share/nginx/html/integration jsoneditor
COPY well-known     /usr/share/nginx/html/.well-known
