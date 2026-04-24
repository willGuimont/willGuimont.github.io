+++
authors = ["William Guimont-Martin"]
title = "Bash Workshop"
description = "Learn the basics of Bash scripting with this hands-on workshop"
date = 2025-09-06
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences", "Bash", "Workshop", "Software Engineering"]
[extra]
# banner = ""
toc = true
toc_inline = true
# toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

Bash is a powerful command-line interpreter that allows users to interact with their operating system through text commands.
As a programmer, you will often need to use the command line to perform various tasks, such as navigating the file system, managing files and directories, and executing scripts.

## Setup

The original workshop was designed to use with a virtual machine ([willGuimont/IFT2001-Scripting](https://github.com/willGuimont/IFT2001-Scripting)).
While you can follow the instructions below to set up the virtual machine, you can also choose to follow the workshop using Docker.

Follow these steps to prepare your environment.
1. Install [Docker](https://docs.docker.com/engine/install/ubuntu/)
2. `docker run -it --rm ubuntu:latest bash`
3. In the Docker container, run:
   1. `sudo apt update && sudo apt install -y git`
   2. `mkdir .atelier && cd .atelier && git clone https://github.com/willGuimont/IFT2001-Scripting`
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
Proposed solutions to the exercises in these workshops are available in the following GitHub repository: [ulavalIFTGLOateliers/IFT2001-Scripting](https://github.com/ulavalIFTGLOateliers/IFT2001-Scripting).

---

## Introduction to Bash

It’s a day like any other at the office. You arrive early in the morning, coffee in hand and your laptop under your arm.
As you enter your department, you notice that your usually calm and relaxed boss is pacing nervously down the hallway. His pale expression and trembling hands immediately catch your attention.

> “Worrying --- what’s going on?” you ask, concerned.

> “Production has crashed,” he replies in a trembling voice. “We’re getting hundreds of customer calls, nothing works anymore...”

Your heart races as you realize the magnitude of the problem. Your company depends on a server that hosts most of its services, and it seems something is malfunctioning. Your boss looks you straight in the eye.

> “Solving this problem is your priority,” he says firmly.

He hands you a sheet of paper with the login credentials to access the server.
You feel both nervous and excited at the prospect of solving this critical issue.
Your boss then leads you to the server room, where an old CRT screen and a keyboard await you.
He explains that it’s a Linux server edition, so without a graphical interface.
You will therefore have to solve the problems using only the terminal.


<div class="wide-crt">
{% crt() %}

```
┌───────────────────────────── SYSTEM DIAGNOSTIC (BOOT/RESCUE) ──────────────────────────┐
│ Host: crt-prod-01                User: username               TTY: /dev/pts/0          │
│ Kernel: 5.15.x-generic           Uptime: 00:07:13             Load: 1.42 0.97 0.53     │
│ -------------------------------------------------------------------------------------- │
│ LOG SCAN: messages.txt                                                                 │
│   Errors (raw): ................. 37  (use: grep 'Error' messages.txt)                 │
│   Unique 4xx errors: ............ pending (pipe into uniq | sed ...)                   │
│                                                                                        │
│ NEXT STEPS (YOU):                                                                      │
│   [1] Locate build log directory         (Exercise 02)                                 │
│   [2] Back up critical log file          (Exercise 03)                                 │
│   [3] Fix permissions & run diagnostics  (Exercise 04)                                 │
│   [4] Corral *.out + purge temp files    (Exercises 05–07)                             │
│   [5] Triage errors with grep/uniq/sed   (Exercises 09–12)                             │
│   [6] Hunt largest files (du/find/sort)  (Exercise 13)                                 │
│   [7] Awk your way through db.tsv        (Exercise 14)                                 │
│   [8] Script + rollback automation       (Exercises 15–16)                             │
│ -------------------------------------------------------------------------------------- │
│ TIP: Build one-liners incrementally. Example pipeline scaffold:                        │
│        cat file | grep pattern | sort | head -n 5                                      │
│                                                                                        │
│ REMEMBER:                                                                              │
│   man <cmd>    --help flags    help <builtin>    set -x (debug scripts)                │
│                                                                                        │
│ STATUS LAMPS:  [CPU OK] [DISK OK] [NET OK] [SERVICE ERROR] -> Investigate app layer    │
└────────────────────────────────────────────────────────────────────────────────────────┘
(enter the command line below…)
```
</div>

{% end %}

### The command line and the manual

Open a terminal with the shortcut <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd>, or press the <kbd>Super</kbd> key (the Windows key on the keyboard) and search for the `Terminal` application.

As a first step, you decide to inspect the files present on the server in order to find the log files. However, you are not sure which command to use for this.

Fortunately, the command line lets you learn how each command works. The `man` command allows you to read the manual page corresponding to a specific command.
For example, to get the documentation for the `ls` command, you can use the following command:

```bash
man ls
```

Once you have opened the manual page, you can navigate using the arrow keys to read the content.
To quit the manual page, simply press the <kbd>q</kbd> key.

Also, some commands accept the `--help` argument which displays a help message describing the arguments that can be passed to the command.
For example:

```bash
ls --help
```

By running this command, you will get a help message detailing the different options and arguments you can use with the `ls` command.

Do not hesitate to use the `--help` argument with commands you wish to explore to obtain additional information on their usage.
This can help you better understand the available features and correctly use commands in your exploration of the server.

For some commands such as `cd` (which is a command built into the Bash shell), you should instead use

```bash
help cd
```

{% alert(note=true) %}
**Terminal shortcuts**

**Auto-completion:** You can use the <kbd>Tab</kbd> key to get auto-completion in the terminal.  

**Quit a command:** In a terminal, the <kbd>Ctrl</kbd>+<kbd>C</kbd> shortcut, rather than copying, terminates the execution of a command.
For example, the `yes` command indefinitely repeats the letter `y` in the terminal.
To quit, press <kbd>Ctrl</kbd>+<kbd>C</kbd>:

```bash
yes
# Ctrl+C to quit the execution of yes
```

**To copy and paste**, the terminal uses <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>C</kbd> and <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>V</kbd>  

**To close a terminal**, you can use <kbd>Ctrl</kbd>+<kbd>D</kbd>.
{% end %}


### Exercise 01 – Basic commands

This exercise aims to familiarize you with a few basic commands that will be useful throughout the workshop.
To do this, use the `man` command and the `--help` argument to obtain detailed information on how each command works.
In the file `exercice_01.txt`, briefly describe the purpose of each of the following commands.
This cheat sheet will be useful throughout the workshop.
You can consult it with the command `cat exercice_01.txt`.

Open `exercice_01.txt` with `nano` with:

```bash
nano exercice_01.txt
```

In another terminal (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> to open another terminal or <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>T</kbd> to open another terminal in a tab), use the terminal to determine the behavior of the following commands:

| Commands |
|----------|
| `nano` |
| `cd` |
| `ls` |
| `cat` |
| `mkdir` |
| `rm` |
| `rmdir` |
| `mv` |
| `pwd` |
| `cp` |
| `chmod` |
| `touch` |

<br />
<details><summary>Solution</summary>

<br />

| Command | Definition |
|---------|------------|
| `nano`  | Simple text editor |
| `cd`    | Change current directory |
| `ls`    | List files in a directory |
| `cat`   | Display a file’s content |
| `mkdir` | Create a directory |
| `rm`    | Delete a file or directory |
| `rmdir` | Delete an empty directory |
| `mv`    | Move/rename a file |
| `pwd`   | Show the path of the current directory |
| `cp`    | Copy a file |
| `chmod` | Change file permissions |
| `touch` | Update a file’s timestamp, or create it if it does not exist |

</details>

### Exercise 02 – File system navigation
Use the commands listed above to explore the directory tree and find the file with the `.log` extension.

{% alert(note=true) %}
Here are some special paths:

- `.` represents the current directory;
- `..` represents the parent directory;
- `~` represents the user’s home directory (`/home/username/`);
- `-` represents the path of the last visited directory.

{% end %}

You can use these special paths with several commands, notably `cd`.

```bash
# Navigate into the abc/def directory
cd abc/def

# Navigate to the parent directory (abc)
cd ..

# Return to the home directory
cd
# or
cd ~

# Return to the previous directory (abc)
cd -
```

1. List the files in the current directory
2. Move through the different directories and try to find the file with the `.log` extension
3. Copy the **absolute** path (from the root of the file system `/`) of the directory where the log files are located into the file `~/out_02.txt`. Do not add a newline at the end.

<details><summary>Solution</summary>

Commands to run:

1. `ls`  
2. `cd ApplicationData/output/logs`  
3. `ls`  
4. `pwd`

Expected path: `/home/glo2001/ApplicationData/output/logs`

</details>

### Exercise 03 – `home` directory and copy
Now that you have found the log file, it’s time to make a copy of it in your `home` directory.

{% alert(note=true) %}

The home directory is where a user’s personal files are stored.
Each user has their own directory in `/home/`.
If your username is `username`, so your home directory is located at `/home/username`.

There is also a shortcut to refer to the home directory: `~`. Thus, each of the following commands returns you to the home directory:

```bash
# Use an absolute path
cd /home/admin
# Use tilde
cd ~
# Without arguments, cd returns to the home directory
cd
```

{% end %}

Copy the `.log` file into the `~/log_backup` directory.

1. Return to your `home` directory;
2. Create a new directory named `log_backup` in your `home` directory;
3. Copy the .log file into the backup directory, giving it the name `build_backup.log`.

<details><summary>Solution</summary>

Commands:

1. `cd`
2. `mkdir log_backup` (typo in LaTeX was `mdkdir` but intent is mkdir)
3. `cp ~/ApplicationData/output/logs/build.log ~/log_backup/build_backup.log`

</details>

### Exercise 04 – Permissions
Now that you have backed up the log file, it’s time to run the diagnostic script provided by your boss to analyze the system.
Go back to the log directory, and try to run the script `diagnostic.sh` using `./diagnostic.sh`.

However, you encounter a permissions error.
To fix this, inspect the script permissions using the `ls -l` command.
Then, modify the permissions to make the script executable.

{% alert(note=true) %}
`chmod`, short for *change mode*, is a command used to modify access permissions for files and directories.
Permissions in bash refer to the access rights granted to users and groups to read, write, and execute files and directories.
These permissions control who can perform which operations on a given file or directory.
You can list file and directory permissions with `ls -l`.

```bash
drwxr-xr-- 1 user group 4096 Sep  7 10:00 folder
-rwxr-xr-- 1 user group  123 Sep  7 10:00 file
```

Permissions are generally represented by one character followed by three groups of three characters each, for a total of nine characters, displayed in a specific order:

1. The first character indicates whether it is a file (`-`) or a directory (`d`).
2. The first group of three characters represents the permissions of the file’s owner.
3. The second group represents the permissions of the group to which the file belongs.
4. The third group represents the permissions for other users.

Each group of three characters consists of the following permission types:

1. `r` (*read*): Read the content of the file or directory.
2. `w` (*write*): Modify or delete the file (or the contents of the directory).
3. `x` (*execute*): Execute a file (or traverse a directory).

To modify these permissions, you can use the `chmod` command.
For example, to add (`+`) the execute permission to a file:

```bash
chmod +x script.sh
```

To remove the write permission from a directory:

```bash
chmod -w folder
```
{% end %}

Steps:

- Inspect the file permissions;
- Use `chmod` with the `+x` argument to modify permissions;
- Run `diagnostic.sh`.

<details><summary>Solution</summary>

```bash
# Check permissions
ls -l
# Change permissions
chmod +x diagnostic.sh
# Run the script
./diagnostic.sh
```

</details>

### Exercise 05 – Wildcards
The script generated about ten `.out` files containing the results of the system analysis. You need to move these files into a new folder named `output`.
Instead of moving each file manually with the command `mv out_01.out output/`, which would be tedious, you can use the wildcard character (`*`), which allows you to select multiple files at once.

Before moving the files, you can try the command `cat *`.
This command displays the contents of all files in the current directory.

However, in your case, you do not want to select all files.
You can specify a specific pattern by adding a prefix or suffix to the filenames.
For example, to select all `.sh` files, you can use the command `ls *.sh`.
This will display the list of files with the `.sh` extension.

Tasks:
- Create a folder named `output_backup` in the `~/ApplicationData/output/logs` directory;
- Move all files ending with `.out` into the folder in a single command.

<details><summary>Solution</summary>

```bash
# Move to the correct directory
cd ~/ApplicationData/output/logs
# Create the output folder
mkdir output_backup
# Move the files into the folder
mv *.out output_backup/
```

</details>

### Exercise 06 – Deleting files and folders
In addition to generating `.out` files, the script also generated temporary `.tmp` files and a folder named `temp`.
These files and this folder can be deleted.

Tasks:
- Delete the files with the `.tmp` extension;
- Delete the `temp` folder.

<details><summary>Solution</summary>

```bash
# Delete .tmp files
rm *.tmp
# Delete the folder
rm -r temp
```

</details>

### Exercise 07 – Basic scripting
To simplify the task of moving and deleting the files generated by the `diagnostic.sh` script, you can create a script that will automate these actions for you.

{% alert(note=true) %}
Here is an example Bash script:

```bash
#!/usr/bin/env bash
echo 'Start of script'
ls *.sh
echo 'End of script'
```

In this script, the line `#!/usr/bin/env bash` is called a *shebang* (she = `#`, bang = `!`).
It tells the interpreter which program should be used to run the script—in this case, Bash.
It would also be possible to specify another program as the interpreter.
For example, to interpret the script as Python 3, we would use the following shebang: `#!/usr/bin/env python3`.

Using `#!/usr/bin/env bash` is generally preferable to `#!/bin/bash`, as it looks up the location of the Bash executable in the user’s environment, making it more portable across systems.

You can create a text file with the `.sh` extension (for example, `example.sh`), copy the script above into it, then make the file executable using `chmod +x example.sh`.
Next, you can run the script using `./example.sh`.

{% end %}

Now, create a script that performs the following operations:
1. Create a script named `cleanup.sh` in the directory `~/ApplicationData/output/logs/`;
2. Give the script execute permissions;
3. Use the commands you typed in the previous exercises to create your script:
   - Create a folder named `output_backup`;
   - Move all files ending with `.out` into the folder in a single command;
   - Delete the files with the `.tmp` extension;
   - Delete the `temp` folder.
4. Make sure to delete the `output` folder you created earlier;
5. Run `diagnostic.sh` once more, and test your script.

{% alert(note=true) %}
You can use the `history` command to view the list of commands you have previously executed in the terminal.
{% end %}

<details><summary>Solution</summary>

```bash
#!/usr/bin/env bash

# Create the output_backup folder
mkdir output_backup
# Move the files into the folder
mv *.out output_backup/

# Delete .tmp files
rm *.tmp
# Delete the folder
rm -r temp
```

</details>

---

## Advanced commands
Now that you’ve performed some cleanup operations and become familiar with the command line, it’s time to analyze the logs and outputs of the diagnostic program.
To do this, you will need to combine several commands using `piping` and more advanced commands.
Before addressing this topic, you will explore some more advanced commands that will be useful later.

### Exercise 08 – Advanced commands
As in exercise 1, use the `man` command and the `--help` argument to obtain detailed information on the commands in the following table.
These commands are a bit different from those seen in exercise 1; they can take a file as input, or you can `pipe` the output of another command to them, which will be the subject of the next section.
You can create a test file (`test_file.txt`) to test the commands.

In the file `exercice_08.txt`, briefly describe the purpose of each of the following commands.
This cheat sheet will be useful throughout the workshop.

| Commands |
|----------|
| `tac` |
| `less` |
| `find` |
| `grep` |
| `sort` |
| `uniq` |
| `wc` |
| `head` |
| `tail` |
| `du` |
| `curl` |
| `sed` |
| `awk` |
| `kill` |
| `sleep` |

<br />

<details><summary>Solution</summary>

<br />

| Command | Definition |
|---------|------------|
| `tac`      | Reverse the order of lines in a file |
| `less`     | Text pagination |
| `find`     | File search |
| `grep`     | Filter lines by a pattern |
| `sort`     | Sort lines |
| `uniq`     | Remove duplicate lines |
| `wc`       | Count lines, words, and characters |
| `head`     | Display the beginning of a file |
| `tail`     | Display the end of a file |
| `du`       | Show file sizes |
| `curl`     | Network request (HTTP, FTP, etc.) |
| `sed`      | Stream editor |
| `awk`      | Interpreter for the `awk` language |
| `kill`     | Stop a process |
| `sleep`    | Wait for a number of seconds |

</details>

### Exercise 09 – Advanced commands 1
The `messages.txt` file in the log folder contains the error messages that cause the system outage.
Unfortunately, this file also contains a lot of logs that are not useful to you.
Rather than manually reading the entire file, you decide to use the Bash commands you just discovered.

Use a command to display all lines of `messages.txt` that contain the string `Error` and copy the result into the file `~/errors.txt`.

<details><summary>Solution</summary>

```bash
grep Error messages.txt
```

</details>

### Exercise 10 – Advanced commands 2
After inspecting the errors that you copied into `~/errors.txt`, you realize there are many duplicates.
Use a Bash command to remove duplicate lines and copy the result into `~/errors_2.txt`.

<details><summary>Solution</summary>

```bash
uniq ~/errors.txt
```

</details>

### Exercise 11 – Advanced commands 3
After inspecting the filtered errors from the file `~/errors_2.txt`, replace errors with a `400` code (`400`, `403` and `404`) with warnings.
With `sed`, replace the text using the regular expression `'Error \(4[0-9]\+\)` with the following text: `Warning \1` where `\1` will copy the number captured in the regular expression.

{% alert(tip=true) %}
The command will have the form `sed 's/regex1/regex2/g`.

`s` indicates that it is a **s**ubstitution applied **g**lobally.
{% end %}

Use a Bash command to modify the messages and copy the result into `~/errors_3.txt`.

<details><summary>Solution</summary>

```bash
sed 's/Error \(4[0-9]\+\)/Warning \1/g' ~/errors_2.txt
```

</details>

---

## Program composition
Program composition is at the heart of the Unix philosophy.
Here is an excerpt from *The Art of Unix Programming* describing the importance of program composition (full chapter available [here](http://www.catb.org/esr/writings/taoup/html/ch01s06.html)).

> It's hard to avoid programming overcomplicated monoliths if none of your programs can talk to each other.
>
> Unix tradition strongly encourages writing programs that read and write simple, textual, stream-oriented, device-independent formats. Under classic Unix, as many programs as possible are written as simple filters, which take a simple text stream on input and process it into another simple text stream on output.
>
> Despite popular mythology, this practice is favored not because Unix programmers hate graphical user interfaces. It's because if you don't write programs that accept and emit simple text streams, it's much more difficult to hook the programs together.
>
> Text streams are to Unix tools as messages are to objects in an object-oriented setting. The simplicity of the text-stream interface enforces the encapsulation of the tools. More elaborate forms of inter-process communication, such as remote procedure calls, show a tendency to involve programs with each others' internals too much.
>
> To make programs composable, make them independent. A program on one end of a text stream should care as little as possible about the program on the other end. It should be made easy to replace one end with a completely different implementation without disturbing the other.
>
> — Chapter 1. Philosophy, Rule of Composition

This program composition can be achieved using different operators, which will be the subject of the next sections.

### Composition
The `;` operator allows you to run one command after another on the same line.

(`command1 ; command2`)

For example, for exercise 7, we could rewrite the program as follows:

```bash
mkdir output; mv *.out output/; rm *.tmp; rm -r temp
```

The `&&` operator runs the second command only if the first one succeeded (returns an exit code equal to zero).

(`command1 && command2`)

```bash
# Prints "Hello World" because both commands succeed
echo 'Hello' && echo 'World'

# We print Hello because the directory exists, so cd succeeds
cd existing_directory && echo 'Hello

# We do not print Hello because the directory does not exist, so cd fails
cd non_existent_directory && echo 'Hello'
```

The `||` operator runs the second command only if the first one failed (returns a non-zero exit code).

(`command1 || command2`)

```bash
# Prints only Hello, because echo 'Hello' succeeds
echo 'Hello' || echo 'World'

# We do not print Hello, because cd succeeds
cd existing_file || echo 'Hello'

# We print Hello, because cd fails
cd non_existing_file || echo 'Hello'
```

### Pipes
The `|` operator passes the output of one command as input to another.
This operator is also called a *pipe*.

(`command1 | command2`)

```bash
# List files, and keep only .txt
ls | grep ".txt"

# Sort the lines of a file, keep only the first 5 lines
cat file.txt | sort | head -n 5
```

### Redirection
The `>` operator redirects a command’s output to a file, overwriting the file.

(`command > file`)

```bash
ls > file.txt
```

For example, it is possible to download a text file with `curl`:

```bash
curl https://www.ulaval.ca/ > ulaval.txt
```

To discard a command’s output:

```bash
ls > /dev/null 2>&1
```

The `<` operator redirects a command’s input from a file.

(`command < file`)

```bash
wc < file.txt
```

The `>>` operator, like `>`, redirects a command’s output to a file, but **appends** to the end of the file rather than overwriting it:

(`command >> file`)

```bash
ls >> file.txt
```

The `<<` operator is like `<`, but allows you to pass multiple lines.

(`command <<delim [multiple lines] delim`)

```bash
cat <<EOF
abc
def
hij
EOF
# We can replace EOF (end of file) with any other string
cat <<ABC
abc
def
hij
ABC
```

**Examples**

```bash
# Find the first 5 .txt in alphabetical order
ls -l | grep ".txt" | sort | head -n 5
# 1. List the files
# 2. Keep only files containing .txt in their name
# 3. Sort alphabetically
# 4. Keep only the first 5 results

# Keep only lines containing the text "warning",
# replace "warning" with "error", then write the result to output.txt
cat data.txt | grep "warning" | sed 's/warning/error/g' > output.txt
# 1. Display the contents of data.txt
# 2. Filter lines to keep only those containing "warning"
# 3. Apply a regex to replace "warning" with "error"
# 4. > writes the result to the file output.txt

# Generate a test file
echo -e "1\t2\n2\t3\n3\t4\n" > foo.txt
# 1. Display a formatted string
# 2. Write the result to foo.txt

# Compute the sum of each column
cat foo.txt | awk '{sum += $1; sum2 += $2} END {print sum; print sum2}' \
    | xargs echo "Sum of both columns"
# 1. Display the contents of foo.txt
# 2. Awk accumulates column sums and prints them
# 3. Pass the awk result to echo
```

We recommend trying these commands one at a time to fully understand each step of the pipeline, for example:

```bash
ls -l
ls -l | grep ".txt"
ls -l | grep ".txt" | sort |
ls -l | grep ".txt" | sort | head -n 5
```

### Exercise 12 – Piping and redirection
Use piping and redirection to rewrite exercises 9, 10 and 11 as a single command.

<details><summary>Solution</summary>

```bash
grep Error messages.txt | uniq | sed 's/Error \(4[0-9]\+\)/Warning \1/g' > ~/out_12.txt
```

</details>

### Exercise 13 – File sizes
Use this command which returns the list of files and their size:

```bash
find Documents -type f | xargs du -sb
```

Each line contains the size in bytes and the file name separated by a <kbd>Tab</kbd> character.
Use the output of this command to find the five largest files. Your script must return five lines in the same format as `du`.

<details><summary>Solution</summary>

```bash
find ~/Documents -type f | xargs du -sb | sort -rh | head -n 5 > ~/out_13.txt
# or
find ~/Documents -type f | xargs du -sb | sort -h | tac | head -n 5 > ~/out_13.txt
# or
find ~/Documents -type f | xargs du -sb | sort -h | tail -n 5 | tac > ~/out_13.txt
# or
find ~/Documents -type f -exec du -sb {} + | sort -rh | head -n 5 > ~/out_13.txt
```

</details>

### Exercise 14 – Data analysis
The file `~/ApplicationData/db.tsv` contains data in TSV format (*TAB separated value*).
Format:

| id | date | name | type | size |
|----|------|------|------|------|
| 123 | 2023-12-25 | foo | error_log | 23 |

Use this file to find the 10 rows with the smallest size (size column), keeping only the name column. You must keep the header of the retained column, i.e. the first line of `~/out_14.txt` should be `name`.

{% alert(note=true) %}
To accomplish this task, you can use `awk`, a programming language specialized for text manipulation.
For example, to extract the 1st and 3rd columns, separated by a <kbd>Tab</kbd>:

```bash
awk '{print $1 "\t" $3}' file.txt
```
{% end %}

<details><summary>Solution</summary>

```bash
awk '{print $5 " " $3}' db.tsv | sort -h | head -n 11 | awk '{print $2}' > ~/out_14.txt
# or
awk '{print $5 " " $3}' db.tsv | sort -h | head -n 11 | sed 's/^[^ ]* //' > ~/out_14.txt
```

</details>

---

## Scripting
Now that you are more comfortable with Bash, it’s time to create more advanced scripts.

The following examples will help you understand how to create scripts that can take arguments, use variables, and implement control structures such as conditionals and loops.

```bash
#!/usr/bin/env bash
# The script arguments are available with $n (where n is a natural number)
echo "The script name is: $0"
echo "The first argument is: $1"
echo "The second argument is: $2"
echo "All arguments: $@"
# {@:2:3} means take a slice starting at 2 (1-based) of length 3
echo "Arguments from 2 to 4: ${@:2:3}"

# Variables; note there are no spaces around the = sign
name="John"
age=25
# $age substitutes the variable’s value inside a string between double quotes
echo "My name is $name and I am $age years old."
# Environment variables
echo "The value of HOME is: $HOME"

# Substitution
current_directory=$(pwd)
# Substitutions work only for double quotes "
echo "The current directory is: $current_directory using double quotes"
# Not for single quotes '
echo 'The current directory is: $current_directory using single quotes'
# It is also possible to call a command directly inside a string
path="$(pwd)"/my/path
echo "Path: $path"

# Conditionals
if [ "$age" -ge 18 ]; then
  echo "You are an adult."
else
  echo "You are a minor."
fi

# Loops
for i in 1 2 3 4 5
do
    echo $i
done

fruits=("apple" "banana" "orange")
for fruit in "${fruits[@]}"
do
    echo "I like $fruit"
done

counter=1
while [ $counter -le 5 ]
do
    echo $counter
    ((counter++))
done

# Function
greet() {
  echo "Hello, $1!"
}

greet "Alice"
```

### Exercise 15 – Test script

After all that cleaning and analysis, you decide it is wiser to just roll back to a previous version of the server until the problem is fixed.
As you are not sure which version is functional, you decide to write a script that will test the server and roll back to the previous version if the test fails.

The first step is to write a script that tests whether the server is functional.
Save this script in the file `~/test.sh`, and give it execute permissions.

```bash
#!/usr/bin/env bash

cd ~/server

# Start the server in the background
python3 -m uvicorn main:app &
# Save the process ID (pid) of the server with $!
# $! returns the pid of the last background process started
server_pid=$!

# The `stop_server` function stops the server process
stop_server() {
  kill $server_pid
}

# Register the `stop_server` function to be called when this script exits
trap stop_server EXIT

# Wait for the server to be ready
sleep 1

# TODO make an HTTP request to localhost:8000

# TODO If the result is an error, exit with code 1 using `exit 1`
# $? contains the return code of the last command
```

<details><summary>Solution</summary>

```bash
#!/usr/bin/env bash

cd ~/server

# Start the server in the background
python3 -m uvicorn main:app &
# Save the process ID (pid) of the server with $!
server_pid=$!

# The `stop_server` function stops the server process
stop_server() {
  kill $server_pid
}

# Register the `stop_server` function to be called when this script exits
trap stop_server EXIT

# Wait for the server to be ready
sleep 1

# TODO make an HTTP request to localhost:8080
curl localhost:8000 > /dev/null 2> /dev/null

# TODO If the result is an error, exit with code 1 using `exit 1`
# $? contains the return code of the last command
if [ $? -eq 0 ]; then
  echo "Server is up"
else
  echo "Server is down"
  exit 1
fi
```

</details>

### Exercise 16 – Version rollback script

Now that you have a test script, you can write a script that will roll back to the previous version of the server if the test fails.
Use the given `revert_last_commit` function to roll back to the previous version of the server.

Complete the following script to roll back to a previous version of the server until the test script passes.
Save this script in the file `~/revert.sh`, and give it execute permissions.

```bash
#!/usr/bin/env bash

cd ~/server

revert_last_commit() {
  git reset HEAD~1 --hard
}

exit_status=1
# TODO write a while loop while $exit_status is not equal to 0
# At each iteration, run the test.sh script
# If the script exits with code 0, stop the script with exit 0
# Otherwise, call the `revert_last_commit` function
```

<details><summary>Solution</summary>

```bash
#!/usr/bin/env bash

cd ~/server

revert_last_commit() {
  git reset HEAD~1 --hard
}

exit_status=1
while [ $exit_status -ne 0 ]; do
  # Run the test script
  ~/test.sh > /dev/null 2>&1
  # Save the test script status
  exit_status=$?

  if [ $exit_status -ne 0 ]; then
    echo "The script returned a non-zero exit status ($exit_status). Reverting commit and retrying..."
    revert_last_commit
  else
    echo "The script returned 0 (success)."
    exit 0
  fi

  # Add a delay between retries (optional)
  sleep 1
done
```

</details>

---

## Extras

### `.bashrc` file

Below are optional enhancements you can add to your `~/.bashrc` (or `~/.bash_profile` depending on your shell startup rules) to make day‑to‑day terminal work more pleasant.

#### Prompt customization
Simple minimal prompt (user@host:cwd$):

```bash
PS1='\u@\h:\w$ '
```

Prompt with colors, Git branch and exit code indicator (status inlined, no helper function):

```bash
# Compute git branch (if any)
parse_git_branch() {
  git rev-parse --is-inside-work-tree > /dev/null 2>&1 || return
  local br
  br=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
  [ -n "$br" ] && printf ' (%s)' "$br"
}

prompt_command() {
  local exit=$?  # exit status of previous command
  local status
  if [ $exit -eq 0 ]; then
    status='\[\e[32m\]✔\[\e[0m\]'
  else
    status="\[\e[31m\]✘ $exit\[\e[0m\]"
  fi
  local git_segment=""
  if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    git_segment=$(parse_git_branch)
  fi
  PS1="\[\e[36m\]\u@\h\[\e[0m\]:\[\e[33m\]\w\[\e[0m\]${git_segment} ${status}\n$ "
}
PROMPT_COMMAND=prompt_command
```

Retro prompt:

```bash
workshop_prompt() {
  local code=$?
  local green="\[\e[32m\]" red="\[\e[31m\]" cyan="\[\e[36m\]" yellow="\[\e[33m\]" reset="\[\e[0m\]"
  local status
  if [ $code -eq 0 ]; then
    status="${green}OK${reset}"
  else
    status="${red}ERR:${code}${reset}"
  fi
  local branch=""
  if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    b=$(git symbolic-ref --short HEAD 2>/dev/null || git rev-parse --short HEAD 2>/dev/null)
    branch=" ${yellow}${b}${reset}"
  fi
  # Add user@host and current directory like the earlier prompt example
  # Format: user@host:cwd [diag:STATUS]{ branch}
  PS1="${cyan}\u@\h${reset}:${yellow}\w${reset} ${cyan}[${status}]${reset}${branch}\n$ "
}
PROMPT_COMMAND=workshop_prompt
```

#### Safety & quality of life options

```bash
# Safer rm / mv / cp
alias rm='rm -i'
alias mv='mv -i'
alias cp='cp -i'

# Human readable sizes for common tools
alias l='ls -lh'
alias la='ls -lah'
alias lt='ls -lht'

# Grep with color
alias grep='grep --color=auto'

# Shortcuts to common folders
alias docs='cd ~/Documents'
alias dls='cd ~/Downloads'
alias desk='cd ~/Desktop'

# Some fun aliases
alias please='sudo'
alias emacs='vim'
```

Enable some helpful shell options:

```bash
# Append to history (do not overwrite) and share across sessions
shopt -s histappend
# Re-edit a failed history substitution rather than error
shopt -s histreedit
# Correct minor directory typos with cd
shopt -s cdspell 2>/dev/null || true
```

### Functions

```bash
# Extract various archive formats with one command
extract() {
  [ -f "$1" ] || { echo "File not found: $1" >&2; return 1; }
  case "$1" in
    *.tar.bz2) tar xjf "$1" ;;
    *.tar.gz)  tar xzf "$1" ;;
    *.tar.xz)  tar xJf "$1" ;;
    *.tar)     tar xf  "$1" ;;
    *.tbz2)    tar xjf "$1" ;;
    *.tgz)     tar xzf "$1" ;;
    *.zip)     unzip   "$1" ;;
    *.rar)     unrar x "$1" ;;
    *.7z)      7z x    "$1" ;;
    *) echo "Don't know how to extract '$1'" >&2; return 2 ;;
  esac
}

# Quickly serve current directory over HTTP (Python 3)
serve() {
  local port=${1:-8000}
  echo "Serving on http://localhost:${port} (Ctrl+C to stop)"
  python3 -m http.server "$port"
}
```

### `PATH`

The `PATH` environment variable contains a list of directories where the shell looks for executable files when you type a command.
When you type a command, the shell searches through each directory in the `PATH` variable in order until it finds an executable file that matches the command name.
The first matching executable is executed.

The value of `PATH` is a colon-separated list of directories.
Adding directories to your `PATH` allows you to run executables located in those directories without specifying their full path.
For example, if you have a script located in `~/.bin`, you can add this directory to your `PATH` variable to run the script from anywhere.

```bash
export PATH="$PATH:~/.bin"
```

### Alias git

As you will likely use `git` a lot, here are some useful aliases to add to your `~/.bashrc` or `~/.gitconfig` file.
Aliases allow you to create shortcuts for long commands.
You can add these aliases in your `~/.gitconfig` file under the `[alias]` section.
Here's an example of useful `git` aliases from [here](https://gist.github.com/willGuimont/79a8611a6a157db98945ae631ce847da):

```ini
[alias]
	lg1 = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)- %an%C(reset)%C(bold yellow)%d%C(reset)' --all
	lg2 = log --graph --abbrev-commit --decorate --format=format:'%C(bold blue)%h%C(reset) - %C(bold cyan)%aD%C(reset) %C(bold green)(%ar)%C(reset)%C(bold yellow)%d%C(reset)%n''          %C(white)%s%C(reset) %C(dim white)- %an%C(reset)' --all
	lg = !"git lg1"
  adog = log --all --decorate --oneline --graph
	st = status
	co = commit
	com = commit -m
	coam = commit --amend
	a = add
	aa = add .
	p = push
	pu = push -u origin HEAD
	cb = checkout -b
	c = checkout
	m = merge
	f = fetch
	g = pull
	wip = commit -a -m "wip"
	wap = commit -a -m
	todo = !"git commit -a -m \"todo\" && git p"
	obs = !"git commit -a -m \"obsidian\" && git p"
	refs = !"git pull && git commit -a -m \"updated references\" && git p"
	figs = !"git pull && git commit -a -m \"updated figures\" && git p"
	wdiff = diff --word-diff-regex=.
[pull]
    ff = only
```
