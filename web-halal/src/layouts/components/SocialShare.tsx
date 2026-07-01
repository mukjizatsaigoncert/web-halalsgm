"use client";

import DynamicIcon from "@/helpers/DynamicIcon";

interface SocialShareProps {
  url: string;
  title: string;
  className?: string;
}

export default function SocialShare({
  url,
  title,
  className = "",
}: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "Facebook",
      icon: "FaFacebook",
      link: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:text-[#1877F2]",
    },
    {
      name: "Twitter",
      icon: "FaTwitter",
      link: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-[#1DA1F2]",
    },
    {
      name: "LinkedIn",
      icon: "FaLinkedin",
      link: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
      color: "hover:text-[#0A66C2]",
    },
    {
      name: "Telegram",
      icon: "FaTelegram",
      link: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      color: "hover:text-[#0088cc]",
    },
  ];

  const handleShare = (link: string) => {
    window.open(link, "_blank", "width=600,height=400");
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <p className="text-sm font-medium text-body-color mb-4 uppercase tracking-wider">
        Chia sẻ bài viết
      </p>
      <ul className="flex items-center gap-4">
        {shareLinks.map((social) => (
          <li key={social.name}>
            <button
              aria-label={`Chia sẻ trên ${social.name}`}
              onClick={() => handleShare(social.link)}
              className={`inline-flex items-center justify-center w-10 h-10 rounded-full bg-light text-body-color transition-all duration-300 ${social.color} hover:scale-110`}
            >
              <span className="sr-only">{social.name}</span>
              <DynamicIcon
                className="inline-block text-lg"
                icon={social.icon}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
