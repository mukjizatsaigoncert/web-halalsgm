import Button from "@/components/Button";
import ProjectCard from "@/components/ProjectCard";
import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import type { Homepage, Project } from "@/types";

export default function HomeProjectsSection({
  projects,
}: {
  projects: Homepage["frontmatter"]["projects"];
}) {
  const allProjects = getSinglePage("projects") as Project[];
  const projectsSingle = allProjects.filter(
    (f) => f.frontmatter.featured_in_homepage
  );

  const { enable, title, subtitle, button } = projects;

  return (
    <>
      {enable && (
        <section className="section">
          <div className="container">
            <div className="md:columns-2 gap-x-[150px]">
              <div className="mb-[5rem] lg:mb-[11rem] max-md:text-center">
                <p
                  data-aos="fade-up-sm"
                  data-aos-delay="150"
                  className="font-medium uppercase"
                  dangerouslySetInnerHTML={markdownify(subtitle)}
                />
                <h2
                  data-aos="fade-up-sm"
                  data-aos-delay="250"
                  className="mt-3 font-medium"
                  dangerouslySetInnerHTML={markdownify(title)}
                />
              </div>

              {projectsSingle.map((project, i) => (
                <ProjectCard key={project.slug} project={project} index={i} />
              ))}
            </div>

            <div className="max-md:mt-14 max-md:text-center">
              <Button {...button} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
