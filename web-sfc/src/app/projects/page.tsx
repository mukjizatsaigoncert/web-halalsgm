import ProjectCard from "@/components/ProjectCard";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import CallToAction from "@/partials/CallToAction";
import FAQs from "@/partials/FAQs";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Faqs, Project, Projects } from "@/types";

export default function ProjectsPage() {
  const projectsIndex = getListPage<Projects>("projects/_index.md");
  const faqsData = getListPage("faqs/_index.md") as Faqs;
  const projects = getSinglePage("projects") as Project[];

  return (
    <>
      <SeoMeta {...projectsIndex.frontmatter} />
      <PageHeader title={projectsIndex.frontmatter.title} />
      <section className="section">
        <div className="container">
          <div className="md:columns-2 gap-x-[150px]">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </div>
        <CallToAction />
        <FAQs isNoSectionBottom isNoSectionTop faqsData={faqsData} />
      </section>
    </>
  );
}
