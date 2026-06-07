export function getBaseUrl() {
  if (typeof process !== "undefined") {
    if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
    if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  
  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    // If we are on a Vercel preview branch, force the production domain so QR codes don't require login
    if (origin.includes("vercel.app") && origin.includes("-git-")) {
      // Try to extract the project name from the preview URL, or fallback to default
      // Format: https://<project-name>-git-<branch>-<team>.vercel.app
      const match = origin.match(/https:\/\/([^-]+)-git-/);
      if (match && match[1]) {
        return `https://${match[1]}.vercel.app`;
      }
      return "https://privechauffeur.vercel.app";
    }
    return origin;
  }
  
  return "https://privechauffeur.vercel.app";
}
