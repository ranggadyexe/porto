import { existsSync } from "node:fs";
import { join } from "node:path";
import { Hero } from "@/components/hero";
import { HomeSections } from "@/components/home-sections";

export default function Home() {
  const hasCv = existsSync(join(process.cwd(), "public", "cv.pdf"));
  const hasPhoto = existsSync(
    join(process.cwd(), "public", "foto-profil.png"),
  );

  return (
    <>
      <Hero hasCv={hasCv} hasPhoto={hasPhoto} />
      <HomeSections />
    </>
  );
}
