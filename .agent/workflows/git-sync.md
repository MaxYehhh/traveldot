---
description: Automatically sync changes to GitHub (Stage -> Commit -> Push)
---

1. Check current status
   ```bash
   git status
   ```

2. Add all changes
   ```bash
   git add .
   ```

3. Commit changes (Prompt for message, default to update)
   ```bash
   echo "Enter commit message (or press enter for 'Update project status'):"
   read msg
   if [ -z "$msg" ]; then
     msg="Update project status"
   fi
   git commit -m "$msg"
   ```

4. Push to current branch
   ```bash
   git push origin HEAD
   ```
