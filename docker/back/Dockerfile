FROM python:3.8-slim-buster

WORKDIR /python-docker

ARG PIP_INDEX_URL
ENV PIP_INDEX_URL=${PIP_INDEX_URL}
ENV DB_FILE='./db.json'

COPY . .
RUN pip3 install -r requirements.txt
RUN mkdir -p mockpdfs

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]