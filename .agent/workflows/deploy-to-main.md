---
description: Merge dev branch into main and push to remote (Deploy to Production)
---
1. Checkout main branch
   ```bash
   git checkout main
   ```

2. Pull latest changes for main
   ```bash
   git pull origin main
   ```

3. Merge dev into main
   ```bash
   git merge dev
   ```

4. Push changes to origin main
   ```bash
   git push origin main
   ```

5. Switch back to dev branch
   ```bash
   git checkout dev
   ```
