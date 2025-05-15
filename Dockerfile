FROM scratch
COPY dist/ /www
CMD cp /www/* /host