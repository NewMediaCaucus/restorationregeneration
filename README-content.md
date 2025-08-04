# Content Management

## Overview

The `content/` folder in this repository is created using the `restorationregeneration-content` repository. This setup allows for separate content management while maintaining the main application code in this repository.

## Repository Structure

- **Main Repository**: `restorationregeneration` (this repo)
  - Contains application code, templates, assets, and configuration
  - Has its own GitHub Actions workflow for deployment

- **Content Repository**: `restorationregeneration-content`
  - Contains only the content files (pages, images, etc.)
  - Has its own GitHub Actions workflow for content synchronization

## Content Repository Setup

### Cloning the Content Repository

The Kirby content folder is created by cloning our content GitHub repo:
- **Repo URL**: https://github.com/NewMediaCaucus/restorationregeneration-content
- **Note**: This repo is private, so you'll need GitHub permissions to access it.

**IMPORTANT**: You should clone it from _inside your restorationregeneration folder_ using:

```bash
git clone https://github.com/NewMediaCaucus/restorationregeneration-content content
```

This will clone using the folder name of "content" which is what Kirby is looking for.

### Kirby Folder Structure

The content folder follows Kirby's naming convention:

- `1_home` - Home page content
- Additional folders for other pages and sections

## Git LFS (Large File Storage)

This content folder uses Git LFS (Large File Storage) for managing large binary files like images.

### Installation
You can install Git LFS via [git-lfs.com](https://git-lfs.com/).

### Configuration
The repository includes a `.gitattributes` file that configures Git LFS for various file types:

```
*.zip filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.png filter=lfs diff=lfs merge=lfs -text
*.gif filter=lfs diff=lfs merge=lfs -text
*.webp filter=lfs diff=lfs merge=lfs -text
```

### Server Configuration
The staging and live servers have the restorationregeneration-content repo set as a remote using HTTPS with a Personal Access Token (PAT):

```
https://<github_PAT_goes_here>@github.com/NewMediaCaucus/restorationregeneration-content.git
```

Example:
```bash
git remote add origin https://<github_PAT_goes_here>@github.com/NewMediaCaucus/restorationregeneration-content.git
```

## Content Workflow

### kirby-git-content Plugin

The kirby-git-content plugin will commit new changes to the local content folder repo when an editor makes a change on PROD.

### push-content.yml

The `restorationregeneration-content` repository contains a GitHub Actions workflow called `push-content.yml` that automatically synchronizes content changes to the production server.

#### How it works:

1. **Trigger**: The workflow runs every 20 minutes via cron schedule, or can be triggered manually
2. **SSH Authentication**: Uses SSH to connect to the production server
3. **Content Sync**: Pulls latest changes from the main branch and pushes them to the content directory on the server

#### Workflow Steps:

```yaml
- name: Set up SSH
  uses: webfactory/ssh-agent@v0.5.4
  with:
    ssh-private-key: ${{ secrets.PRODUCTION_SSH_KEY }}

- name: Push committed changes
  run: |
    ssh -o StrictHostKeyChecking=no rrnmc@rr.shimmeringtrashpile.com 'cd /home/rrnmc/restorationregeneration/content && git pull origin main && git push origin main'
```

### The 'Push Content to Repository' GitHub Action

Our restorationregeneration-content repo has an action called 'Push Content to Repository' that runs every 20 minutes and pushes the committed changes to GitHub's restorationregeneration-content repo.

## Setup Requirements

### SSH Key Configuration

To enable the content workflow, you need to add an SSH private key as a GitHub secret:

1. **Generate SSH Key Pair** (if you don't have one):

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
   ```

2. **Add Public Key to Server**:
   - Copy the public key content (from `~/.ssh/id_rsa.pub`)
   - Add it to `/home/rrnmc/.ssh/authorized_keys` on the production server

3. **Add Private Key to GitHub Secrets**:
   - Go to: https://github.com/NewMediaCaucus/restorationregeneration-content/settings/secrets/actions
   - Create a new secret named `PRODUCTION_SSH_KEY`
   - Add the **private key** content (from `~/.ssh/id_rsa`)

### Important Notes

- **Private Key**: The secret should contain the SSH private key (not public key)
- **Key Format**: Include the entire key including `-----BEGIN OPENSSH PRIVATE KEY-----` and `-----END OPENSSH PRIVATE KEY-----` lines
- **Permissions**: Ensure the private key file has correct permissions (600) on your local machine
- **Server Access**: The SSH key must have access to the production server user account

## Content Updates

When content is updated in the `restorationregeneration-content` repository:

1. Changes are committed and pushed to the main branch
2. The `push-content.yml` workflow automatically triggers
3. Content is synchronized to `/home/rrnmc/restorationregeneration/content/` on the production server
4. The main application deployment workflow can then deploy the updated content

## Troubleshooting

If the content workflow fails:

1. **Check SSH Key**: Verify the private key is correctly added to GitHub secrets
2. **Server Access**: Ensure the SSH key has access to the production server
3. **Workflow Logs**: Check the GitHub Actions logs for specific error messages
4. **Manual Test**: Try connecting manually with the SSH key to verify it works
5. **Git LFS**: Ensure Git LFS is properly installed and configured on the server

## Related Files

- `content/.github/workflows/push-content.yml` - Content synchronization workflow
- `.github/workflows/deploy.yml` - Main application deployment workflow
- `deploy.sh` - Manual deployment script
