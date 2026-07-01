import config from "@/config/config.json";
import ImageFallback from "@/helpers/ImageFallback";
import Link from "next/link";

const Logo = ({ src }: { src?: string }) => {
  // destructuring items from config object
  const {
    logo,
    logo_width,
    logo_height,
    logo_text,
    logo_mobile,
    logo_mobile_width,
    logo_mobile_height,
    title,
  }: {
    logo: string;
    logo_width: string | number;
    logo_height: string | number;
    logo_text: string;
    logo_mobile: string;
    logo_mobile_width?: string | number;
    logo_mobile_height?: string | number;
    title: string;
  } = config.site;

  const logoPath = src ? src : logo;
  const logoMobilePath = logo_mobile || logoPath;

  // Convert width and height to numbers
  const width =
    typeof logo_width === "string"
      ? parseInt((logo_width as string).replace("px", ""))
      : logo_width;
  const height =
    typeof logo_height === "string"
      ? parseInt((logo_height as string).replace("px", ""))
      : logo_height;

  // Mobile logo dimensions (fallback to smaller desktop size)
  const mobileWidth = logo_mobile_width
    ? typeof logo_mobile_width === "string"
      ? parseInt((logo_mobile_width as string).replace("px", ""))
      : logo_mobile_width
    : 35;
  const mobileHeight = logo_mobile_height
    ? typeof logo_mobile_height === "string"
      ? parseInt((logo_mobile_height as string).replace("px", ""))
      : logo_mobile_height
    : 110;

  return (
    <Link href="/" className="navbar-brand inline-block">
      {logoPath || logoMobilePath ? (
        <>
          {/* Mobile Logo - visible on small screens */}
          {logoMobilePath && (
            <ImageFallback
              width={mobileWidth * 2}
              height={mobileHeight * 2}
              src={logoMobilePath}
              alt={title}
              priority
              className="block lg:hidden"
              style={{
                height: `${mobileHeight}px`,
                width: `${mobileWidth}px`,
              }}
            />
          )}
          {/* Desktop Logo - visible on large screens */}
          {logoPath && (
            <ImageFallback
              width={width * 2}
              height={height * 2}
              src={logoPath}
              alt={title}
              priority
              className="hidden lg:block"
              style={{
                height: `${height}px`,
                width: `${width}px`,
              }}
            />
          )}
        </>
      ) : logo_text ? (
        logo_text
      ) : (
        title
      )}
    </Link>
  );
};

export default Logo;
