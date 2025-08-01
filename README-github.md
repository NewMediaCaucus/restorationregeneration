# A typical development workflow for restorationregeneration 

## Creating a branch to do coding in

### Pull `dev` and make a `feature/` branch
1. I pull dev so I have the latest changes on my local.

2. I create a feature branch from dev. I call mine `feature/<name of feature>` 
Note: It can be good practice to name your feature branches something close to your GitHub issue name. This makes it easy to keep track of stuff.

Ex: `git checkout -b feature/char-count-on-opps-textareas`
Ex: `git checkout -b feature/bugfix-mobile-media-query`
etc…

And then you might have a corresponding GitHub issue called

- "Character count on Opportunitites Textareas"

- "Bugfix mobile media query"

This is a "nice to have" but it can help.

A major benefit of feature branches is you can have a bunch of different features and experiments you're working on all at the same time "sandboxed" off from one another.

We'll use `feature/char-count-on-opps-textareas` for this example

NOTE: The `feature/` preamble is nonfunctional. It’s just a standard naming convention for feature branches. I'm sure there's a reason for it but I don't know what it is.

3. Code up your feature.

### Push your feature/ branch to GitHub

4. When I’m done writing my feature and have tested it on my localhost, I push my `feature/char-count-on-opps-textareas` branch to GitHub.

The `dev` branch is still untouched but now my branch is up on the shared GitHub.com repo.

4. I go to my `feature/` branch on GitHub and see it is ahead of `dev`. I create a pull request to pull my `feature/` branch in.

The `dev` branch is still untouched but now my branch is *in the queue to be merged* into dev.

In a larger team, another developer (typically a senior dev or some sort of manager person) would review my changes and either:

- approve the code and merge it.

- or kick the code back to me because something I did would break or has a security hole or is missing something important, isn’t up to coding standard, whatever.

### Merging feature/ into the Dev branch

6. Another human looks at my code, and if they think everything is cool, they then merge my pull request into `dev`.

OK! The `dev` branch now has my changes and other developers will get my code when they pull it.

### Deleting my now irrelevant feature/ branch
NOTE! My branch was merged into to dev! Woo hoo! I'm a coding god! This means my `feature/char-count-on-opps-textareas` branch is now irrelevant as it has been merged. It's just hanging around like single old sock full of holes. Get rid of it!

7. So I  delete my `feature/char-count-on-opps-textareas` branch from my local repo, and can delete this feature/ branch from GitHub.

Note! This is two places where it needs to be deleted.

- On my local using `git branch -d feature/char-count-on-opps-textareas`

- On GitHub. This is easy to do via https://github.com/NewMediaCaucus/nmc-website/branches. You'll see a little trashcan icon on the far right of the line containing the branch. Even coding gods still must keep their room clean.

## Merging the Dev branch into the Main branch

### Pull requesting a set of features from the Dev branch to the Main branch

Once `dev` has x many features that feel ready for testing or going live, `dev` is pull-requested into `main`.

8. Go to `main` (https://github.com/NewMediaCaucus//tree/main) and you'll see it is x commits behind `dev`.
Create a pull request and do the merge. Remember the confirmation step!

The GitHub Action that does continious intergration will now fire and our Staging server will pull this newly updated `main` branch.

Once this has happened the new features are live! You did it!

## Notes

### This is kind of a lot of steps, ya?
Yes. Pull requests can feel like overkill for a one or two-person team, *but* I think they are still worth doing as they create an understandable “paper trail” on GitHub, and it is also the de-facto way to collaborate with other people on other repos. For example, if we had a change we wanted to contribute back to Kirby core, this is how we’d do it. So it is always good to keep this skill fresh.

### `feature/` branches are "test tracks" `dev` is the "freeway."

Feature branches keep you safely out of `dev` except when when merging features. A developer should drive their experimental vehicle around on their local `feature/` test track, not on the `dev` freeway.

If a developer sits on edits in `dev` too long they are going to eventually get a merge conflict within `dev` that is a bit nasty to have to resolve. Merge conflicts on two separate branches are less messy and also don’t snarl traffic on `dev` freeway. A merge conflict is sort of like having a fender bender. A fender bender at the `feature/` test track impacts only you. A fender bender in middle of the `dev` freeway snarls traffic. Ouch.