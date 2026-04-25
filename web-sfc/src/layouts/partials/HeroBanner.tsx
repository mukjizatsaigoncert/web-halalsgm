import { markdownify } from "@/lib/utils/textConverter";
import { Homepage } from "@/types";
import Button from "../components/Button";

const HeroBanner = ({
  banner,
}: {
  banner: Homepage["frontmatter"]["banner"];
}) => {
  return (
    // bg-[url(/images/banner.png)]
    <section
      className={`section relative bg-[url(${banner.image})] bg-cover bg-center md:h-[calc(65svh)] lg:h-[calc(100svh_-_28px)]`}
    >
      <div className="container max-lg:mt-20 lg:h-full relative z-30">
        <div className="row h-full items-center justify-center lg:-translate-x-16 max-lg:text-center">
          <div className="md:col-8 relative">
            <div className="relative">
              <h1
                data-aos="fade-up-sm"
                data-aos-delay="100"
                className="h2 md:h1 text-white lg:text-[5rem] xl:text-[6rem] font-medium xl:leading-[6.56rem] tracking-tight text-balance"
                dangerouslySetInnerHTML={markdownify(banner.title)}
              />
              {/* Rotating Text Decoration */}
              <span
                data-aos="fade-up-sm"
                data-aos-delay="150"
                className="absolute top-[0.55em] -right-[0.7em] translate-y-[-25%] translate-x-[5%] w-[200px] h-[200px]"
              >
                <svg
                  className="absolute inset-0 w-full h-full scale-[0.6] lg:scale-[0.8] spin-animation origin-center"
                  viewBox="0 0 220 220"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="110"
                    cy="110"
                    r="108"
                    stroke="white"
                    strokeOpacity={0.5}
                    strokeWidth={1}
                    fill="none"
                  />
                  <circle
                    cx="110"
                    cy="110"
                    r="70"
                    stroke="white"
                    strokeOpacity={0.5}
                    strokeWidth={1}
                    fill="none"
                  />
                  <path
                    id="circlePath"
                    d="M 110,110 m -85,0 a 85,85 0 1,1 170,0 a 85,85 0 1,1 -170,0"
                    fill="none"
                  />
                  <text>
                    <textPath
                      href="#circlePath"
                      startOffset="0"
                      textLength="520"
                      style={{
                        fontSize: "20px",
                        fontFamily: "'DM Sans', sans-serif",
                        fontWeight: 500,
                        letterSpacing: "2px",
                        fill: "white",
                        opacity: 0.6,
                      }}
                    >
                      {banner.spinning_text}
                    </textPath>
                  </text>
                </svg>
              </span>
              {/* /Rotating Text Decoration */}
            </div>
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mt-10">
              <p
                data-aos="fade-up-sm"
                data-aos-delay="300"
                className="text-xl text-white/85 flex-1 text-balance leading-[34px]"
                dangerouslySetInnerHTML={markdownify(banner.content)}
              />
              <div data-aos="fade-up-sm" data-aos-delay="450">
                <Button {...banner.button} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
