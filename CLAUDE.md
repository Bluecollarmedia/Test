# CORCONCRETE Timeline

## Deployment
- **Site**: lachatzcamp.netlify.app
- **Netlify site name**: lachatzcamp
- **Deploy method**: Push to GitHub → GitHub Actions deploys to Netlify automatically

When the user asks to add something to the timeline, edit `index.html`, commit, and push to the current branch. GitHub Actions will deploy to Netlify automatically.

## Required GitHub Secrets (set once in repo settings)
- `NETLIFY_AUTH_TOKEN` — Netlify personal access token
- `NETLIFY_SITE_ID` — Netlify site ID (get from: Netlify dashboard → Site settings → General → Site ID)

## Timeline structure
The timeline is a scroll-driven canvas animation in `index.html`. It has three phases:
1. **Coming Together** (0–30%): two caution tape strips join
2. **Roll Forming** (30–50%): tape roll appears
3. **Winding Up** (50–100%): tape winds onto the roll
