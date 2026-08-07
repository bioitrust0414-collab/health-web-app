import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { getStoredProfileId } from "@/lib/memberSession";

export function SocialFab() {
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    setIsMember(Boolean(getStoredProfileId()));
  }, []);

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
      {isMember ? (
        <Link to="/member" search={{ profileId: undefined, token: undefined, lineUserId: undefined }} className="social-btn line">
          LINE
        </Link>
      ) : (
        <a
          href="https://line.me/ti/p/@932cczax"
          target="_blank"
          rel="noreferrer"
          className="social-btn line"
        >
          LINE
        </a>
      )}
    </div>
  );
}
