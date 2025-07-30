# Our Kirby Content Folder

The Kirby content folder is created by cloning our content github repo
Repo URL: https://github.com/NewMediaCaucus/restorationregeneration-content
Note: This repo is private, so you'll need GitHub permissions to access it.

IMPORTANT: You should clone it from _inside your restorationregeneration folder_ using:

`git clone <REPOSITORY_URL> content`

Example: `git clone https://github.com/NewMediaCaucus/restorationregeneration-content content`

This will clone using the folder name of "content" which is what kirby is looking for.

## Kirby folder names
1_home


## This content folder uses Git LFS (Large File Storage)
Git LFS is the Git Large File Storage.
You can install it via [github.com](https://git-lfs.com/).

You need to have a `.gitattributes` file for Git LFS. I created one that looks roughly like this so you shouldn't need to make one but check and make sure. 

```
*.zip filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text
```

### Staging and Live
These servers have the restorationregeneration-content repo set as a remote using https with a key.
https://<github_key_goes_here>@github.com/NewMediaCaucus/restorationregeneration-content.git

Example: `git remote add origin https://<github_key_goes_here>@github.com/NewMediaCaucus/restorationregeneration-content.git`

### The Kirby kirby-git-content plugin
The kirby-git-content plugin will commit new changes to the local content folder repo when an editor makes a change on PROD.

### The 'Push Content to Repository' GitHub Action
Our restorationregeneration-content repo has an action called 'Push Content to Repository'.
This runs every 5 minutes and pushes the commited changes to GitHub's restorationregeneration-content repo.
