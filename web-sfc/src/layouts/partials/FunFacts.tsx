import Counter from "@/components/Counter";
import { markdownify } from "@/lib/utils/textConverter";
import type { Homepage } from "@/types";

const FunFacts = ({
  funFacts,
  isNoSectionTop = false,
}: {
  funFacts: Homepage["frontmatter"]["fun_facts"];
  isNoSectionTop?: boolean;
}) => {
  return (
    <>
      {funFacts.enable && (
        <section className={`section ${isNoSectionTop && "pt-0"}`}>
          <div className="container">
            <div
              className={`${
                funFacts.metrics.length < 2
                  ? "text-center"
                  : "grid justify-start text-left md:grid-cols-2 lg:grid-cols-4"
              } gap-8 text-wrap break-words overflow-hidden w-[85%] lg:w-full mx-auto`}
            >
              {funFacts.metrics?.map((metric, index) => (
                <div
                  key={index}
                  className={`${funFacts.metrics.length < 2 && "text-center"}`}
                >
                  <p
                    className={`${funFacts.metrics.length < 2 ? "h1" : "h1"} font-medium text-primary mb-2 break-words overflow-hidden`}
                  >
                    <Counter
                      count={metric.counter.count}
                      suffix={metric.counter.count_suffix}
                      prefix={metric.counter.count_prefix}
                      duration={metric.counter.count_duration}
                    />
                  </p>
                  <h3
                    className="text-xl font-normal text-primary/80 mb-2"
                    dangerouslySetInnerHTML={markdownify(metric.name || "")}
                  />
                  <p
                    className="text-balance"
                    dangerouslySetInnerHTML={markdownify(
                      metric.description || ""
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default FunFacts;
