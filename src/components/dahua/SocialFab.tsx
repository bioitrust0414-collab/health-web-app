import { LINE_OA_ADD_FRIEND_URL } from "@/data/externalLinks";

export function SocialFab() {
  return (
    <div className="social-fab">
      <a
        href="https://www.facebook.com/dahualabpeng"
        target="_blank"
        rel="noreferrer"
        className="social-btn facebook"
      >
        f
      </a>
      <a href={LINE_OA_ADD_FRIEND_URL} target="_blank" rel="noreferrer" className="social-btn line">
        LINE
      </a>
    </div>
  );
}
