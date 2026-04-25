import Breadcrumbs from "@/components/Breadcrumbs";
import { humanize } from "@/lib/utils/textConverter";

const PageHeader = ({
  title = "",
  isContactPage = false,
}: {
  title?: string;
  isContactPage?: boolean;
}) => {
  return (
    <section>
      <div className="text-center">
        <div
          className={`${isContactPage ? "h-[400px] lg:h-[650px]" : "pt-[240px] pb-[140px]"} bg-[url(/images/custom/anh1.jpg)] bg-cover bg-center bg-no-repeat relative`}
        >
          {/* Dark overlay để text nổi bật hơn */}
          <div className="absolute inset-0 bg-black/50"></div>

          {!isContactPage && (
            <div className="relative z-10">
              <h1
                data-aos="zoom-out-sm"
                data-aos-delay="150"
                className="text-white drop-shadow-lg"
              >
                {humanize(title)}
              </h1>
              <Breadcrumbs className="mt-3" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
