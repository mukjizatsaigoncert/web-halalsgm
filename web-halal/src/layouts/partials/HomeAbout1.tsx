import ImageFallback from "@/helpers/ImageFallback";

interface HomeAbout1Props {
  tag?: string;
  heading: string;
  description: string;
  image1: string;
  image2: string;
}

export default function HomeAbout1({
  tag = "Xây dựng một nền tảng vững chắc",
  heading = "Định hình chất lượng bằng chuyên môn của chúng tôi",
  description = "Chúng tôi hiểu rằng mỗi dự án của khách hàng là một ước mơ, chúng tôi trân trọng điều đó và luôn làm tốt nhất nhiệm vụ của mình, mang đến những công trình chất lượng.",
  image1 = "/images/custom/anh1.jpg",
  image2 = "/images/custom/anh2.jpg",
}: Partial<HomeAbout1Props>) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 xl:max-w-[1290px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left — tall image with right padding offset */}
          <div
            className="overflow-hidden rounded-2xl lg:pr-24"
            data-aos="fade-right-sm"
          >
            <ImageFallback
              src={image1}
              width={600}
              height={720}
              alt="About"
              className="w-full h-[400px] lg:h-[520px] object-cover rounded-2xl"
            />
          </div>

          {/* Right — content + second image */}
          <div className="flex flex-col gap-6" data-aos="fade-left-sm" data-aos-delay="300">
            <p className="text-secondary text-sm font-semibold uppercase tracking-widest">
              {tag}
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-dark leading-tight">
              {heading}
            </h2>
            <p className="text-text leading-relaxed">{description}</p>
            <div className="overflow-hidden rounded-2xl">
              <ImageFallback
                src={image2}
                width={600}
                height={360}
                alt="About 2"
                className="w-full h-56 object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
