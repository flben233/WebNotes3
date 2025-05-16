FROM alpine
COPY dist/ /www
CMD cp -r /www/* /host