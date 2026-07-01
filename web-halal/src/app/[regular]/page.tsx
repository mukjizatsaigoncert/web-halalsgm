import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import PageHeader from "@/partials/PageHeader";
import SeoMeta from "@/partials/SeoMeta";
import { Page } from "@/types";

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams = () => {
  const getRegularPages = getSinglePage<Page["frontmatter"]>("pages");

  const regularPages = getRegularPages.map((page) => ({
    regular: page.slug,
  }));

  return regularPages;
};

// for all regular pages
const RegularPages = async (props: {
  params: Promise<{ regular: string }>;
}) => {
  const params = await props.params;
  const regularData = getSinglePage<Page["frontmatter"]>("pages");
  const data = regularData.filter((page) => page.slug === params.regular)[0];

  return (
    <>
      <SeoMeta {...data.frontmatter} />
      <PageHeader title={data.frontmatter.title} />
      <section className="section-sm">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-10">
              <div className="content">
                <MDXContent content={data.content} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegularPages;
