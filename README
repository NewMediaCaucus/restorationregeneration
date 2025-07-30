# Branches

Always name a feature branch "feature-<description>". For example, "feature-add-textarea-charcount".

# The restoration/regeneration website

1. [Important File Locations](#important-file-locations)
2. [Workflow Proposal](#workflow-proposal)
3. [Further Reading](#further-reading)
4. [Rolling Back](#rolling-back)

## Important File Locations

- Content
  - This folder is managed under a seperate repo. See `[README-content-folder.md](https://github.com/NewMediaCaucus/restorationregeneration/blob/dev/README-content-folder.md)` for more information.
- Kirby
  - Leave this alone unless updating the Kirby CMS
- Media
  - Leave this alone too, contents are auto-generated
- Site
   - Blueprints
     - Controls how the panel operates
   - Snippets
     - PHP code snippets
   - Templates
     - PHP page templates 
 
## Workflow Proposal

Kirby relies on four main folders: kirby, media, site, and content. In order to keep our repo from getting too big, we'll use .gitignore to exclude the media and content folders (with one or two individual file exceptions). 

The dev team should install: 
- Docker or mamp/xamp
- Github Desktop (https://desktop.github.com/download/) and Git Large File Storage (https://git-lfs.com/)
- [git-lfs](https://git-lfs.com/)
  - Mac users can install git-lfs by running
    - brew install git-lfs
    - git lfs install
    - sudo git lfs install --system
- Coding IDE (ex: Visual Studio Code)
- Apache server, php8 (our Docker Compose will do this for you or mampp/xampp)
- php composer (used to update kirby and install/update plugins into the vendor folder)

Set up local repository:
- Clone the restorationregeneration repo at C://xampp/htdocs (win)
- Clone the restorationregeneration-content repo. See the [README-content-folder.md](https://github.com/NewMediaCaucus/restorationregeneration/blob/dev/README-content-folder.md) for how-to
- Changes focus on site operation and style, not content
- All changes should have detailed notes

Still needed:
- Solution to back up content and media folders to offline storage

## Further Reading

1. [Git large file storage info](https://docs.github.com/en/repositories/working-with-files/managing-large-files/collaboration-with-git-large-file-storage)
2. [Checking out a previous commit](https://docs.github.com/en/desktop/managing-commits/checking-out-a-commit-in-github-desktop)
3. [Resetting the panel](https://forum.getkirby.com/t/problems-with-panel-access/24815/2)