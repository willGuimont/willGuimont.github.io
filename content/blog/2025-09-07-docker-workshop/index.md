+++
authors = ["William Guimont-Martin"]
title = "Docker Workshop"
description = "Learn the basics of Docker with this hands-on workshop"
date = 2025-09-07
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences", "Docker", "Workshop"]
[extra]
# banner = ""
toc = true
toc_inline = true
# toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

Docker and containerization have revolutionized the way applications are developed, deployed, and managed.
Containers provide a lightweight and efficient way to package applications and their dependencies, ensuring consistency across different environments.

## Setup

The original workshop was designed to use with a virtual machine ([willGuimont/IFT2001-Docker](https://github.com/willGuimont/IFT2001-Docker)).
While you can follow the instructions below to set up the virtual machine, you can also choose to follow the workshop using Docker.

Follow these steps to prepare your environment.
1. Install [Docker](https://docs.docker.com/engine/install/ubuntu/)
2. `docker run -it --rm ubuntu:latest bash`
3. In the Docker container, run:
   1. `sudo apt update && sudo apt install -y git`
   2. `mkdir .atelier && cd .atelier && git clone https://github.com/willGuimont/IFT2001-Docker`
   3. `cd ateliers-iftglo-2001`
   4. `./helper/install.sh`
   5. `python3 ./helper/prepare_bashrc.py && source ~/.bashrc`
   6. Copy the files in your home directory: `cd ~/.atelier/ateliers-iftglo-2001/files && cp -r . ~/`

### Instructions

The instruction above sets up your environment for the workshop.
The grading commands are of the form `correction_nn`, where `nn` is an integer representing the exercise number, for example `correction_03` for exercise 3.
Instructions for validating commands will be provided with the first question that has an expected result.

To complete this workshop, you must perform each exercise directly in the terminal.
You will use the `nano` text editor to modify the requested scripts.
To open a file with nano, run the following in the terminal.

```bash
nano test.sh
```

You can then edit the file; enter

```bash
echo 'Hello world'
```

To exit nano, press <kbd>CTRL</kbd>-<kbd>X</kbd>, then answer `y` to save the changes.
Run the following commands to validate that everything works:

```bash
chmod +x test.sh
./test.sh
```

These commands should print `Hello world`.

{% alert(tip=true) %}
**Adventurers only**

If you are comfortable with the command line, we encourage you to try completing this workshop using `vim` as your text editor.
A brief introduction to `vim` commands is available on [MIT's The Missing Semester](https://missing.csail.mit.edu/2020/editors/).
`vim` offers many shortcuts to edit text and code very efficiently.
As a programmer, you will spend a lot of time writing code, so investing in learning `vim` is worthwhile for the rest of your career.
There are plugins emulating `vim` commands for most IDEs: [Vim for VS Code](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim) or [IdeaVim for JetBrains products](https://plugins.jetbrains.com/plugin/164-ideavim).

**Please note that no assistance regarding `vim` will be provided during this workshop.**
{% end %}

### Solutions
Proposed solutions to the exercises in these workshops are available in the following GitHub repository: [ulavalIFTGLOateliers/IFT2001-Docker](https://github.com/ulavalIFTGLOateliers/IFT2001-Docker).

---
## Docker

After your success with [Bash](@/blog/2025-09-06-bash-workshop/index.md), your manager has given you a new mission: find a solution to the application deployment problem.
Your company frequently encounters outages due to incompatibilities between different dependency versions.
Indeed, each developer can choose the operating system they wish to work on.
Consequently, some developers use different Linux distributions (Ubuntu, Arch, Gentoo), while others prefer Windows.

This situation often leads to version issues, as dependencies vary from one OS to another.
And worse, the versions used differ from those deployed on the production server.
The recurring excuse “It worked on my machine” when a developer causes a production outage has finally exasperated your manager. He is asking you to find a solution.

That’s how you discover Docker, a platform that lets you build, deploy, and run applications in lightweight, isolated containers.
With Docker, you can create a specific container for each microservice, including all required libraries and dependencies.
This approach ensures that each application will run consistently, regardless of library versions used by individual developers.
Moreover, Docker allows you to reproduce the development environment on the production server, thereby eliminating issues stemming from environment differences.

With Docker, you will tackle the challenge of running your company’s three main microservices.
Here are the microservices you must get working:

1. a web server health monitoring application written in Haskell;
2. a document management API written in Rust, requiring a PostgreSQL database; and
3. a Python application for visualizing web server health.

{% crt() %}
```
┌────────────────────────────── MICROSERVICES (ARCH OVERVIEW) ──────────────────────────────┐
│                                                                                           │
│  (3) python_app (CLI)                                                                     │
│      Image: python_app                                                                    │
│      Mode: --network=host (workshop)                                                      │
│      BACKEND_URL = http://localhost:8080                                                  │
│      Uses: list/add endpoints, view uptime stats                                          │
│            │                                                                              │
│            │ HTTP (JSON)                                                                  │
│            ▼                                                                              │
│  (1) status-checker (Haskell)                                                             │
│      Image: status-checker                                                                │
│      Port: 8080                                                                           │
│      Storage: monitoring.sqlite (SQLite)                                                  │
│            │                                                                              │
│            │ HTTP health probe (/documents or /health)                                    │
│            ▼                                                                              │
│  (2) rust_api (Actix Web)                                                                 │
│      Image: rust_api (multi-stage)                                                        │
│      Port: 8081                                                                           │
│      Env: DATABASE_URL=postgres://postgres:postgres@db                                    │
│            │                                                                              │
│            │ SQL (Diesel)                                                                 │
│            ▼                                                                              │
│      PostgreSQL                                                                           │
│      Image: postgres                                                                      │
│      Port: 5432                                                                           │
│      Volume: db:/var/lib/postgresql/data                                                  │
│                                                                                           │
│  Data Flows (top→down):                                                                   │
│    python_app ──HTTP──▶ status-checker ──HTTP──▶ rust_api ──SQL──▶ PostgreSQL             │
│                                                                                           │
│  Summary:                                                                                 │
│    - python_app only contacts status-checker.                                             │
│    - status-checker pings rust_api for availability.                                      │
│    - rust_api persists documents in Postgres.                                             │
│                                                                                           │
│  Ports: 8080 (status-checker) | 8081 (rust_api) | 5432 (Postgres)                         │
└───────────────────────────────────────────────────────────────────────────────────────────┘
```
{% end %}

> Integration update: We extend the architecture so that `status-checker` also pings the Rust `rust_api` service. In practice you can (a) register the rust_api base URL as an endpoint in status-checker, or (b) add a dedicated `/health` route in rust_api and have a small cron job in status-checker hitting it. This surfaces document service availability alongside existing monitored endpoints.

### Why containerization?

**Isolation**  
One of the main advantages of containerization is isolation.
It often happens that different applications require specific dependency versions.
With Docker, you can install different dependency versions in distinct containers, without risking conflicts or compromising other applications.
Furthermore, if you need to run applications on different operating systems, such as Ubuntu and Arch Linux, you can simply wrap them in Docker containers, avoiding the need to rewrite applications for each system.

**Portability**  
Portability is another key advantage of Docker.
Once you have set up a development environment with all required dependencies, reproducing that configuration on other machines or for new team members becomes tedious.
Thanks to Docker, you can create an image that contains all required dependencies and configuration, which can be easily distributed and run on different platforms, whether Linux, Windows, or others.
This enables a new team member to start quickly without spending weeks configuring their environment.
It’s also an advantage when deploying applications to a server.

**Reproducibility**  
Reproducibility is also simplified with Docker.
Docker images are versioned, which means it is easy to reproduce builds identically, ensuring that development, test, and production environments are consistent.
You just need to specify the version of the Docker image used to guarantee consistency and avoid issues related to variations across environments.

**Efficiency**  
In terms of efficiency, Docker offers a significant advantage over virtual machines (VMs).
Unlike VMs, Docker does not need to run a full operating system for each container, which greatly reduces resource consumption.
Docker containers share the host kernel, making them lightweight and quick to start.

**Community**  
Docker’s surrounding community is very active and offers a multitude of preconfigured images for various popular tools and technologies such as Node.js, Python, and many others.
These preconfigured images facilitate deployment and usage of these technologies, saving developers time by avoiding manual environment setup.

**Industry**  
Finally, it’s important to emphasize that Docker has become a de facto standard in the software development industry.
Many companies use Docker for development, testing, and deployment of their applications.
Docker is now an essential tool for software developers.

### What is containerization?

Docker is an open-source software platform that lets you create, deploy, and run applications in lightweight, isolated containers.
A Docker container is a runtime unit that encapsulates an application together with all of its necessary elements, such as libraries, dependencies, and configuration files.
These containers are self-contained and portable, meaning they can run consistently across different systems, whether a development, test, or production environment.

Docker is similar to a virtual machine that isolates an application from the host system.
However, Docker is much more efficient than a VM, which requires a full operating system for each instance.
Docker instead shares the host operating system’s `kernel`, saving resources and making containers faster to start and run.

Here is some Docker terminology.
You do not have to read the advanced sections to complete this workshop.
As a supplement, you can watch the video [“Never install locally”](https://www.youtube.com/watch?v=J0NuOlA2xDc).

**Docker Image**  
A Docker image is a template or build blueprint that contains all the elements needed to run an application.
It includes the operating system, libraries, dependencies, the application’s source code, and configuration files.
Docker images are created from files called `Dockerfile` that specify the steps to build the image.

**Dockerfile**  
A Dockerfile is a text file that contains the instructions to build a Docker image.
It specifies the image layers, dependencies to install, files to include, and commands to run during image construction.

**Docker Container**  
A Docker container is a running instance of a Docker image.
It is an isolated environment that runs the application with its dependencies.
Containers are lightweight, portable, and self-contained, which makes them easy to deploy across different machines.

**Docker Registry**  
A Docker registry is a centralized repository that stores and manages Docker images.
The default public registry is [Docker Hub](https://hub.docker.com/), where you can find many ready-to-use images.
You can also create and use your own private registry to store your own images.

**Union filesystem (advanced concepts)**  
The *Union Filesystem*, also known as *UnionFS* or *OverlayFS*, is a technology used by Docker to manage images and container layers efficiently.
The *Union Filesystem* allows you to overlay multiple file systems into a single logical view without physically merging them.
This means Docker images and containers can share and reuse common file layers, saving storage space.
It also speeds up image builds by caching layers already built.
When a container starts, a new read-write layer is added on top of the image layers, enabling container-specific changes without affecting others.

**cgroups (advanced concepts)**  
`cgroups`, or *control groups*, are a Linux kernel feature used by Docker to limit and manage system resources used by containers.
`cgroups` allow control of resources such as CPU, memory, disk bandwidth, and network, ensuring balanced and fair resource usage among containers.
Docker uses `cgroups` to set limits and quotas on resources allocated to each container, ensuring isolation and predictable performance.

**Namespaces (advanced concepts)**  
Namespaces are a Linux kernel feature that isolates system resources among processes.
Docker uses several types of namespaces to provide isolation between containers, including the PID namespace (process isolation), the network namespace (network isolation), the user namespace (user isolation), and the mount namespace (mount point isolation).
These namespaces ensure that each container has its own isolated view of the system, preventing processes in one container from interfering with others or with the host system.

**Chroot jail (advanced concepts)**  
Chroot, or change root, is a Unix/Linux feature that changes a process’s root directory and limits its access to the file system.
Docker uses chroot to create an isolated environment inside the container, where the container’s root directory becomes the starting point for all file paths.
This limits the container’s access to files and directories outside its isolated environment, thereby strengthening security and isolation.

## Containers manually

To clearly illustrate what Docker does, we will manually build a simplified container without using Docker.
This section is inspired by [p8952/bocker: Docker implemented in around 100 lines of bash](https://github.com/p8952/bocker).
In a terminal, enter the following commands:

```bash
# Verify that neofetch is not installed
# The following command should raise an error; do not install the package
neofetch

# Folder for containers
mkdir ~/containers; cd ~/containers

# Build the container's filesystem
sudo apt update; sudo apt install -y debootstrap
sudo debootstrap jammy ./ubuntu-container http://archive.ubuntu.com/ubuntu/

# Create an isolated environment (namespace)
sudo unshare --uts --pid --mount --ipc --fork

# Mount process, system, device, and temp folders
mount -t proc none ./ubuntu-container/proc/
mount -t sysfs none ./ubuntu-container/sys
mount -o bind /dev ./ubuntu-container/dev
mount -o bind /tmp ./ubuntu-container/tmp/
cp /etc/apt/sources.list ./ubuntu-container/etc/apt/sources.list

# Use chroot to launch a shell in the container
chroot ./ubuntu-container/ /bin/bash
# and there you go, you're in an isolated container

# Install neofetch
apt update
apt install -y neofetch

# Test neofetch; the command works!
neofetch

# You can run commands in the container here.

# Exit the container
exit

# Exit unshare
exit

# If we try neofetch again, the command is not found.
# We have indeed isolated the container!
neofetch
```

As you can see, there is no magic in containers.
We use basic Linux tools to isolate a process in its own filesystem.

## Docker basics

### Exercise 01 – Running a prebuilt image
Run the Docker image `hello-world`.

{% alert(note=true) %}
To run a Docker image, use the `run` command.

```bash
docker run image-name
```
{% end %}

If the command works, you will see a message displayed.

<details><summary>Solution</summary>

```bash
docker run hello-world
```

</details>

{% alert(note=true) %}
To execute a command in the container, specify the command at the end of `run`.
In the following examples, we pass `bash -c 'echo "Hello world"'` which interprets the string in the Bash interpreter.

```bash
# Prints 'Hello world' in an ubuntu container
docker run ubuntu bash -c 'echo "Hello world"'
# Prints information about the host system
cat /etc/os-release
# Prints information from a container running Arch Linux
docker run archlinux bash -c 'cat /etc/os-release'
```
{% end %}

{% alert(note=true) %}
To launch an interactive command (such as a shell), use the `-it` flag.
The `--rm` flag removes the container once it exits.

```bash
docker run -it --rm archlinux bash
```
{% end %}

### Exercise 02 – Container management

{% alert(note=true) %}
To see running containers: `docker ps`.

To stop a container: `docker stop container_id`.

**Note that the command may take some time to run.**
{% end %}

Tasks:
1. Launch an interactive terminal with Docker;
2. Open another terminal and inspect running containers;
3. Stop the Docker container from the second terminal.

<details><summary>Solution</summary>

```bash
# In the first terminal
docker run -it archlinux bash

# In the second terminal
docker ps
docker stop id
# or
docker rm -f id
```

</details>

### Exercise 03 – PostgreSQL database

{% alert(note=true) %}
To set environment variables in a container, use the `-e` flag.

```bash
docker run -it --rm -e HELLO=hello archlinux sh -c 'echo $HELLO'
```
{% end %}

{% alert(note=true) %}
To open a network port, use the `-p docker:host` flag, where `docker` is the port number inside the container and `host` is the port number on the host.

```bash
docker run -p 127.0.0.1:8080:80 nginx
# You can access the port via the URL http://localhost:8080/
curl http://localhost:8080/
```
{% end %}


Launch a PostgreSQL database with Docker.

Requirements:
- Image name: `postgres`
- Set the environment variable `POSTGRES_PASSWORD=postgres`
- Map Docker port 5432 to host port 5432
- Leave this container running.

<details><summary>Solution</summary>

```bash
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 --rm postgres
# or
docker run --name postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 --rm -d postgres
```

</details>

## Dockerfile

Dockerfiles are configuration files used to create custom Docker images.
They allow you to define, reproducibly and automatically, an application's runtime environment inside a Docker container.

A Dockerfile contains a series of instructions that specify the steps needed to build a Docker image.
These instructions include actions such as selecting the base image, installing dependencies, configuring environment variables, copying files, running commands, and more.

Here is an annotated example Dockerfile for a Python application.

```Dockerfile
# Use the Python 3.9 slim base image
FROM python:3.9-slim

# Set the working directory inside the container
# Specifies the directory for RUN, CMD, ENTRYPOINT, COPY, and ADD
WORKDIR /app

# Copy requirements.txt from the host into the Docker container
COPY requirements.txt .

# Run a Bash command to install Python dependencies
RUN pip install -r requirements.txt

# Copy the source code into the Docker container
COPY . .

# Set the default command when the container starts
CMD ["python", "app.py"]
```

To build the image, use `docker build -t <tag> .`.
The `-t <tag>` argument gives the image the name `<tag>`.
For the previous application, you could use `docker build -t python-app .`.
Note that the order of instructions matters.

It is crucial to define the order of operations in a Dockerfile due to how Docker builds images.
Each instruction in the Dockerfile creates a new layer in the Docker image, and the order can significantly impact build efficiency and performance.

Docker uses a cache to speed up image builds.
When you run an instruction, Docker checks whether that instruction has already been executed in a previous layer.
If so and the parameters are identical, Docker reuses the cached layer instead of rebuilding it.
This saves build time.
However, if you modify an instruction higher up in the Dockerfile, all subsequent instructions will have their cache invalidated and must be rebuilt.
**For example, if you perform resource-intensive operations such as compiling code that changes whenever you modify the source, it can be preferable to place those steps towards the end of the Dockerfile to benefit from caching as much as possible.**

### Exercise 04 – Haskell service Dockerfile
Use the `README.md` in the folder `~/Applications/status-checker` to write a Dockerfile that runs the Haskell application.

Requirements:
- Base image `haskell:9.0-buster`
- Run `stack setup --install-ghc`
- Workdir `/app`
- Copy the source code into `/app`
- Run `stack build`
- Launch the server with `stack run`

Then, start the container exposing port 8080.
If everything works, you should be able to run:

```bash
curl http://localhost:8080/endpoints
# Expected response
{}%
# Or
{}
```

Leave this container running.

<details><summary>Solution</summary>

Dockerfile:

```Dockerfile
FROM haskell:9.0-buster
RUN stack setup --install-ghc
WORKDIR /app
COPY . .
RUN stack build
CMD ["stack", "run"]
```

Execution:

```bash
docker build -t status-checker .
docker run --rm -p 8080:8080 status-checker
```

</details>

### Exercise 05 – Python application Dockerfile
Use the `README.md` in the folder `~/Applications/python_app` to write a Dockerfile that runs the Python application.

Then, launch the application interactively and with the correct network mode.

{% alert(note=true) %}
This application will need to access your computer’s local network to make requests to the container from the previous exercise; to do so, pass the argument `--network="host"` when you run the container.
{% end %}

If everything works, you should be able to use the application to add URLs to monitor and see the results.

<details><summary>Solution</summary>

Dockerfile:

```Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "main.py"]
```

Execution:

```bash
docker build -t python_app .
docker run --rm -it --network="host" python_app
```

</details>

## Advanced Docker

Sometimes, you may need to create more complex Docker images.
Here, we will explore two advanced Docker features: multi-stage builds and volumes.

### Multi-stage image builds

Multi-stage builds are an advanced Docker feature that enables optimized image creation using several distinct stages in the build process.
This separates build and production stages, often resulting in final images that are lighter and more secure by minimizing what remains in the final image.

For example, for a JavaScript React application, we can split the build into two stages.

Create the application:

```bash
npx create-react-app my-app
```

Dockerfile:

```Dockerfile
# Stage 1: Build the application

# Use `as build` to name this build stage
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Prepare the server
# Here, we start a new image from scratch
FROM nginx:alpine
# Copy the compiled app from the previous stage
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

To run:

```bash
docker build -t web-app .
docker run --rm -p 80:80 web-app
```

### Exercise 06 – Rust multi-stage build
Use the `README.md` in the folder `~/Applications/rust_api` to write a Dockerfile that runs the application.

Requirements:
- Launch the PostgreSQL database from a previous exercise;
- Create a first stage to compile the Rust code;
- Create a second stage to run the code;
  - Start this image from `debian:bullseye-slim`;
  - Install the package `libpq-dev` with `apt update; apt install -y libpq-dev`;
  - Set the environment variable `DATABASE_URL=postgres://postgres:postgres@localhost`
  - Copy `/app/target/release/rust_api` from the previous stage;
- Run the container with `--network="host"` and expose the correct port;
- Test that everything works with `curl http://localhost:8081/documents`.

<details><summary>Solution</summary>

```Dockerfile
FROM rust:latest AS build
WORKDIR /app
COPY . .
RUN cargo build --release

FROM debian:bullseye-slim
RUN apt update; apt install -y libpq-dev
WORKDIR /app
COPY --from=build /app/target/release/rust_api ./rust_api
ENV DATABASE_URL=postgres://postgres:postgres@db
CMD ./rust_api
```

Execution

```bash
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
docker build -t rust_api .
docker run --rm --network="host" rust_api

# Validate that the server works
curl http://localhost:8081/documents
```

</details>

### Volumes

In Docker, volumes are used to allow containers to access, share, and persist data between the host system and the container itself.
Docker volumes store data outside the lifecycle of containers.
This means that even if you destroy or recreate a container, the data stored in the volume remains intact.
This separates data persistence from the container environment, providing better data management.
Volumes are also useful to grant containers access to datasets too large to copy into the image, such as a training dataset for a machine learning system.

For example, to store PostgreSQL database data in a host folder, specify the `PGDATA` variable and mount a volume:

```bash
docker run -e POSTGRES_PASSWORD=postgres -p 5432:5432 --rm \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -v custom/mount/path:/var/lib/postgresql/data \
    postgres
```

To avoid rebuilding the Docker image after each change to the source code—and thus speed up development—you can make the project’s source code accessible via a volume.
Thus, a `DockerfileDev` for the Python application could look like this:

```Dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
# We removed the line COPY . .
CMD ["bash"]
```

Run with:
```bash
docker build -t python_app -f DockerfileDev . 
docker run --rm -v .:/app my-app
# In the container
python main.py
# Modify the source code
python main.py
# Changes are reflected in the container
```

Thus, you can reuse the same image even if the source code has changed.

## Extras

Some additional Docker features and tools that may be useful in your projects.

### Cleanup

When using Docker, it is important to consider the storage used by images, containers, volumes, and other Docker artifacts.
Poor storage management can lead to excessive disk usage and make Docker maintenance and resource management difficult.
Docker provides several `prune` commands to remove unused containers and images.
To clean up various Docker artifacts, the command `docker system prune -a -f` removes all unused resources.

### Docker Compose

Docker Compose is a tool that allows you to easily define and manage multi-container applications.
It simplifies deployment and orchestration of Docker containers using a simple, readable configuration file.

With Docker Compose, you can specify services, networks, volumes, and other configurations needed to run an application composed of multiple containers.
You can also define dependencies among containers, environment variables, exposed ports, etc.

Docker Compose uses a YAML configuration file to describe the application’s infrastructure.
This file contains sections such as *services*, *networks*, *volumes*, etc., where you can define the different parts of your application and their configurations.

Here is an example `docker-compose.yml` for the Rust application that launches both the server and the PostgreSQL database:

```yaml
# List of containers to launch
services:
  # Database container
  # We find the same parameters as in `docker run`
  db:
    # Specify the image to launch
    image: postgres:latest
    restart: always
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - PGDATA=/var/lib/postgresql/data/pgdata
    expose:
      - 5432
    volumes:
      - db:/var/lib/postgresql/data
  # Rust server
  api:
    # Will build the Dockerfile in the directory containing docker-compose.yml
    build: .
    # Build the db service before api
    depends_on:
      - db
    ports:
      - 8081:8081
    # The database URL changes—rather than @localhost
    # docker-compose makes db accessible under the name @db
    environment:
      - DATABASE_URL=postgres://postgres:postgres@db
    # Wait for the database to be ready before launching the server
    entrypoint: bash -c "sleep 5 && ./rust_api"
# Required for the database volume
volumes:
  db:
    driver: local
```

Run with:

```bash
docker-compose up --build
```

### Podman

[Podman](https://podman.io/) is an open-source alternative to Docker.
Docker and Podman are two popular containerization tools that share similar features but differ in architecture and security approach.
Docker uses a client-server architecture, where the Docker daemon runs as a separate process and Docker commands are executed via the CLI.
In contrast, Podman uses a daemonless architecture, meaning it runs directly as a regular user and does not require a separate daemon process.
Thus, Podman can run without special privileges, limiting potential risks associated with running as superuser. See [What is podman?](https://www.redhat.com/en/topics/containers/what-is-podman) for more information.

Podman also offers tools to manage *pods*, a topic outside the scope of this workshop.

### Kubernetes

Kubernetes is an open-source container orchestration system that facilitates the deployment, management, and scaling of containerized applications.
Using Kubernetes offers many benefits, such as fault tolerance, easier deployments, and management and scaling of containerized applications.
