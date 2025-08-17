+++
authors = ["William Guimont-Martin"]
title = "Compute Canada Quickstart"
description = ""
date = 2022-01-28
# updated = ""
# draft = false
[taxonomies]
tags = ["Deep Learning", "Machine Learning"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

Here's a small guide on how to use Compute Canada clusters to train deep learning models.

In this guide, we'll do the necessary setup to get you up and running on a cluster. This guide is written to work with [Narval](https://docs.computecanada.ca/wiki/Narval/en), but it should be easy to adapt it to other clusters by changing the URLs. You can see available clusters at [this URL](https://www.computecanada.ca/research-portal/accessing-resources/available-resources/).

We recommend Narval for deep learning as of now (2021-2022) because it has 4 NVIDIA A100 (40 Gb memory) per node.

*This guide was written by William Guimont-Martin, 2021*

# Account creation

First of all, you'll need a Compute Canada account to access the clusters. To do so, please see [Tips for new students](https://docs.google.com/document/d/1fk0P_4wIKaP1giUD0rtbpCtxzj3YYm797RQKklQjpuk/edit?usp=sharing). You'll see the URL to apply for an account and Philippe Giguère's sponsor code.

You'll need your username and your password for the following steps.

# SSH and `ssh-copy-id`

To access Compute Canada's clusters, you'll need to ssh into them. You can get the login node URL by checking the cluster's wiki page. For Narval, the URL is **narval.computecanada.ca**.

To connect to the cluster:

```bash
# replace <username> with your actual Compute Canada username
ssh <username>@narval.computecanada.ca
```

You'll be asked to enter your password. If everything goes right, you'll be greeted by the cluster's welcome message.

To make things easier later, we recommend to set up an SSH key to connect to the cluster.

To do so, you'll need to generate an SSH key [if you don't already have one you'd like to use](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/checking-for-existing-ssh-keys).

Please see [Generating a new SSH key and adding it to the ssh-agent](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) from GitHub to generate a new SSH key.

Once you have added your SSH key and added it to the ssh-agent, copy your key to the cluster with

```bash
# replace <username> with your actual Compute Canada username
ssh-copy-id <username>@narval.computecanada.ca
```

If everything went right, you should now be able to ssh into your cluster without being asked your password.

# Clone your code

Now that you are logged in the cluster, you should have a bash shell. From that shell, you can use most Linux commands you're used to like `ls`, `cd`, etc..

We'll now clone your project on the cluster.

From the cluster, you can create another SSH key and [add it to GitHub](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account).

This will allow you to `git clone` your repository into your home directory.

# Setup your Python venv

It is recommended to create your Python venv from inside a SLURM job, if your installation script is quite complex, it will be easier to set up before starting any job.

To create a Python venv:

```bash
load python/3.8.10  # loads python, you can change the version, you can see available versions using "module avail python"
python -m venv venv  # creates a virtual environment in the folder ./venv/
```

Once created, you can activate it using:

```bash
source venv/bin/activate
```

You should now see `(venv)` at the beginning of your shell prompt.

You can now `pip` install all of your dependencies.

Please note that when installing mmdetection and its dependencies, you might need to also run:

```bash
pip install -U numpy
pip install -U scikit-learn
```

If you want to create your venv from inside a job, note the commands you did to setup your environment and copy them into your job script.

# Putting your data on the cluster

To put your data on the cluster, we recommend using `sftp`.

First of all, take the time to familiarize yourself with [the different types of storage available on the clusters](https://docs.computecanada.ca/wiki/Storage_and_file_management/en#Storage_types).

From that, you'll have to upload your dataset in `~/projects/def-philg/<username>`. Note that this space is shared across the people in the lab. Please keep it clean!

From you local computer:

```bash
cd path/to/your/dataset/on/your/computer
# replace <username> with your actual Compute Canada username
sftp <username>@narval.computecanada.ca
sftp> cd ~/projects/def-philg/<username>
# use "put file" to upload a file, use "get file" to download a file
# you can use * to wildcard select multiple files
```

If you are using mmdetection, you might want to add a symlink to your data in `code/data`. To do so, run the following commands:

```bash
cd to/your/code/folder  # TODO change this path
mkdir data
cd data
ln -s path/to/your/dataset <dataset-name>  # TODO change path and dataset name
```

# SLURM jobs

We can now create jobs. To do so, create a .sh file and paste the following inside:

```bash
#!/bin/bash
#SBATCH --gres=gpu:4
#SBATCH --cpus-per-task=8
#SBATCH --mem=40000M
#SBATCH --time=1-00:00
#SBATCH --job-name=01_baseline_pointpillars
#SBATCH --output=%x-%j.out

# Variables
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
export MAKEFLAGS="-j$(nproc)"

# Modules
module load cuda/11.0
module load python/3.8.10
module load qt/5.12.8
module load geos
module load llvm/8.0.1

# Setup Python
source ~/venv/bin/activate

# Start task
# TODO change that part to how you run your python script, this example shows how to do multi GPU training using mmdetection3d
cd to/your/code/folder  # TODO change this path
CONFIG_FILE=configs/01_baseline_pointpillars.py
WORK_DIR=path/to/work/dir  # TODO change this path too
GPUS=4
./dist_train.sh ${CONFIG_FILE} ${GPUS} --work-dir ${WORK_DIR} --cfg-options cudnn_benchmark=True evaluation.gpu_collect=True  # gpu_collect=True is essential to do multi GPU training

# Cleaning up
deactivate
```

This script is organized in five main parts.

## Configure job

This part is used to configure the resources needed for your job.

```bash
#!/bin/bash
#SBATCH --gres=gpu:4                         # Ask for 4 GPU
#SBATCH --cpus-per-task=8                    # Ask for 8 CPU
#SBATCH --mem=40000M                         # Ask for 40 000M of RAM
#SBATCH --time=1-00:00                       # Run for DD-HH:MM
#SBATCH --job-name=01_baseline_pointpillars  # Job name
#SBATCH --output=%x-%j.out                   # Log will be written to f'{job_name}_{job_id}'
```

## Setup installation

This part sets environment variables for multithreading and loads needed modules. You might need to change the loaded versions.

```bash
# Variables
export OMP_NUM_THREADS=$SLURM_CPUS_PER_TASK
export MAKEFLAGS="-j$(nproc)"

# Modules
module load cuda/11.0
module load python/3.8.10
module load qt/5.12.8
module load geos
module load llvm/8.0.1
```

## Loading the venv

This will load the venv we created earlier

```bash
# Setup Python
source ~/venv/bin/activate
```

## Running your actual code

You will need to change this part to run what you want to run. This scripts shows how to use multi-GPU with mmdetection3d.

```bash
# Start task
# TODO change that part to how you run your python script, this example shows how to do multi GPU training using mmdetection3d
cd to/your/code/folder  # TODO change this path
CONFIG_FILE=configs/01_baseline_pointpillars.py
WORK_DIR=path/to/work/dir  # TODO change this path too
GPUS=4
./dist_train.sh ${CONFIG_FILE} ${GPUS} --work-dir ${WORK_DIR} --cfg-options cudnn_benchmark=True evaluation.gpu_collect=True  # gpu_collect=True is essential to do multi GPU training
```

## Cleaning up

Not strictly needed, but it is always a good thing to clean up after yourself.

```bash
# Cleaning up
deactivate
```

## Run the job

To run a job, you first have to queue it to the job scheduler. To do so, run the following command:

```bash
sbatch script.sh
```

You can then verify the job is queued by running:

```bash
sq
```

More information is available [here](https://docs.computecanada.ca/wiki/Running_jobs)

# Useful tools

`sbatch`: queue a job.

`sq`: view your queued jobs

`scancel <id>`: cancel job with id <id>

`salloc --account=def-philg --gres=gpu:2 --cpus-per-task=4 --mem=32000M --time=5:00:00`: start an interactive job, which will allow you to test your scripts before queuing jobs

`sftp`: useful tool to transfer data from and to the cluster

`diskusage_report`: see used disk space