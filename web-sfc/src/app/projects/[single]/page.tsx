import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import CallToAction from "@/partials/CallToAction";
import SeoMeta from "@/partials/SeoMeta";
import type { Project } from "@/types";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const projects = getSinglePage<Project>("projects");
  return projects.map((project) => ({
    single: project.slug,
  }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ single: string }>;
}) {
  const { single } = await params;
  const projects = getSinglePage("projects") as Project[];
  const project = projects.find((project) => project.slug === single);

  if (!project) {
    return notFound();
  }

  const { title, meta_title, description, image, client_name, project_type } =
    project.frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section>
        <div className="container">
          <div className="row">
            <h1
              className="lg:text-[6rem] pt-[12.5rem] pb-[8.125rem] text-center"
              dangerouslySetInnerHTML={markdownify(title)}
            />
          </div>
          <div className="row justify-center">
            <div className="col-11 mx-auto lg:col-3">
              <div className="max-lg:flex flex-wrap justify-between lg:sticky gap-10 top-30 pb-10">
                <div>
                  <p className="text-primary text-lg mb-3">Client Name</p>
                  <p
                    className="text-lg"
                    dangerouslySetInnerHTML={markdownify(client_name!)}
                  />
                </div>
                <div className="lg:pt-10">
                  <p className="text-primary text-lg mb-3">Project Type</p>
                  <p
                    className="text-lg"
                    dangerouslySetInnerHTML={markdownify(project_type!)}
                  />
                </div>
              </div>
            </div>
            <article className="col-11 mx-auto lg:col-9">
              {image && (
                <div className="pb-20">
                  <ImageFallback
                    src={image}
                    height={500}
                    width={1200}
                    alt={title}
                    className="w-full"
                  />
                </div>
              )}
              <div className="content mb-10">
                <MDXContent content={project.content} />
              </div>
            </article>
          </div>
        </div>
      </section>
      <CallToAction isNoSectionBottom />
    </>
  );
}
