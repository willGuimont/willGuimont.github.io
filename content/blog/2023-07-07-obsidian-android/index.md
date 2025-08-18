+++
authors = ["William Guimont-Martin"]
title = "Synchronise Obsidian vaults to Android using Git"
description = "Setup Obsidian synchronisation on Android"
date = 2023-07-07
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
archive = "Alternative way to sync your Obsidian vault to an Android phone using Git: [available here](@/blog/2024-03-25-obsidian-android-alternative/index.md)"
+++

Here's the procedure to sync your <a class="external" href="https://obsidian.md/" target="_blank">Obsidian</a> vault to an Android phone.

First, you'll have to run these commands on your computer:
1. Create a SSH key using `ssh-keygen -f ~/obsidian-phone-key -t ed25519 -C "your_email@example.com"`
2. Add the public key (`~/obsidian-phone-key.pub`) to your GitHub account
3. Connect your phone to your computer and allow the computer to access phone data
4. Copy the private key (`~/obsidian-phone-key`) to your phone
5. Also copy your Obsidian vault, including the `.git` folder

Now, on your phone:
1. Install <a class="external" href="https://f-droid.org/" target="_blank">F-Droid</a>
2. Open F-Droid and install <a class="external" href="https://f-droid.org/packages/com.manichord.mgit/" target="_blank">MGit</a>
3. From the settings page of MGit, import the SSH key
	1. SSH Keys
	2. Download button in the upper right corner
	3. Select `obsidian-phone-key` you copied from your computer
4. Go back to the main menu of MGit, press the three dots in the upper right and press the `Import Repository` button
5. Browse to the repository you copied from your computer
6. You should now be able to `pull` from MGit
7. You can now open Obsidian
	1. Open folder as vault
	2. Browse to the repository you copied from your computer
8. Your Obsidian vault is now synced using Git!
