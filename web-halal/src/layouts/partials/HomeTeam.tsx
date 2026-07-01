import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  href?: string;
}

interface HomeTeamProps {
  tag?: string;
  heading?: string;
  description?: string;
  members: TeamMember[];
}

export default function HomeTeam({
  tag = "Đội ngũ của chúng tôi",
  heading = "Về chúng tôi",
  description = "Đội ngũ với bề dày kinh nghiệm về kiến trúc, nền móng thiết kế và quản trị dự án.",
  members,
}: HomeTeamProps) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 xl:max-w-[1290px]">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left — sticky heading block */}
          <div
            className="flex flex-col justify-start lg:sticky lg:top-20 self-start"
            data-aos="fade-right-sm"
          >
            <p className="text-secondary text-sm font-semibold uppercase tracking-widest mb-3">
              {tag}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4">
              {heading}
            </h2>
            <p className="text-xl md:text-2xl font-semibold text-dark leading-snug">
              {description}
            </p>
          </div>

          {/* Right — 2×2 grid */}
          <div className="lg:col-span-2 flex flex-wrap gap-[35px_30px]">
            {members.map((member, i) => (
              <div
                key={i}
                className="group flex-[0_0_calc(50%-15px)] max-w-[calc(50%-15px)]"
                data-aos="fade-up-sm"
                data-aos-delay={i * 100}
              >
                <Link
                  href={member.href ?? "#"}
                  className="block overflow-hidden rounded-2xl"
                >
                  <ImageFallback
                    src={member.image}
                    width={360}
                    height={480}
                    alt={member.name}
                    className="w-full aspect-[3/4] object-cover object-top rounded-2xl transition-transform duration-300 group-hover:scale-[1.08]"
                  />
                </Link>
                <div className="mt-7">
                  <h3 className="font-bold text-dark text-xl">{member.name}</h3>
                  <p className="text-dark/60 text-sm mt-1">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
