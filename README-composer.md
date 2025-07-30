# Installing PHP Composer and Kirby Plainkit

This guide provides step-by-step instructions for installing PHP Composer and Kirby Plainkit on macOS and Windows.

## Prerequisites

### macOS
- macOS (tested on darwin 24.5.0)
- Homebrew (for easy PHP installation)
- Terminal access

### Windows
- Windows 10/11 (64-bit recommended)
- Command Prompt or PowerShell access

## Step 1: Install PHP

### macOS

#### Check if PHP is already installed
```bash
php --version
```

#### If PHP is not installed, install it via Homebrew
```bash
# Check if Homebrew is installed
which brew

# Install PHP via Homebrew
brew install php
```

#### Verify PHP installation
```bash
php --version
# Should output something like: PHP 8.4.10 (cli) (built: Jul 2 2025 02:22:42) (NTS)
```

### Windows

#### Method 1: Install via XAMPP
1. Download XAMPP from [https://www.apachefriends.org/](https://www.apachefriends.org/)
2. Run the installer and follow the setup wizard
3. During installation, make sure to select PHP
4. After installation, add PHP to your PATH:
   - Open System Properties → Advanced → Environment Variables
   - Edit the PATH variable and add: `C:\xampp\php`
   - Click OK to save

#### Method 2: Install via Chocolatey (if you have Chocolatey installed)
```cmd
# Install Chocolatey first if you don't have it
# Run PowerShell as Administrator and execute:
# Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install PHP via Chocolatey
choco install php
```

#### Method 3: Manual installation
1. Download PHP from [https://windows.php.net/download/](https://windows.php.net/download/)
2. Extract to `C:\php`
3. Copy `php.ini-development` to `php.ini`
4. Add `C:\php` to your PATH environment variable
5. Restart Command Prompt/PowerShell

#### Verify PHP installation
```cmd
php --version
# Should output something like: PHP 8.4.10 (cli) (built: Jul 2 2025 02:22:42) (NTS)
```

## Step 2: Install Composer

### macOS

#### Download and install Composer
```bash
# Download Composer installer
curl -sS https://getcomposer.org/installer | php

# Move to user bin directory (if you don't have sudo access)
mkdir -p ~/bin
mv composer.phar ~/bin/composer
chmod +x ~/bin/composer

# Add ~/bin to your PATH
echo 'export PATH="$HOME/bin:$PATH"' >> ~/.zshrc

# Reload shell configuration
source ~/.zshrc
```

#### Alternative: Install globally (requires sudo)
```bash
# If you have sudo access, you can install globally
sudo mv composer.phar /usr/local/bin/composer
```

#### Verify Composer installation
```bash
composer --version
# Should output something like: Composer version 2.8.10 2025-07-10 19:08:33
```

### Windows

#### Method 1: Install via Composer-Setup.exe (Recommended)
1. Download Composer-Setup.exe from [https://getcomposer.org/download/](https://getcomposer.org/download/)
2. Run the installer and follow the setup wizard
3. The installer will automatically detect your PHP installation
4. Choose whether to add Composer to your PATH (recommended)

#### Method 2: Manual installation
```cmd
# Download Composer installer
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"

# Verify the installer
php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ff031906575712edab6f13eb0b5f55c5f5b8b1f92f36fec7f77b' . 'a9b44dbb290a9dd472f3366e7862a2124b199d041b9b2d04f2b3a08a44be0c6') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"

# Run the installer
php composer-setup.php

# Remove the installer
php -r "unlink('composer-setup.php');"

# Move composer.phar to a directory in your PATH
# For example, create C:\composer and add it to your PATH
mkdir C:\composer
move composer.phar C:\composer\composer.bat
```

#### Method 3: Install via Chocolatey
```cmd
choco install composer
```

#### Verify Composer installation
```cmd
composer --version
# Should output something like: Composer version 2.8.10 2025-07-10 19:08:33
```

## Step 3: Install Kirby Plainkit

### macOS

#### Method 1: Create a new project (if directory is empty)
```bash
# Create a new Kirby Plainkit project
composer create-project getkirby/plainkit .
```

#### Method 2: Add to existing project (recommended for existing projects)
```bash
# Allow Kirby Composer plugin
composer config allow-plugins.getkirby/composer-installer true

# Install Kirby Plainkit
composer require getkirby/plainkit

# Create necessary directories
mkdir -p site/{config,content,accounts,cache,sessions} media

# Create basic configuration file
cat > site/config/config.php << 'EOF'
<?php

return [
    'debug' => true,
    'panel' => [
        'install' => true
    ],
    'hooks' => [
        'route:before' => function ($route, $path, $method) {
            // Add any custom route handling here
        }
    ]
];
EOF

# Create main index.php file
cat > index.php << 'EOF'
<?php

/**
 * Kirby Plainkit
 */

require 'kirby/bootstrap.php';

echo (new Kirby())->render();
EOF
```

#### Verify Kirby installation
```bash
# Check if Kirby files are present
ls -la site/
ls -la kirby/
ls -la index.php
```

### Windows

#### Method 1: Create a new project (if directory is empty)
```cmd
# Create a new Kirby Plainkit project
composer create-project getkirby/plainkit .
```

#### Method 2: Add to existing project (recommended for existing projects)
```cmd
# Allow Kirby Composer plugin
composer config allow-plugins.getkirby/composer-installer true

# Install Kirby Plainkit
composer require getkirby/plainkit

# Create necessary directories
mkdir site\config site\content site\accounts site\cache site\sessions media

# Create basic configuration file
echo ^<?php > site\config\config.php
echo. >> site\config\config.php
echo return [ >> site\config\config.php
echo     'debug' =^> true, >> site\config\config.php
echo     'panel' =^> [ >> site\config\config.php
echo         'install' =^> true >> site\config\config.php
echo     ], >> site\config\config.php
echo     'hooks' =^> [ >> site\config\config.php
echo         'route:before' =^> function ($route, $path, $method) { >> site\config\config.php
echo             // Add any custom route handling here >> site\config\config.php
echo         } >> site\config\config.php
echo     ] >> site\config\config.php
echo ]; >> site\config\config.php

# Create main index.php file
echo ^<?php > index.php
echo. >> index.php
echo /** >> index.php
echo  * Kirby Plainkit >> index.php
echo  */ >> index.php
echo. >> index.php
echo require 'kirby/bootstrap.php'; >> index.php
echo. >> index.php
echo echo (new Kirby())^->render(); >> index.php
```

#### Verify Kirby installation
```cmd
# Check if Kirby files are present
dir site
dir kirby
dir index.php
```

## Step 4: Configure your project

### Set up your Kirby site
1. Copy the `site/config/config.php.example` to `site/config/config.php`
2. Edit the configuration file with your site settings
3. Set up your content structure in the `content/` directory

### Set up your web server
Make sure your web server points to the project root directory.

## Troubleshooting

### macOS Common Issues

#### 1. "php not found" error

- Make sure PHP is installed: `brew install php`
- Check your PATH: `echo $PATH`

#### 2. "Permission denied" when moving composer

- Use the user directory method: `mv composer.phar ~/bin/composer`
- Or use sudo if you have access: `sudo mv composer.phar /usr/local/bin/composer`

#### 3. "Project directory is not empty" error

- Use `composer require getkirby/plainkit` instead of `composer create-project`
- Or create the project in a new directory

#### 4. "Composer plugin is blocked" error

```bash
composer config allow-plugins.getkirby/composer-installer true
```

### Windows Common Issues

#### 1. "php is not recognized" error

- Make sure PHP is installed and added to PATH
- Restart Command Prompt/PowerShell after adding to PATH
- Check if PHP is in PATH: `echo %PATH%`

#### 2. "composer is not recognized" error

- Make sure Composer is installed and added to PATH
- Restart Command Prompt/PowerShell after installation
- Try running: `php composer.phar` instead of `composer`

#### 3. "Project directory is not empty" error

- Use `composer require getkirby/plainkit` instead of `composer create-project`
- Or create the project in a new directory

#### 4. "Composer plugin is blocked" error

```cmd
composer config allow-plugins.getkirby/composer-installer true
```

#### 5. SSL/TLS errors on Windows

- Update your Windows certificates
- Or use: `composer config --global disable-tls true`

### Useful Commands

#### macOS

```bash
# Check PHP version
php --version

# Check Composer version
composer --version

# Update Composer
composer self-update

# Check Kirby installation
ls -la kirby/

# Install additional Kirby plugins
composer require getkirby/your-plugin-name

# Update all dependencies
composer update
```

#### Windows

```cmd
# Check PHP version
php --version

# Check Composer version
composer --version

# Update Composer
composer self-update

# Check Kirby installation
dir kirby

# Install additional Kirby plugins
composer require getkirby/your-plugin-name

# Update all dependencies
composer update
```

## File Structure

After installation, your project should have this structure:
```
your-project/
├── .gitignore
├── composer.json
├── composer.lock
├── kirby/          # Kirby CMS core files
├── site/           # Your site configuration and content
│   ├── config/
│   ├── content/
│   ├── accounts/
│   ├── cache/
│   └── sessions/
├── media/          # Media files
└── README-composer.md
```

## Next Steps

1. **Configure your site**: Edit `site/config/config.php`
2. **Set up content**: Create your content structure in `site/content/`
3. **Configure web server**: Point your web server to the project root
4. **Install plugins**: Use `composer require` to add Kirby plugins
5. **Set up development environment**: Configure your local development setup

## Installing Kirby Plugins

### Installing Plugins via Composer

Kirby plugins can be installed using Composer. Here are some common plugins and how to install them:

#### Kirby Git Content Plugin

The kirby-git-content plugin tracks changes to content in a Git repository, automatically committing content changes.

**Installation:**

```bash
composer require thathoff/kirby-git-content
```

**What it does:**

- Tracks changes to Kirby content in a Git repository
- Automatically commits content changes to Git
- Provides version control for your site content
- Compatible with Kirby 3.6+, 4.0+, and 5.0+

**Plugin details:**

- **Version**: v5.3.0 (latest)

- **License**: MIT License
- **Location**: `site/plugins/git-content`
- **Dependencies**: czproject/git-php

#### Finding and Installing Plugins

**Search for plugins:**

```bash
composer search kirby-plugin-name
```

**Install any plugin:**

```bash
composer require vendor/plugin-name
```

**Check installed plugins:**

```bash
composer show
```

**Update plugins:**

```bash
composer update
```

## Resources

- [Kirby Documentation](https://getkirby.com/docs)
- [Composer Documentation](https://getcomposer.org/doc/)
- [Kirby Plainkit Repository](https://github.com/getkirby/plainkit)

---

**Note**: This guide covers both macOS and Windows installations. The steps are similar but use different commands and tools appropriate for each operating system.