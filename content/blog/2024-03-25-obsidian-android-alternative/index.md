+++
authors = ["William Guimont-Martin"]
title = "Another Way To Sync Obsidian vaults to Android using Git"
description = "How to sync your Obsidian vault to an Android phone using Git"
date = 2024-03-25
# updated = ""
# draft = false
[taxonomies]
tags = ["Computer Sciences", "Obsidian"]
[extra]
# banner = ""
# toc = true
toc_inline = true
toc_ordered = true
# trigger = ""
# disclaimer = ""
+++

Updated way to sync your Obsidian vault to an Android phone using Git.
Previous method can be found [here](@/blog/2023-07-07-obsidian-android/index.md).

Here's the procedure to sync your <a class="external" href="https://obsidian.md/" target="_blank">Obsidian</a> vault to an Android phone.

First, you'll have to run these commands on your computer:
1. Create a SSH key using `ssh-keygen -f ~/obsidian-phone-key -t ed25519 -C "your_email@example.com"`
2. Add the public key (`~/obsidian-phone-key.pub`) to your GitHub account
3. Connect your phone to your computer and allow the computer to access phone data
4. Copy the private key (`~/obsidian-phone-key`) to your phone

Now, on your phone:
1. Install <a class="external" href="https://f-droid.org/" target="_blank">F-Droid</a>
2. Open F-Droid and install <a class="external" href="https://f-droid.org/packages/com.termux/" target="_blank">Termux</a>
3. In Termux, install `git` using `pkg install git`
4. In Termux install `termu-am` using `pkg install termux-am`
5. Mount the phone storage using `termux-setup-storage`
6. Copy your SSH key into `~/.ssh/` using `cp ~/storage/shared/path/to/obsidian-phone-key ~/.ssh/`
7. Now go to the location you want to clone the repository (should be in `~/storage/shared/` for Obsidian to have access) and clone it using `git clone git@github.com:username/repo.git`
8. You can now open Obsidian
	1. Open folder as vault
	2. Browse to the repository you copied from your computer
9. Open F-Droid and install <a class="external" href="https://f-droid.org/packages/com.manichord.mgit/" target="_blank">MGit</a>
10. From the settings page of MGit, import the SSH key
	1. SSH Keys
	2. Download button in the upper right corner
	3. Select `obsidian-phone-key` you copied from your computer
11. Go back to the main menu of MGit, press the three dots in the upper right and press the `Import Repository` button
12. Browse to the repository you copied from your computer
13. You should now be able to `pull` from MGit
14. Your Obsidian vault is now synced using Git!
15. (Optional) If you want to also be able to manage the repository from Termux, run the command `git config --global --add safe.directory ~/storage/shared/path/to/repo`
