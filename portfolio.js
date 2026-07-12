/**
 * portfolio.js
 *
 * Fetches the list of deployed projects for a GitHub user, straight from
 * GitHub's public API — no backend, no build step, no auth required.
 *
 * A repo counts as a "project" if:
 *   - it is not a fork
 *   - it is not this landing page's own repo
 *   - it has a "Website" URL set (repo Settings/About > website field)
 *
 * Usage (e.g. inside another script, or in a Cursor prompt):
 *
 *   const projects = await getMyProjects("artinmajd");
 *   // projects is an array of:
 *   // { name: string, description: string, url: string, repoUrl: string }
 *
 * Loop over `projects` and render one card per item — don't hardcode
 * individual project entries, so new projects show up automatically the
 * next time this page loads and you've added a Website URL on GitHub.
 */

const EXCLUDED_REPO_NAMES = ["landingpage"];

/**
 * @param {string} username - GitHub username to fetch public repos for.
 * @returns {Promise<Array<{name: string, description: string, url: string, repoUrl: string}>>}
 */
async function getMyProjects(username) {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
  );

  if (!response.ok) {
    throw new Error(`GitHub API request failed: ${response.status}`);
  }

  const repos = await response.json();

  return repos
    .filter((repo) => !repo.fork)
    .filter((repo) => !EXCLUDED_REPO_NAMES.includes(repo.name.toLowerCase()))
    .filter((repo) => !!repo.homepage)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || "",
      url: repo.homepage,
      repoUrl: repo.html_url,
    }));
}
