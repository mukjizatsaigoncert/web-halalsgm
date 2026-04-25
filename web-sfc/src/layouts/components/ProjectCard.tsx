import DynamicIcon from "@/helpers/DynamicIcon";
import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { Project } from "@/types";
import Link from "next/link";

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  return (
    <div
      data-aos="fade-up-sm"
      data-aos-delay={index * 100 + 150}
      className="mb-[7.5rem] lg:mb-[13.75rem] last:mb-0 group relative max-md:w-[80%] mx-auto break-inside-avoid"
    >
      <div className="overflow-hidden">
        <ImageFallback
          src={project.frontmatter.image!}
          height={800}
          width={800}
          loading="lazy"
          alt={project.frontmatter.title}
          className="group-hover:scale-105 transition duration-300 ease-out"
        />
      </div>

      <div className="flex gap-2 flex-wrap items-center pt-8 justify-between">
        <Link
          href={`/projects/${project.slug}`}
          className="before:absolute before:inset-0"
        >
          <h3
            className="relative pl-5 h5 font-medium before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2.5 before:h-2.5 before:rounded-full before:bg-current"
            dangerouslySetInnerHTML={markdownify(project.frontmatter.title)}
          />
        </Link>

        <div className="flex gap-2 items-center justify-between w-full">
          <p
            dangerouslySetInnerHTML={markdownify(
              project.frontmatter.project_type || ""
            )}
          />

          <div className="flex h-6 w-6 overflow-hidden items-center justify-center">
            <div className="h-6 w-6 transition duration-500 ease-out group-hover:-translate-y-full flex flex-col items-center text-primary">
              <div className="min-w-6 flex justify-center items-center min-h-6">
                <DynamicIcon
                  icon="FaArrowRightLong"
                  className="text-2xl -rotate-45"
                />
              </div>
              <div
                className="min-w-6 flex justify-center items-center min-h-6"
                aria-hidden="true"
              >
                <DynamicIcon
                  icon="FaArrowRightLong"
                  className="text-2xl -rotate-45"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
