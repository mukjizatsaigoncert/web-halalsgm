"use client";

import React, { useState } from "react";

const Accordion = ({
  title,
  children,
  className,
  id,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  id?: number;
}) => {
  const [show, setShow] = useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState(show ? "auto" : "0px");

  // Listen for close events from other accordions
  React.useEffect(() => {
    const handler = (e: CustomEvent) => {
      // Close this accordion if it's not the one that was just opened
      if (e.detail.openedId !== id) {
        setShow(false);
      }
    };

    // Use a type assertion to handle the custom event
    window.addEventListener(
      "accordion:toggle" as any,
      handler as EventListener
    );

    return () => {
      window.removeEventListener(
        "accordion:toggle" as any,
        handler as EventListener
      );
    };
  }, [id]);

  React.useEffect(() => {
    if (show) {
      setHeight(`${contentRef.current?.scrollHeight}px`);

      // Dispatch event to close other accordions
      const event = new CustomEvent("accordion:toggle", {
        detail: { openedId: id },
      });
      window.dispatchEvent(event);
    } else {
      setHeight("0px");
    }
  }, [show, id]);

  return (
    <div className={`accordion ${className}`} data-accordion-id={id}>
      <button
        aria-expanded={show}
        className={`accordion-header ${show ? "pb-2" : ""}`}
        onClick={() => setShow(!show)}
      >
        <div className="flex items-start justify-between w-full">
          <div className="flex items-start gap-8 xl:gap-20">
            {typeof id === "number" && (
              <p className="text-primary/25 text-lg shrink-0 my-0">
                {String(id + 1).padStart(2, "0")}
              </p>
            )}
            <h5>{title}</h5>
          </div>
          <div className="w-6 flex-shrink-0 max-md:scale-50">
            <svg
              className={`transform transition-transform duration-500 ${show ? "rotate-0" : "rotate-180"}`}
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="none"
              viewBox="0 0 32 32"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M16 25.334V6.666m0 0L25.332 16m-9.334-9.333L6.666 16"
              />
            </svg>
          </div>
        </div>
      </button>

      <div
        ref={contentRef}
        style={{ height, overflow: "hidden", transition: "height 0.5s ease" }}
      >
        {show && (
          <div className="accordion-content transition-all duration-500 ease-in-out opacity-100 translate-y-0 pl-14 xl:pl-26 text-balance w-full">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Accordion;
