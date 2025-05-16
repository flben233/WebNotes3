FROM alpine
COPY dist/ /www
CMD cp /www/* /host