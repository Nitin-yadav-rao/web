import type { PostBlock } from "@/types";

export function PostBody({ blocks }: { blocks: PostBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p key={i} className="mb-[26px] text-pretty text-xl leading-[1.72] text-fg">
                {block.text}
              </p>
            );
          case "heading":
            return (
              <h2
                key={i}
                className="mb-[18px] mt-11 font-display text-[34px] font-normal leading-[1.12] tracking-[-0.01em] text-fg"
              >
                {block.text}
              </h2>
            );
          case "quote":
            return (
              <blockquote
                key={i}
                className="my-[34px] border-l-2 border-accent bg-bg2 px-[26px] py-[22px] text-xl italic leading-[1.6] text-fg2"
              >
                &ldquo;{block.text}&rdquo;
              </blockquote>
            );
          case "callout":
            return (
              <div key={i} className="my-11 border border-line p-7">
                <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  {block.label}
                </div>
                <p className="m-0 text-pretty text-[19px] leading-[1.65] text-fg2">{block.text}</p>
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
