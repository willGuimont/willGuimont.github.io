---
layout: post
title: "Sync Obsidian vaults to Android using Git"
date: 2023-07-7 8:20:00 -0500
categories: cs
tags: [Computer Sciences, Obsidian]
color: rgb(110, 93, 157)
---

**UPDATE:** Alternative way to sync your Obsidian vault to an Android phone using Git: [available here]({{ site.url }}{% post_url 2024-03-25-obsidian-android-alternative %})

Here's the procedure to sync your [Obsidian](https://obsidian.md/) vault to an Android phone.

First, you'll have to run these commands on your computer:
1. Create a SSH key using `ssh-keygen -f ~/obsidian-phone-key -t ed25519 -C "your_email@example.com"`
2. Add the public key (`~/obsidian-phone-key.pub`) to your GitHub account
3. Connect your phone to your computer and allow the computer to access phone data
4. Copy the private key (`~/obsidian-phone-key`) to your phone
5. Also copy your Obsidian vault, including the `.git` folder

Now, on your phone:
1. Install [F-Droid](https://f-droid.org/)
2. Open F-Droid and install [MGit](https://f-droid.org/packages/com.manichord.mgit/)
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
