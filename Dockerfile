FROM ubuntu:20.04
SHELL ["/bin/bash", "-c"]

WORKDIR /root
ENV TZ=America/Toronto
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENV LANG=en_US.UTF-8

RUN apt update \
    && apt install -y  \
        software-properties-common \
        git

RUN add-apt-repository -y ppa:rael-gc/rvm  \
    && apt update  \
    && apt install -y rvm  \
    && source /usr/share/rvm/scripts/rvm  \
    && rvm install "ruby-2.5.3"

COPY Gemfile type-on-strap.gemspec ./
RUN source /usr/share/rvm/scripts/rvm  \
    && bundle install

EXPOSE 4000

ENTRYPOINT source /usr/share/rvm/scripts/rvm \
    && bundle update \
    && bundle exec jekyll serve --host=0.0.0.0 --incremental
