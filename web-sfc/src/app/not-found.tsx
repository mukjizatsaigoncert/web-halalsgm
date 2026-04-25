import Button from "@/components/Button";
import SeoMeta from "@/partials/SeoMeta";

const NotFound = async () => {
  return (
    <>
      <SeoMeta title="Page Not Found" />
      <section className="relative pt-[260px] pb-[160px] text-center overflow-hidden">
        <div
          className="absolute inset-0 bg-[url(/images/page-header.png)] bg-cover bg-center grayscale-[100%] z-0"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 container">
          <div className="row justify-center">
            <div className="sm:col-10 md:col-8 lg:col-6">
              <span className="text-h1 lg:text-[6rem] block font-medium text-white">
                Rất tiếc!
              </span>
              <div className="content mb-14">
                <p className="text-white">
                  Bạn có thể đã nhập sai URL hoặc trang này đã bị xóa.
                </p>
              </div>
              <Button enable label="Quay về trang chủ" link="/" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFound;
