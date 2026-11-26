"use client";

import { useEffect, useState } from "react";

/** Where Zuhayr is. Pakistan keeps one time all year, five hours ahead of UTC. */
export const HOME_ZONE = "Asia/Karachi";

/** The time where Zuhayr is, so a client can tell at a glance whether he is likely awake. */
const LocalTime = () => {
  const [now, setNow] = useState("");
  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", { timeZone: HOME_ZONE, hour: "numeric", minute: "2-digit" });
    const tick = () => setNow(format.format(new Date()));
    tick();
    const timer = window.setInterval(tick, 15_000);
    return () => window.clearInterval(timer);
  }, []);
  return <span className="tabular-nums">{now || "\u2007\u2007:\u2007\u2007"}</span>;
};

export default LocalTime;
